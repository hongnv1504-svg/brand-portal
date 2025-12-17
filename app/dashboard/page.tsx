import Link from 'next/link';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { transformBrand, type Brand } from '@/lib/types';
import SuccessMessage from './components/SuccessMessage';
import LogoutButton from './components/LogoutButton';

async function getBrands(): Promise<Brand[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('brands').select('*');

  if (error) {
    console.error('Error fetching brands:', error);
    return [];
  }

  return (data || []).map(transformBrand);
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const params = await searchParams;
  const brands = await getBrands();

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        {/* Logout Button */}
        <div className="mb-4 flex justify-end">
          <LogoutButton />
        </div>

        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-[#111111]">
              Brand Assets
            </h1>
            <p className="mt-2 text-sm text-[#111111]/60">
              Manage brand assets for your clients
            </p>
          </div>
          {brands.length > 0 && (
            <Link
              href="/brand/new"
              className="flex items-center gap-2 rounded-sm border border-[#e5e5e5] bg-white px-4 py-2 text-sm font-medium text-[#111111] transition-colors hover:bg-[#111111]/5"
            >
              <Plus className="h-4 w-4" />
              Add New Brand
            </Link>
          )}
        </div>

        {/* Success Message */}
        {params.success === 'true' && <SuccessMessage />}

        {/* Brands Grid */}
        {brands.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brand/${brand.id}`}
                className="group relative overflow-hidden rounded-sm border border-[#e5e5e5] bg-white transition-all hover:border-[#111111]/20"
              >
                <div className="aspect-[4/3] flex items-center justify-center bg-white p-8">
                  <div className="relative h-16 w-full">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="border-t border-[#e5e5e5] bg-white p-4">
                  <h3 className="text-base font-medium text-[#111111]">
                    {brand.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#111111]/50">
                    {brand.colors.length} colors · {brand.fonts.length} fonts
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="rounded-full border border-[#e5e5e5] bg-white p-6">
              <Plus className="h-8 w-8 text-[#111111]/30" />
            </div>
            <h3 className="mt-6 text-lg font-medium text-[#111111]">
              No brands yet
            </h3>
            <p className="mt-2 text-sm text-[#111111]/50">
              Get started by adding your first brand
            </p>
            <Link
              href="/brand/new"
              className="mt-6 rounded-sm border border-[#e5e5e5] bg-white px-4 py-2 text-sm font-medium text-[#111111] transition-colors hover:bg-[#111111]/5"
            >
              Add New Brand
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
