/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className='p-3'>
      <label htmlFor='skill-search' className='block mb-1 font-medium'>
        Search Skills
      </label>

      <input
        id='skill-search'
        type='text'
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        placeholder='Search skills'
        className='w-full px-3 py-2 border rounded'
      />
    </div>
  );
}
