/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useId } from 'react';
import { Search, Stethoscope, AlertCircle, Check } from 'lucide-react';
import { icd10Service } from '../services/icd10Service';

interface Icd10ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export const Icd10Combobox: React.FC<Icd10ComboboxProps> = ({
  value,
  onChange,
  required = false
}) => {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Array<{ code: string; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasDatabaseCodes, setHasDatabaseCodes] = useState<boolean | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  // Sync external value
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Check if database has any codes loaded
  useEffect(() => {
    let isMounted = true;
    icd10Service.getStats().then((stats) => {
      if (isMounted) {
        setHasDatabaseCodes(stats.count > 0);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Debounced search
  useEffect(() => {
    if (!isOpen) return;

    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const matches = await icd10Service.searchCodes(trimmed, 40);
        setResults(matches);
        setHighlightedIndex(0);
      } catch (err) {
        console.error('ICD-10 search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: { code: string; name: string }) => {
    const formatted = `${item.code} - ${item.name}`;
    setQuery(formatted);
    onChange(formatted);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
        return;
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      if (isOpen && results.length > 0 && highlightedIndex >= 0 && highlightedIndex < results.length) {
        e.preventDefault();
        handleSelect(results[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative space-y-1">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          required={required}
          value={query}
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            onChange(val);
            setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          className="w-full p-3 pr-10 border border-emerald-400 rounded-xl bg-emerald-50/40 text-emerald-950 font-bold focus:border-emerald-600 focus:outline-none focus:ring-0 shadow-none appearance-none"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-800">
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-50 left-0 right-0 mt-1 max-h-72 overflow-y-auto bg-white rounded-xl border border-emerald-900/15 shadow-xl font-sans text-xs"
        >
          {isLoading ? (
            <div className="p-4 text-center text-slate-500 flex items-center justify-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin" />
              <span>ກຳລັງຄົ້ນຫາລະຫັດ ICD-10...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="p-1.5 space-y-0.5">
              <div className="px-3 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                <span>ຜົນການຄົ້ນຫາ ({results.length} ລາຍການ)</span>
                <span className="font-mono text-[10px] text-emerald-700">ກົດເລືອກ ຫຼື ໃຊ້ປຸ່ມລູກສອນ</span>
              </div>
              {results.map((item, idx) => {
                const isHighlighted = idx === highlightedIndex;
                const isSelected = value.startsWith(item.code);

                return (
                  <button
                    key={`${item.code}-${idx}`}
                    type="button"
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`w-full text-left p-2.5 rounded-lg flex items-start gap-2.5 transition-colors ${
                      isHighlighted
                        ? 'bg-emerald-50 text-emerald-950'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-mono font-bold text-xs bg-emerald-100/70 text-emerald-900 px-2 py-0.5 rounded shrink-0">
                      {item.code}
                    </span>
                    <span className="flex-1 font-medium text-xs leading-snug">
                      {item.name}
                    </span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-700 shrink-0 self-center" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : query.trim() ? (
            <div className="p-4 text-center space-y-1.5">
              <p className="text-slate-600 font-medium">
                ບໍ່ພົບລະຫັດ ຫຼື ຊື່ພະຍາດທີ່ຕົງກັບ <span className="font-bold text-emerald-950 font-mono">"{query}"</span>
              </p>
              <p className="text-[11px] text-slate-400">
                (ທ່ານຍັງສາມາດໃຊ້ຂໍ້ຄວາມທີ່ພິມນີ້ເປັນການບົ່ງມະຕິໄດ້ຕາມປົກກະຕິ)
              </p>
            </div>
          ) : hasDatabaseCodes === false ? (
            <div className="p-4 text-center space-y-2 bg-amber-50/60 rounded-xl m-1 border border-amber-200">
              <div className="flex items-center justify-center gap-1.5 text-amber-800 font-bold text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>ຍັງບໍ່ທັນມີຂໍ້ມູນລະຫັດ ICD-10 ໃນລະບົບ</span>
              </div>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                Admin ສາມາດອັບໂຫຼດໄຟລ໌ CSV ລະຫັດພະຍາດ (74,889 ລາຍການ) ໄດ້ທີ່ແທັບ <strong>ຕັ້ງຄ່າ &gt; ຕັ້ງຄ່າບົ່ງມະຕິ</strong>
              </p>
            </div>
          ) : (
            <div className="p-4 text-center text-slate-500 flex items-center justify-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-700" />
              <span>ພິມລະຫັດ ICD-10 (ເຊັ່ນ S06, I21) ຫຼື ພິມຊື່ພະຍາດ (ເຊັ່ນ Appendicitis, Trauma) ເພື່ອຄົ້ນຫາ</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
