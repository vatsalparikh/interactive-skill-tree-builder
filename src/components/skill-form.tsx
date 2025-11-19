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
    if (!value.trim()) return 'Name is required';
    if (value.trim().length > 50) return 'Name must be 50 characters or less';
    return '';
  }

  function validateDescription(value: string): string {
    if (!value.trim()) return 'Description is required';
    if (value.trim().length > 150) return 'Description must be 150 characters or less';
    return '';
  }

  function validateLevel(value: string): string {
    if (value === '') return '';
    const number = Number(value);
    if (!Number.isInteger(number) || number < 0 || number > 999) {
      return 'Level must be a number >= 0 and <= 999';
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
      level: level ? Math.min(999, Math.max(0, Number(level))) : undefined,
    };

    onSubmit(data);

    // Reset form
    setName('');
    setDescription('');
    setLevel('');
    setErrors({ name: '', description: '', level: '' });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label htmlFor='name' className='block'>
          Name *
        </label>
        <input
          id='name'
          type='text'
          maxLength={50}
          value={name}
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby={errors.name ? 'name-error' : undefined}
          onChange={(e) => {
            setName(e.target.value);
          }}
          onBlur={() => {
            setErrors((prev) => ({ ...prev, name: validateName(name) }));
          }}
          className={`w-full px-3 py-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
        />
        <div className='flex justify-between items-start min-h-[1.5rem] mt-1'>
          <p
            id='name-error'
            aria-hidden={errors.name ? 'false' : 'true'}
            aria-live='polite'
            className='text-red-600 text-sm'
          >
            {errors.name}
          </p>
          <p className='text-gray-500 text-sm'>{name.length}/50</p>
        </div>
      </div>

      <div>
        <label htmlFor='description' className='block'>
          Description *
        </label>
        <textarea
          id='description'
          rows={3}
          value={description}
          aria-invalid={errors.description ? 'true' : 'false'}
          aria-describedby={errors.description ? 'description-error' : undefined}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          onBlur={() => {
            setErrors((e) => ({ ...e, description: validateDescription(description) }));
          }}
          className={`w-full px-3 py-2 border rounded ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
        />
        <div className='flex justify-between items-start min-h-[2.5rem] mt-1'>
          <p
            id='description-error'
            aria-hidden={errors.description ? 'false' : 'true'}
            aria-live='polite'
            className='text-red-600 text-sm'
          >
            {errors.description}
          </p>
          <p className='text-gray-500 text-sm'>{description.length}/150</p>
        </div>
      </div>

      <div>
        <label htmlFor='level' className='block'>
          Level (optional)
        </label>
        <input
          id='level'
          type='number'
          min='0'
          max='999'
          value={level}
          aria-invalid={errors.level ? 'true' : 'false'}
          aria-describedby={errors.level ? 'level-error' : undefined}
          onChange={(e) => {
            setLevel(e.target.value);
          }}
          onBlur={() => {
            setErrors((e) => ({ ...e, level: validateLevel(level) }));
          }}
          className={`w-full px-3 py-2 border rounded ${errors.level ? 'border-red-500' : 'border-gray-300'}`}
        />
        <p
          id='level-error'
          aria-hidden={errors.level ? 'false' : 'true'}
          aria-live='polite'
          className='min-h-[2.5rem] mt-1 text-red-600 text-sm'
        >
          {errors.level}
        </p>
      </div>

      <button
        type='submit'
        className='w-full py-2 px-4 bg-blue-600 text-white rounded cursor-pointer'
      >
        Add new skill
      </button>
    </form>
  );
}
