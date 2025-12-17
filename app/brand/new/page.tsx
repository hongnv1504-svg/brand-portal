'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, X, Plus } from 'lucide-react';
import { createBrand } from './actions';

export default function NewBrandPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [colors, setColors] = useState<Array<{ id: string; name: string; hex: string }>>([]);
  const [fonts, setFonts] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState('');
  const [fontInput, setFontInput] = useState('');
  const [colorError, setColorError] = useState('');
  const [fontError, setFontError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const fontInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateAndAddColor = (hexValue: string) => {
    const hex = hexValue.trim().toUpperCase();
    setColorError('');

    // Validate hex color
    if (!hex) {
      setColorError('Please enter a color code');
      return false;
    }

    const isValidHex = /^#[0-9A-F]{6}$/i.test(hex) || /^[0-9A-F]{6}$/i.test(hex);
    
    if (!isValidHex) {
      setColorError('Invalid hex color. Use format #RRGGBB or RRGGBB');
      return false;
    }

    const normalizedHex = hex.startsWith('#') ? hex : `#${hex}`;
    
    // Check for duplicates
    if (colors.some((c) => c.hex.toUpperCase() === normalizedHex.toUpperCase())) {
      setColorError('This color is already added');
      return false;
    }

    const newColor = {
      id: `color-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      name: normalizedHex,
      hex: normalizedHex,
    };
    
    setColors([...colors, newColor]);
    setColorInput('');
    setColorError('');
    return true;
  };

  const handleAddColor = (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        validateAndAddColor(colorInput);
      }
    } else {
      validateAndAddColor(colorInput);
    }
  };

  const handleRemoveColor = (id: string) => {
    setColors(colors.filter((c) => c.id !== id));
  };

  const validateAndAddFont = (fontName: string) => {
    const trimmed = fontName.trim();
    setFontError('');

    if (!trimmed) {
      setFontError('Please enter a font name');
      return false;
    }

    if (fonts.includes(trimmed)) {
      setFontError('This font is already added');
      return false;
    }

    setFonts([...fonts, trimmed]);
    setFontInput('');
    setFontError('');
    return true;
  };

  const handleAddFont = (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        validateAndAddFont(fontInput);
      }
    } else {
      validateAndAddFont(fontInput);
    }
  };

  const handleRemoveFont = (index: number) => {
    setFonts(fonts.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      if (logoFile) {
        formData.append('logo', logoFile);
      }
      formData.append('colors', JSON.stringify(colors));
      formData.append('fonts', JSON.stringify(fonts));

      await createBrand(formData);
    } catch (error) {
      console.error('Error creating brand:', error);
      alert('Failed to create brand. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-6 py-12 sm:px-8">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#111111]/60 transition-colors hover:text-[#111111]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-medium tracking-tight text-[#111111]">
            Create New Brand
          </h1>
          <p className="mt-2 text-sm text-[#111111]/60">
            Add a new brand to your asset portal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Brand Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[#111111] mb-2"
            >
              Brand Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-sm border border-[#e5e5e5] bg-white px-4 py-2 text-sm text-[#111111] focus:border-[#111111] focus:outline-none"
              placeholder="Enter brand name"
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label
              htmlFor="logo"
              className="block text-sm font-medium text-[#111111] mb-2"
            >
              Logo
            </label>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="logo"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="w-full rounded-sm border border-[#e5e5e5] bg-white px-4 py-2 text-sm text-[#111111] focus:border-[#111111] focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-[#111111]/5 file:text-[#111111] hover:file:bg-[#111111]/10"
                />
              </div>
              {logoPreview && (
                <div className="relative h-20 w-20 flex-shrink-0 rounded-sm border border-[#e5e5e5] overflow-hidden">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="h-full w-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label
              htmlFor="color"
              className="block text-sm font-medium text-[#111111] mb-2"
            >
              Colors
            </label>
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <input
                  ref={colorInputRef}
                  type="text"
                  id="color"
                  value={colorInput}
                  onChange={(e) => {
                    setColorInput(e.target.value);
                    setColorError('');
                  }}
                  onKeyDown={(e) => handleAddColor(e)}
                  placeholder="Enter hex color (e.g., #FF5733)"
                  className="w-full rounded-sm border border-[#e5e5e5] bg-white px-4 py-2 text-sm text-[#111111] focus:border-[#111111] focus:outline-none transition-colors"
                />
                {colorError && (
                  <p className="mt-1 text-xs text-red-500">{colorError}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleAddColor()}
                className="flex items-center justify-center rounded-sm border border-[#e5e5e5] bg-white px-4 py-2 text-sm font-medium text-[#111111] transition-colors hover:bg-[#111111]/5 hover:border-[#111111]/20"
                title="Add color"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {colors.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2.5">
                {colors.map((color) => (
                  <div
                    key={color.id}
                    className="group flex items-center gap-2.5 rounded-full border border-[#e5e5e5] bg-white px-3 py-1.5 pr-2 shadow-sm transition-all hover:border-[#111111]/30 hover:shadow-md"
                  >
                    <div
                      className="h-5 w-5 rounded-full border border-[#e5e5e5] shadow-sm"
                      style={{ backgroundColor: color.hex }}
                      title={color.hex}
                    />
                    <span className="text-xs font-medium text-[#111111]">
                      {color.hex}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(color.id)}
                      className="ml-0.5 flex items-center justify-center rounded-full p-0.5 text-[#111111]/40 transition-colors hover:bg-[#111111]/10 hover:text-[#111111]"
                      title="Remove color"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fonts */}
          <div>
            <label
              htmlFor="font"
              className="block text-sm font-medium text-[#111111] mb-2"
            >
              Fonts
            </label>
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <input
                  ref={fontInputRef}
                  type="text"
                  id="font"
                  value={fontInput}
                  onChange={(e) => {
                    setFontInput(e.target.value);
                    setFontError('');
                  }}
                  onKeyDown={(e) => handleAddFont(e)}
                  placeholder="Enter font name (e.g., Inter)"
                  className="w-full rounded-sm border border-[#e5e5e5] bg-white px-4 py-2 text-sm text-[#111111] focus:border-[#111111] focus:outline-none transition-colors"
                />
                {fontError && (
                  <p className="mt-1 text-xs text-red-500">{fontError}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleAddFont()}
                className="flex items-center justify-center rounded-sm border border-[#e5e5e5] bg-white px-4 py-2 text-sm font-medium text-[#111111] transition-colors hover:bg-[#111111]/5 hover:border-[#111111]/20"
                title="Add font"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {fonts.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2.5">
                {fonts.map((font, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-2 rounded-full border border-[#e5e5e5] bg-white px-3.5 py-1.5 pr-2 shadow-sm transition-all hover:border-[#111111]/30 hover:shadow-md"
                  >
                    <span
                      className="text-xs font-medium text-[#111111]"
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFont(index)}
                      className="ml-0.5 flex items-center justify-center rounded-full p-0.5 text-[#111111]/40 transition-colors hover:bg-[#111111]/10 hover:text-[#111111]"
                      title="Remove font"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="rounded-sm border border-[#111111] bg-[#111111] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[#111111]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Brand'}
            </button>
            <Link
              href="/dashboard"
              className="rounded-sm border border-[#e5e5e5] bg-white px-6 py-2 text-sm font-medium text-[#111111] transition-colors hover:bg-[#111111]/5"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

