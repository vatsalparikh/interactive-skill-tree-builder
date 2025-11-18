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
      <label htmlFor='search' className='sr-only'>
        Search skills by name
      </label>

      <input
        id='skill-search'
        type='text'
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        placeholder='Search skills by name'
        className='
            w-full
            pl-10 pr-4 py-2
            bg-white
            border border-gray-300
            rounded-full
            shadow-sm
            placeholder:text-gray-400
            focus:outline-none
            focus:ring-2 focus:ring-blue-300
          '
      />
    </div>
  );
}
