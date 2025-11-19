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
    <div className='py-3' role='search'>
      <label htmlFor='skill-search' className='sr-only'>
        Search skills by name
      </label>

      <input
        id='skill-search'
        type='search'
        value={value}
        aria-label='Search skills by name'
        onChange={(e) => {
          onChange(e.target.value);
        }}
        placeholder='Search skills by name'
        className='
            w-full
            pl-5 pr-4 py-2
            bg-white
            border border-gray-300
            rounded-full
            shadow-sm
            placeholder:text-gray-400
            focus:outline-none
            focus:ring-2 focus:ring-blue-300
            truncate
          '
      />
    </div>
  );
}
