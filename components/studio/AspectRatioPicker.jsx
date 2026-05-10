'use client';

import DropdownSelect from '@/components/ui/DropdownSelect';

export default function AspectRatioPicker({ value, onChange, options = ['1:1', '16:9', '9:16', '4:3', '3:4', '2:3', '3:2'] }) {
  return (
    <DropdownSelect
      value={value}
      onChange={onChange}
      options={options}
      placeholder="Aspect Ratio"
    />
  );
}
