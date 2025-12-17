'use client';

import Image from 'next/image';
import { Download } from 'lucide-react';

interface Logo {
  id: string;
  name: string;
  url: string;
  format: 'PNG' | 'SVG';
}

interface LogoGridProps {
  logos: Logo[];
}

export default function LogoGrid({ logos }: LogoGridProps) {
  const handleDownload = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="mb-16">
      <h2 className="mb-6 text-xl font-medium text-[#111111]">Logos</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {logos.map((logo) => (
          <div
            key={logo.id}
            className="group relative overflow-hidden rounded-sm border border-[#e5e5e5] bg-white"
          >
            <div className="aspect-[4/3] flex items-center justify-center bg-white p-6">
              <div className="relative h-full w-full">
                <Image
                  src={logo.url}
                  alt={logo.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="border-t border-[#e5e5e5] bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-[#111111]">
                    {logo.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#111111]/50">
                    {logo.format}
                  </p>
                </div>
                <button
                  onClick={() => handleDownload(logo.url, logo.name)}
                  className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#e5e5e5] bg-white text-[#111111] transition-colors hover:bg-[#111111]/5"
                  aria-label={`Download ${logo.name}`}
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

