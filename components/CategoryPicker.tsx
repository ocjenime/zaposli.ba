'use client';

import { Check } from 'lucide-react';
import { CATEGORY_GROUPS, getGroupCategories } from '@/lib/category-groups';

interface CategoryPickerProps {
  selected: string[];
  onToggle: (slug: string) => void;
}

/**
 * Odabir kategorija grupisan u istih 10 grupa kao objava posla,
 * homepage bar i /kategorije/ (isti nazivi i ikonice).
 */
export default function CategoryPicker({ selected, onToggle }: CategoryPickerProps) {
  return (
    <div className="space-y-3">
      {CATEGORY_GROUPS.map((group) => {
        const items = getGroupCategories(group);
        if (items.length === 0) return null;
        const selectedCount = items.filter((c) => selected.includes(c.slug)).length;
        const Icon = group.Icon;
        return (
          <div
            key={group.slug}
            className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800"
          >
            <div className="flex items-center gap-2.5 px-4 py-3 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-700">
              <span className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-brand-orange" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-bold text-gray-900 dark:text-white leading-tight">
                  {group.title}
                </span>
                <span className="block text-xs text-gray-500 dark:text-gray-400 leading-snug truncate">
                  {group.sub}
                </span>
              </span>
              {selectedCount > 0 && (
                <span className="text-xs font-bold text-brand-orange bg-orange-50 border border-orange-100 rounded-full px-2 py-0.5 shrink-0">
                  {selectedCount}
                </span>
              )}
            </div>
            <div className="p-2 grid sm:grid-cols-2 gap-1.5">
              {items.map((category) => {
                const isSelected = selected.includes(category.slug);
                return (
                  <button
                    key={category.slug}
                    type="button"
                    onClick={() => onToggle(category.slug)}
                    className={`flex items-center gap-2.5 text-left rounded-xl px-3 py-2.5 transition-colors ${
                      isSelected
                        ? 'bg-orange-50/70 dark:bg-orange-500/10'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                        isSelected ? 'bg-brand-orange border-brand-orange' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {category.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
