import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Truck, Users } from 'lucide-react';
import { ReferralRecord } from '../types/referral';

interface TriageSummaryProps {
  referrals: ReferralRecord[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const TriageSummary: React.FC<TriageSummaryProps> = ({
  referrals,
  activeFilter,
  onFilterChange,
}) => {
  const counts = {
    all: referrals.length,
    emergency: referrals.filter(r => r.triageLevel === 'emergency' && r.status !== 'cancelled' && r.status !== 'refer_back').length,
    urgent: referrals.filter(r => r.triageLevel === 'urgent' && r.status !== 'cancelled' && r.status !== 'refer_back').length,
    routine: referrals.filter(r => r.triageLevel === 'routine' && r.status !== 'cancelled' && r.status !== 'refer_back').length,
    in_transit: referrals.filter(r => r.status === 'in_transit').length,
  };

  const cards = [
    {
      id: 'all',
      label: 'ຄົນເຈັບທັງໝົດ',
      sublabel: 'Active Queue',
      count: counts.all,
      icon: Users,
      color: 'border-emerald-900/10 text-emerald-950 bg-white hover:border-emerald-900/20',
      activeColor: 'ring-2 ring-emerald-700 bg-emerald-50/50 border-emerald-400',
      countColor: 'text-emerald-950',
    },
    {
      id: 'emergency',
      label: 'ສຸກເສີນວິກິດ (Level 1)',
      sublabel: 'Red Triage',
      count: counts.emergency,
      icon: AlertCircle,
      color: 'border-rose-200 text-rose-900 bg-rose-50/30 hover:border-rose-300',
      activeColor: 'ring-2 ring-rose-600 bg-rose-50 border-rose-400',
      countColor: 'text-rose-700',
    },
    {
      id: 'urgent',
      label: 'ຮີບດ່ວນ (Level 2)',
      sublabel: 'Yellow Triage',
      count: counts.urgent,
      icon: AlertTriangle,
      color: 'border-amber-200 text-amber-900 bg-amber-50/30 hover:border-amber-300',
      activeColor: 'ring-2 ring-amber-600 bg-amber-50 border-amber-400',
      countColor: 'text-amber-700',
    },
    {
      id: 'in_transit',
      label: 'ກຳລັງນຳສົ່ງ (Ambulance)',
      sublabel: 'En Route',
      count: counts.in_transit,
      icon: Truck,
      color: 'border-teal-200 text-teal-900 bg-teal-50/30 hover:border-teal-300',
      activeColor: 'ring-2 ring-teal-700 bg-teal-50 border-teal-400',
      countColor: 'text-teal-800',
    },
    {
      id: 'routine',
      label: 'ທົ່ວໄປ (Level 3)',
      sublabel: 'Green Triage',
      count: counts.routine,
      icon: CheckCircle,
      color: 'border-emerald-200 text-emerald-900 bg-emerald-50/30 hover:border-emerald-300',
      activeColor: 'ring-2 ring-emerald-600 bg-emerald-50 border-emerald-400',
      countColor: 'text-emerald-700',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 mb-6 font-sans">
      {cards.map(card => {
        const Icon = card.icon;
        const isActive = activeFilter === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onFilterChange(isActive ? 'all' : card.id)}
            className={`p-3.5 rounded-2xl border text-left transition-all duration-150 shadow-2xs ${
              isActive ? card.activeColor : card.color
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 truncate">
                {card.label}
              </span>
              <Icon className="w-4 h-4 opacity-75 shrink-0" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className={`text-2xl font-bold tracking-tight font-mono tabular-nums ${card.countColor}`}>
                {card.count}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {card.sublabel}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
