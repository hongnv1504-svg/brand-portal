import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import Tabs from './Tabs';
import type { DatabaseBrand, DatabaseBrandColor, DatabaseBrandAsset } from '@/lib/types';

async function getBrandData(brandId: string): Promise<{
  brand: DatabaseBrand | null;
  colors: DatabaseBrandColor[];
  assets: DatabaseBrandAsset[];
}> {
  const supabase = await createClient();

  const { data: brand, error: brandError } = await supabase
    .from('brands')
    .select('*')
    .eq('id', brandId)
    .single();

  if (brandError) {
    return { brand: null, colors: [], assets: [] };
  }

  let colors: DatabaseBrandColor[] = [];
  let assets: DatabaseBrandAsset[] = [];

  try {
    const { data: colorData, error: colorError } = await supabase
      .from('brand_colors')
      .select('*')
      .eq('brand_id', brandId);
    if (!colorError && Array.isArray(colorData)) {
      colors = colorData as DatabaseBrandColor[];
    } else {
      colors = Array.isArray(brand?.colors)
        ? ((brand!.colors ?? []).map(
            (c: { id: string; name: string; hex: string }) => ({
              id: c.id,
              brand_id: brandId,
              name: c.name,
              hex: c.hex,
            })
          ) as DatabaseBrandColor[])
        : [];
    }
  } catch {
    colors = Array.isArray(brand?.colors)
      ? ((brand!.colors ?? []).map(
          (c: { id: string; name: string; hex: string }) => ({
            id: c.id,
            brand_id: brandId,
            name: c.name,
            hex: c.hex,
          })
        ) as DatabaseBrandColor[])
      : [];
  }

  try {
    const { data: assetData, error: assetError } = await supabase
      .from('brand_assets')
      .select('*')
      .eq('brand_id', brandId);
    if (!assetError && Array.isArray(assetData)) {
      assets = assetData as DatabaseBrandAsset[];
    } else {
      assets = [];
    }
  } catch {
    assets = [];
  }

  return { brand: brand as DatabaseBrand, colors, assets };
}

export default async function AdminBrandDetailPage({
  params,
}: {
  params: Promise<{ brandId: string }>;
}) {
  const { brandId } = await params;
  const { brand, colors, assets } = await getBrandData(brandId);

  if (!brand) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-[#111111]">Không tìm thấy Thương Hiệu</h1>
          <Link
            href="/admin/dashboard"
            className="mt-4 inline-flex items-center gap-2 text-sm text-[#111111]/60 hover:text-[#111111]"
          >
            <ArrowLeft className="h-4 w-4" />
            Về Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8">
        <Link
          href="/admin/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#111111]/60 transition-colors hover:text-[#111111]"
        >
          <ArrowLeft className="h-4 w-4" />
          Về Dashboard
        </Link>

        <div className="mb-12 border-b border-[#e5e5e5] pb-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative h-20 w-40 flex-shrink-0">
              {/* Use <img> to avoid remote domain restrictions */}
              <img
                src={brand.logo_url || '/vercel.svg'}
                alt={brand.name}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-medium tracking-tight text-[#111111]">{brand.name}</h1>
              {brand.description && (
                <p className="mt-2 text-sm text-[#111111]/60">{brand.description}</p>
              )}
            </div>
          </div>
        </div>

        <Tabs brandId={brand.id} colors={colors} assets={assets} />
      </div>
    </div>
  );
}
