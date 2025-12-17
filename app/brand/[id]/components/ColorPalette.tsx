'use client';

import { Check } from 'lucide-react';
import { useState } from 'react';

interface Color {
  id: string;
  name: string;
  hex: string;
}

interface ColorPaletteProps {
  colors: Color[];
}

export default function ColorPalette({ colors }: ColorPaletteProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleColorCopy = async (hex: string, colorId: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedColor(colorId);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <section className="mb-16">
      <h2 className="mb-6 text-xl font-medium text-[#111111]">Color Palette</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {colors.map((color) => (
          <button
            key={color.id}
            onClick={() => handleColorCopy(color.hex, color.id)}
            className="group relative overflow-hidden rounded-sm border border-[#e5e5e5] bg-white transition-all hover:border-[#111111]/20"
          >
            <div
              className="aspect-square w-full"
              style={{ backgroundColor: color.hex }}
            />
            <div className="border-t border-[#e5e5e5] bg-white p-3">
              <p className="text-xs font-medium text-[#111111]">{color.name}</p>
              <div className="mt-1 flex items-center gap-2">
                <code className="text-xs text-[#111111]/50">{color.hex}</code>
                {copiedColor === color.id && (
                  <Check className="h-3 w-3 text-[#111111]/50" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

