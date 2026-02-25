'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { MODEL_GROUPS } from '@/lib/constants/models';
import { Check, ChevronsUpDown } from 'lucide-react';

interface ModelComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function ModelCombobox({
  value,
  onChange,
  placeholder = 'Select or type a model...',
  className,
}: ModelComboboxProps) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const query = value.toLowerCase();

  const filteredGroups = MODEL_GROUPS.map((group) => ({
    ...group,
    models: group.models.filter(
      (m) => m.id.toLowerCase().includes(query) || m.name.toLowerCase().includes(query)
    ),
  })).filter((g) => g.models.length > 0);

  const flatFiltered = filteredGroups.flatMap((g) => g.models);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset highlight when filtered list changes
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [value]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-model-option]');
      items[highlightedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  const selectModel = useCallback(
    (id: string) => {
      onChange(id);
      setOpen(false);
      inputRef.current?.blur();
    },
    [onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setOpen(true);
      return;
    }

    if (!open) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < flatFiltered.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : flatFiltered.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && flatFiltered[highlightedIndex]) {
          selectModel(flatFiltered[highlightedIndex].id);
        }
        break;
      case 'Escape':
        setOpen(false);
        break;
    }
  };

  let optionIndex = -1;

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 pr-9 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#135bec] focus:border-transparent transition-all"
          role="combobox"
          aria-expanded={open}
          aria-controls="model-combobox-listbox"
          aria-autocomplete="list"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => {
            setOpen((prev) => !prev);
            inputRef.current?.focus();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Toggle model suggestions"
        >
          <ChevronsUpDown className="size-4" />
        </button>
      </div>

      {open && (
        <div
          ref={listRef}
          id="model-combobox-listbox"
          role="listbox"
          className="absolute z-50 mt-1 w-full max-h-72 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg"
        >
          {filteredGroups.length === 0 ? (
            <div className="px-3 py-4 text-center text-sm text-slate-500">
              No matching models. Custom value will be used.
            </div>
          ) : (
            filteredGroups.map((group) => (
              <div key={group.provider}>
                <div className="sticky top-0 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-100">
                  {group.provider}
                </div>
                {group.models.map((model) => {
                  optionIndex++;
                  const idx = optionIndex;
                  const isSelected = value === model.id;
                  const isHighlighted = highlightedIndex === idx;
                  return (
                    <button
                      key={model.id}
                      type="button"
                      data-model-option
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => selectModel(model.id)}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={cn(
                        'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors',
                        isHighlighted && 'bg-[#135bec]/5',
                        isSelected && 'font-medium text-[#135bec]'
                      )}
                    >
                      <Check
                        className={cn(
                          'size-4 shrink-0',
                          isSelected ? 'opacity-100 text-[#135bec]' : 'opacity-0'
                        )}
                      />
                      <span className="flex-1">{model.name}</span>
                      <span className="text-xs text-slate-400 font-mono">{model.id}</span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
