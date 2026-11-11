import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface Icd10Item {
  code: string;
  name: string;
}

interface Icd10SearchProps {
  onSelect: (code: string, name: string) => void;
  selectedDiagnosis?: string;
}

export const Icd10Search: React.FC<Icd10SearchProps> = ({ onSelect, selectedDiagnosis }) => {
  const [query, setQuery] = useState(selectedDiagnosis || '');
  const [icdList, setIcdList] = useState<Icd10Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    fetch('/assets/icd10.csv')
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n');
        const results: Icd10Item[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const commaIdx = line.indexOf(',');
          if (commaIdx !== -1) {
            const code = line.substring(0, commaIdx).trim().replace(/"/g, '');
            let name = line.substring(commaIdx + 1).trim().replace(/"/g, '');
            results.push({ code, name });
          }
        }
        setIcdList(results);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load ICD-10 CSV:', err);
        setLoading(false);
      });
  }, []);

  const filtered = query.trim() === '' ? [] : icdList.filter(item => 
    item.code.toLowerCase().includes(query.toLowerCase()) ||
    item.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 50);

  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-slate-700 mb-1">
        Diagnosis (ບົ່ງມະຕິພະຍາດ / ICD-10) <span className="text-rose-500">*</span>
      </label>
      
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={loading ? "ກຳລັງໂຫຼດຖານຂໍ້ມູນ ICD-10..." : "ພິມຄົ້ນຫາລະຫັດ ຫຼື ຊື່ພະຍາດ (ເຊັ່ນ: A00, Fever)..."}
          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden bg-white"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        {loading && (
          <Loader2 className="w-4 h-4 text-teal-600 animate-spin absolute right-3 top-3" />
        )}
      </div>

      {isOpen && !loading && filtered.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filtered.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                const textVal = `${item.code} - ${item.name}`;
                setQuery(textVal);
                onSelect(item.code, item.name);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs hover:bg-teal-50 border-b border-slate-100 flex items-center justify-between gap-2 cursor-pointer"
            >
              <div>
                <span className="font-mono font-bold text-teal-800 mr-2">{item.code}</span>
                <span className="text-slate-800">{item.name}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
