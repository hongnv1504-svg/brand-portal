import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { transformBrand, type Brand } from '@/lib/types';
import LogoGrid from './components/LogoGrid';
import ColorPalette from './components/ColorPalette';

async function getBrandById(id: string): Promise<Brand | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error fetching brand:', error);
    return null;
  }

  return transformBrand(data);
}

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const brand = await getBrandById(id);

  if (!brand) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-[#111111]">Brand not found</h1>
          <Link
            href="/dashboard"
            className="mt-4 inline-flex items-center gap-2 text-sm text-[#111111]/60 hover:text-[#111111]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Create a logo item from logo_url for LogoGrid
  const logoItems = brand.logo
    ? [
        {
          id: 'main-logo',
          name: 'Main Logo',
          url: brand.logo,
          format: 'PNG' as const,
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#111111]/60 transition-colors hover:text-[#111111]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Header Section */}
        <div className="mb-16 border-b border-[#e5e5e5] pb-12">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
            <div className="relative h-24 w-48 flex-shrink-0">
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-4xl font-medium tracking-tight text-[#111111]">
                {brand.name}
              </h1>
              <p className="mt-2 text-sm text-[#111111]/50">
                Brand Asset Portal
              </p>
            </div>
          </div>
        </div>

        {/* Logos Section */}
        {logoItems.length > 0 && <LogoGrid logos={logoItems} />}

        {/* Color Palette Section */}
        {brand.colors.length > 0 && <ColorPalette colors={brand.colors} />}

        {/* Typography Section */}
        <section className="mb-16">
          <h2 className="mb-6 text-xl font-medium text-[#111111]">
            Typography
          </h2>
          {brand.fonts && brand.fonts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {brand.fonts.map((fontName, index) => (
                <div
                  key={index}
                  className="rounded-sm border border-[#e5e5e5] bg-white p-6"
                >
                  <h3 className="text-base font-medium text-[#111111]">
                    {fontName}
                  </h3>
                  <div className="mt-4 border-t border-[#e5e5e5] pt-4">
                    <p
                      className="text-xl font-medium text-[#111111]"
                      style={{ fontFamily: fontName }}
                    >
                      The quick brown fox jumps over the lazy dog
                    </p>
                    <p
                      className="mt-2 text-sm text-[#111111]/70"
                      style={{ fontFamily: fontName }}
                    >
                      ABCDEFGHIJKLMNOPQRSTUVWXYZ
                    </p>
                    <p
                      className="mt-1 text-sm text-[#111111]/70"
                      style={{ fontFamily: fontName }}
                    >
                      abcdefghijklmnopqrstuvwxyz
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-sm border border-[#e5e5e5] bg-white p-8 text-center">
              <p className="text-sm text-[#111111]/50">No fonts added</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

