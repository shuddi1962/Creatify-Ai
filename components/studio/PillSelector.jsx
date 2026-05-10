'use client';

import DropdownSelect from '@/components/ui/DropdownSelect';

export default function PillSelector({ options = [], value, onChange }) {
  return (
    <DropdownSelect
      value={value}
      onChange={onChange}
      options={options}
      placeholder="Select..."
    />
  );
}
