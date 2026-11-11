import { createClient, Client } from '@libsql/client/web';
import { DatabaseStatus, DistrictHospital, ReferralRecord, AuthSession } from '../types/referral';
import { INITIAL_MOCK_REFERRALS, DEFAULT_DISTRICT_HOSPITALS } from '../data/facilities';

const STORAGE_KEY = 'emscps_referrals_v1';
const DB_CONFIG_KEY = 'emscps_turso_config_v1';
const HOSPITALS_STORAGE_KEY = 'emscps_district_hospitals_v1';
const AUTH_SESSION_KEY = 'emscps_auth_session_v1';

class ReferralDatabaseService {
  private client: Client | null = null;
  private isTursoReady = false;
  private tursoUrl: string = '';
  private tursoToken: string = '';

  constructor() {
    this.initDatabase();
    this.ensureHospitalsSeed();
  }

  private initDatabase() {
    let savedConfig: { url?: string; token?: string } = {};
    try {
      const raw = localStorage.getItem(DB_CONFIG_KEY);
      if (raw) savedConfig = JSON.parse(raw);
    } catch {
      // ignore
    }

    const envUrl = (import.meta as any).env?.VITE_TURSO_DATABASE_URL || '';
    const envToken = (import.meta as any).env?.VITE_TURSO_AUTH_TOKEN || '';

    this.tursoUrl = savedConfig.url || envUrl;
    this.tursoToken = savedConfig.token || envToken;

    if (this.tursoUrl) {
      try {
        this.client = createClient({
          url: this.tursoUrl,
          authToken: this.tursoToken || undefined,
        });
        this.setupTursoSchema();
      } catch (err) {
        console.warn('Turso LibSQL init error, falling back to local storage:', err);
        this.client = null;
        this.isTursoReady = false;
      }
    }

    this.ensureLocalStorageSeed();
  }

  private async setupTursoSchema() {
    if (!this.client) return;
    try {
      await this.client.execute(`
        CREATE TABLE IF NOT EXISTS referrals (
          id TEXT PRIMARY KEY,
          patient_name TEXT,
          triage_level TEXT,
          status TEXT,
          district TEXT,
          origin_hospital_id TEXT,
          data TEXT,
          created_at TEXT,
          updated_at TEXT
        );
      `);
      this.isTursoReady = true;
    } catch (err) {
      console.warn('Failed to ensure Turso table schema:', err);
      this.isTursoReady = false;
    }
  }

  private ensureLocalStorageSeed() {
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (!existing) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_REFERRALS));
      }
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }
  }

  private ensureHospitalsSeed() {
    try {
      const existing = localStorage.getItem(HOSPITALS_STORAGE_KEY);
      if (!existing) {
        localStorage.setItem(HOSPITALS_STORAGE_KEY, JSON.stringify(DEFAULT_DISTRICT_HOSPITALS));
      } else {
        const list: DistrictHospital[] = JSON.parse(existing);
        let changed = false;
        const upgraded = list.map(h => {
          const match = DEFAULT_DISTRICT_HOSPITALS.find(dh => dh.id === h.id);
          const districtClean = h.district ? h.district.replace(/\s*\([^)]*\)/g, '') : (match?.district || 'ເມືອງປາກຊ່ອງ');
          if (!h.province || !h.ambulancePlate1 || h.district !== districtClean) {
            changed = true;
            return {
              ...h,
              district: districtClean,
              province: h.province || match?.province || 'ຈຳປາສັກ',
              directorName: h.directorName || match?.directorName || 'ດຣ. ຜູ້ອຳນວຍການ',
              ambulancePlate1: h.ambulancePlate1 || match?.ambulancePlate1 || 'ກກ 1122 ຈຳປາສັກ',
              ambulancePlate2: h.ambulancePlate2 || match?.ambulancePlate2 || 'ກຂ 3344 ຈຳປາສັກ',
            };
          }
          return h;
        });
        if (changed) {
          localStorage.setItem(HOSPITALS_STORAGE_KEY, JSON.stringify(upgraded));
        }
      }
    } catch (err) {
      console.warn('Hospital seed error:', err);
    }
  }

  // --- Auth Session Methods ---
  public getStoredSession(): AuthSession | null {
    try {
      const raw = localStorage.getItem(AUTH_SESSION_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return null;
  }

  public setStoredSession(session: AuthSession | null): void {
    try {
      if (session) {
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
      } else {
        localStorage.removeItem(AUTH_SESSION_KEY);
      }
    } catch (err) {
      console.error('Session write error:', err);
    }
  }

  // --- Hospital Management CRUD ---
  public getHospitals(): DistrictHospital[] {
    try {
      const raw = localStorage.getItem(HOSPITALS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (err) {
      console.error('Failed to get hospitals:', err);
    }
    return DEFAULT_DISTRICT_HOSPITALS;
  }

  public saveHospital(hospital: DistrictHospital): void {
    const list = this.getHospitals();
    const idx = list.findIndex(h => h.id === hospital.id);
    let updated: DistrictHospital[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = hospital;
    } else {
      updated = [...list, hospital];
    }
    localStorage.setItem(HOSPITALS_STORAGE_KEY, JSON.stringify(updated));
  }

  public deleteHospital(id: string): void {
    const list = this.getHospitals();
    const filtered = list.filter(h => h.id !== id);
    localStorage.setItem(HOSPITALS_STORAGE_KEY, JSON.stringify(filtered));
  }

  public resetDefaultHospitals(): void {
    localStorage.setItem(HOSPITALS_STORAGE_KEY, JSON.stringify(DEFAULT_DISTRICT_HOSPITALS));
  }

  // --- Referral Data Methods ---
  public getLocalReferrals(): ReferralRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Failed to parse local referrals:', err);
    }
    return INITIAL_MOCK_REFERRALS;
  }

  private saveLocalReferrals(records: ReferralRecord[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (err) {
      console.error('Failed to write to local storage:', err);
    }
  }

  public async getReferrals(): Promise<ReferralRecord[]> {
    if (this.client && this.isTursoReady) {
      try {
        const result = await this.client.execute(`
          SELECT data FROM referrals ORDER BY updated_at DESC
        `);
        if (result.rows && result.rows.length > 0) {
          const records: ReferralRecord[] = result.rows.map(row => JSON.parse(row.data as string));
          this.saveLocalReferrals(records);
          return records;
        } else {
          const local = this.getLocalReferrals();
          for (const item of local) {
            await this.saveToTurso(item);
          }
          return local;
        }
      } catch (err) {
        console.warn('Error fetching from Turso, using local cache:', err);
      }
    }
    return this.getLocalReferrals();
  }

  public async getReferralById(id: string): Promise<ReferralRecord | null> {
    const list = await this.getReferrals();
    return list.find(r => r.id === id) || null;
  }

  private async saveToTurso(record: ReferralRecord): Promise<boolean> {
    if (!this.client) return false;
    try {
      await this.client.execute({
        sql: `
          INSERT INTO referrals (id, patient_name, triage_level, status, district, origin_hospital_id, data, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            patient_name = excluded.patient_name,
            triage_level = excluded.triage_level,
            status = excluded.status,
            district = excluded.district,
            origin_hospital_id = excluded.origin_hospital_id,
            data = excluded.data,
            updated_at = excluded.updated_at
        `,
        args: [
          record.id,
          record.patientName,
          record.triageLevel,
          record.status,
          record.district,
          record.originHospitalId || '',
          JSON.stringify(record),
          record.createdAt,
          record.updatedAt,
        ],
      });
      return true;
    } catch (err) {
      console.error('Failed to save record to Turso:', err);
      return false;
    }
  }

  public async createReferral(record: Omit<ReferralRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<ReferralRecord> {
    const now = new Date().toISOString();
    const id = `REF-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;
    
    const newRecord: ReferralRecord = {
      ...record,
      id,
      createdAt: now,
      updatedAt: now,
    };

    const current = this.getLocalReferrals();
    const updated = [newRecord, ...current];
    this.saveLocalReferrals(updated);

    if (this.client && this.isTursoReady) {
      await this.saveToTurso(newRecord);
    }

    return newRecord;
  }

  public async updateReferral(id: string, updates: Partial<ReferralRecord>): Promise<ReferralRecord | null> {
    const current = this.getLocalReferrals();
    const index = current.findIndex(r => r.id === id);
    if (index === -1) return null;

    const updatedRecord: ReferralRecord = {
      ...current[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    current[index] = updatedRecord;
    this.saveLocalReferrals(current);

    if (this.client && this.isTursoReady) {
      await this.saveToTurso(updatedRecord);
    }

    return updatedRecord;
  }

  public async deleteReferral(id: string): Promise<boolean> {
    const current = this.getLocalReferrals();
    const filtered = current.filter(r => r.id !== id);
    this.saveLocalReferrals(filtered);

    if (this.client && this.isTursoReady) {
      try {
        await this.client.execute({
          sql: 'DELETE FROM referrals WHERE id = ?',
          args: [id],
        });
      } catch (err) {
        console.warn('Failed to delete from Turso:', err);
      }
    }
    return true;
  }

  public async getStatus(): Promise<DatabaseStatus> {
    const records = this.getLocalReferrals();
    let isConnected = false;
    let error: string | undefined;

    if (this.client && this.tursoUrl) {
      try {
        await this.client.execute('SELECT 1');
        isConnected = true;
      } catch (err: any) {
        isConnected = false;
        error = err?.message || 'Cannot reach Turso database';
      }
    }

    return {
      isConnected,
      provider: isConnected ? 'turso' : 'local',
      url: this.tursoUrl ? this.maskUrl(this.tursoUrl) : undefined,
      error,
      lastSync: new Date().toLocaleTimeString('lo-LA'),
      recordCount: records.length,
    };
  }

  private maskUrl(url: string): string {
    if (url.length < 15) return url;
    return url.substring(0, 14) + '...' + url.substring(url.length - 8);
  }

  public async configureTurso(url: string, token: string): Promise<{ success: boolean; message: string }> {
    try {
      const cleanUrl = url.trim();
      const cleanToken = token.trim();

      if (!cleanUrl) {
        this.client = null;
        this.isTursoReady = false;
        this.tursoUrl = '';
        this.tursoToken = '';
        localStorage.removeItem(DB_CONFIG_KEY);
        return { success: true, message: 'ປ່ຽນເປັນໂໝດ Local Storage ສຳເລັດແລ້ວ' };
      }

      const testClient = createClient({
        url: cleanUrl,
        authToken: cleanToken || undefined,
      });

      await testClient.execute('SELECT 1');

      this.client = testClient;
      this.tursoUrl = cleanUrl;
      this.tursoToken = cleanToken;
      localStorage.setItem(DB_CONFIG_KEY, JSON.stringify({ url: cleanUrl, token: cleanToken }));

      await this.setupTursoSchema();
      const local = this.getLocalReferrals();
      for (const item of local) {
        await this.saveToTurso(item);
      }

      return { success: true, message: 'ເຊື່ອມຕໍ່ Turso Database ສຳເລັດ ແລະ Sync ຂໍ້ມູນແລ້ວ!' };
    } catch (err: any) {
      return { success: false, message: `ການເຊື່ອມຕໍ່ລົ້ມເຫຼວ: ${err?.message || 'ກະລຸນາກວດສອບ URL ແລະ Token'}` };
    }
  }

  public resetSampleData() {
    this.saveLocalReferrals(INITIAL_MOCK_REFERRALS);
    if (this.client && this.isTursoReady) {
      for (const item of INITIAL_MOCK_REFERRALS) {
        this.saveToTurso(item);
      }
    }
  }

  // --- CSV Export with UTF-8 BOM (\uFEFF) for Excel in Lao Language ---
  public exportReferralsCsv(referrals: ReferralRecord[]): void {
    const headers = [
      'ເລກທີສົ່ງຕໍ່ (ID)',
      'ວັນທີສົ່ງ (Date)',
      'ເວລາ (Time)',
      'ລະດັບ Triage',
      'ສະຖານະ (Status)',
      'ຊື່-ນາມສະກຸນ (Patient Name)',
      'ອາຍຸ (Age)',
      'ເພດ (Gender)',
      'ບ້ານ (Village)',
      'ເມືອງ (District)',
      'HN / ບັດປະຈຳຕົວ',
      'ເບີໂທ (Phone)',
      'ປະກັນສຸຂະພາບ (Insurance)',
      'ໂຮງໝໍຕົ້ນທາງ (Origin Hospital)',
      'ພະແນກປາຍທາງ (Receiving Dept)',
      'ການບົ່ງມະຕິ (Diagnosis)',
      'ອາການຕົ້ນຕໍ (Chief Complaint)',
      'BP Systolic',
      'BP Diastolic',
      'Pulse Rate (PR)',
      'Resp Rate (RR)',
      'Temp (°C)',
      'SpO2 (%)',
      'GCS Total',
      'GCS Eye',
      'GCS Verbal',
      'GCS Motor',
      'GCS Severity',
      'ການປິ່ນປົວເບື້ອງຕົ້ນ (Initial Treatment)',
      'ເຫດຜົນສົ່ງຕໍ່ (Transfer Reason)',
      'ທ່ານໝໍຜູ້ສົ່ງ (Referring Doctor)',
      'ເບີໂທທ່ານໝໍ (Doctor Phone)',
      'ຜູ້ຮັບປາຍທາງ (Target Coordinator)',
      'ລົດສຸກເສີນ (Vehicle)',
    ];

    const escapeCsv = (val: any) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = referrals.map(r => [
      escapeCsv(r.id),
      escapeCsv(r.admissionDate || r.createdAt.split('T')[0]),
      escapeCsv(r.transferTime || ''),
      escapeCsv(r.triageLevel),
      escapeCsv(r.status),
      escapeCsv(r.patientName),
      escapeCsv(r.age),
      escapeCsv(r.gender === 'male' ? 'ຊາຍ' : 'ຍິງ'),
      escapeCsv(r.village),
      escapeCsv(r.district),
      escapeCsv(r.idCardOrHN),
      escapeCsv(r.phone || ''),
      escapeCsv(r.insuranceType || ''),
      escapeCsv(r.originHospital),
      escapeCsv(r.receivingDepartment),
      escapeCsv(r.provisionalDiagnosis),
      escapeCsv(r.chiefComplaint || r.presentIllness || ''),
      escapeCsv(r.vitalSigns.bpSystolic),
      escapeCsv(r.vitalSigns.bpDiastolic),
      escapeCsv(r.vitalSigns.pulseRate),
      escapeCsv(r.vitalSigns.respiratoryRate),
      escapeCsv(r.vitalSigns.temperature),
      escapeCsv(r.vitalSigns.spO2),
      escapeCsv(r.vitalSigns.gcs?.total ?? 15),
      escapeCsv(r.vitalSigns.gcs?.eye ?? 4),
      escapeCsv(r.vitalSigns.gcs?.verbal ?? 5),
      escapeCsv(r.vitalSigns.gcs?.motor ?? 6),
      escapeCsv(r.vitalSigns.gcs?.severity ?? 'mild'),
      escapeCsv(r.initialTreatment),
      escapeCsv(r.transferReason),
      escapeCsv(r.referringDoctor),
      escapeCsv(r.referringDoctorPhone),
      escapeCsv(r.targetCoordinator),
      escapeCsv(r.transportVehicle || r.ambulanceCode || ''),
    ]);

    const csvContent = '\uFEFF' + [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EMSCPS_Referral_Report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const dbService = new ReferralDatabaseService();
