/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import { useState } from 'react';

import type { SkillFormData } from '../types';

interface SkillFormProps {
  onSubmit: (data: SkillFormData) => void;
}

export default function SkillForm({ onSubmit }: SkillFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('');
  const [errors, setErrors] = useState({ name: '', description: '', level: '' });

  function validateName(value: string): string {
    return value.trim() ? '' : 'Name is required';
  }

  function validateDescription(value: string): string {
    return value.trim() ? '' : 'Description is required';
  }

  function validateLevel(value: string): string {
    if (value === '') return '';
    const number = Number(value);
    if (!Number.isInteger(number) || number < 0) {
      return 'Level must be a number >= 0';
    }
    return '';
  }

  function validate() {
    const nameError = validateName(name);
    const descError = validateDescription(description);
    const levelError = validateLevel(level);
    const newErrors = {
      name: nameError,
      description: descError,
      level: levelError,
    };
    setErrors(newErrors);
    return nameError === '' && descError === '' && levelError === '';
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data: SkillFormData = {
      name: name.trim(),
      description: description.trim(),
      level: level ? Number(level) : undefined,
    };

    onSubmit(data);

    // Reset form
    setName('');
    setDescription('');
    setLevel('');
    setErrors({ name: '', description: '', level: '' });
  };

  return (
    <form onSubmit={handleSubmit} className='p-4 space-y-4'>
      <div>
        <label htmlFor='name' className='block'>
          Name *
        </label>
        <input
          id='name'
          type='text'
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          onBlur={() => {
            setErrors((prev) => ({ ...prev, name: validateName(name) }));
          }}
          className={`w-full px-3 py-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
        />
        <p className='min-h-[1.25rem] mt-1 text-red-600 text-sm'>{errors.name}</p>
      </div>

      <div>
        <label htmlFor='description' className='block'>
          Description *
        </label>
        <textarea
          id='description'
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          onBlur={() => {
            setErrors((e) => ({ ...e, description: validateDescription(description) }));
          }}
          rows={3}
          className={`w-full px-3 py-2 border rounded ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
        />
        <p className='min-h-[1.25rem] mt-1 text-red-600 text-sm'>{errors.description}</p>
      </div>

      <div>
        <label htmlFor='level' className='block'>
          Level (optional)
        </label>
        <input
          id='level'
          type='number'
          value={level}
          onChange={(e) => {
            setLevel(e.target.value);
          }}
          onBlur={() => {
            setErrors((e) => ({ ...e, level: validateLevel(level) }));
          }}
          min='0'
          className={`w-full px-3 py-2 border rounded ${errors.level ? 'border-red-500' : 'border-gray-300'}`}
        />
        <p className='min-h-[1.25rem] mt-1 text-red-600 text-sm'>{errors.level}</p>
      </div>

      <button type='submit' className='w-full py-2 px-4 bg-blue-600 text-white rounded'>
        Add Skill
      </button>
    </form>
  );
}
