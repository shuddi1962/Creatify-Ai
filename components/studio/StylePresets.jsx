'use client';

import DropdownSelect from '@/components/ui/DropdownSelect';

export default function StylePresets({ presets, value, onChange }) {
  return (
    <DropdownSelect
      value={value}
      onChange={onChange}
      options={presets || []}
      placeholder="Style"
    />
  );
}
