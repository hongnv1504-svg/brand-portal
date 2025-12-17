import Link from 'next/link';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import type { DatabaseBrand } from '@/lib/types';
import SuccessMessage from '@/app/dashboard/components/SuccessMessage';
import LogoutButton from '@/app/dashboard/components/LogoutButton';

async function getBrandsForUser(): Promise<DatabaseBrand[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return [];
  }

  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('owner_id', user.id);

  if (error) {
    console.error('Error fetching brands:', error);
    return [];
  }

  return (data || []) as DatabaseBrand[];
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const params = await searchParams;
  const brands = await getBrandsForUser();

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
            <h1 className="text-3xl font-medium tracking-tight text-[#111111]">Quản Lý Thương Hiệu Của Bạn</h1>
            <p className="mt-2 text-sm text-[#111111]/60">Xem và quản lý các thương hiệu bạn đã tạo</p>
          </div>
          <Link
            href="/admin/add-brand"
            className="flex items-center gap-2 rounded-sm border border-[#e5e5e5] bg-white px-4 py-2 text-sm font-medium text-[#111111] transition-colors hover:bg-[#111111]/5"
          >
            <Plus className="h-4 w-4" />
            + Thêm Brand Mới
          </Link>
        </div>

        {/* Success Message */}
        {params.success === 'true' && <SuccessMessage />}

        {/* Brands Grid */}
        {brands.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="group relative overflow-hidden rounded-sm border border-[#e5e5e5] bg-white transition-all hover:border-[#111111]/20"
              >
                <div className="flex items-center gap-4 p-4">
                  <div className="relative h-12 w-12 shrink-0">
                    <Image
                      src={brand.logo_url || '/vercel.svg'}
                      alt={brand.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-medium text-[#111111] truncate">{brand.name}</h3>
                    <p className="mt-1 text-xs text-[#111111]/60 truncate">
                      {brand.description || 'Chưa có mô tả'}
                    </p>
                  </div>
                </div>
                <div className="border-t border-[#e5e5e5] bg-white p-3 flex items-center justify-between">
                  <Link
                    href={`/admin/brand/${brand.id}`}
                    className="rounded-sm border border-[#e5e5e5] bg-white px-3 py-1.5 text-sm text-[#111111] hover:bg-[#111111]/5"
                  >
                    Xem Chi Tiết
                  </Link>
                  <details className="relative">
                    <summary className="list-none cursor-pointer rounded-sm border border-[#e5e5e5] bg-white px-3 py-1.5 text-sm text-[#111111] hover:bg-[#111111]/5">
                      ...
                    </summary>
                    <ul className="absolute right-0 z-10 mt-2 w-36 rounded-sm border border-[#e5e5e5] bg-white shadow-sm">
                      <li>
                        <button className="w-full text-left px-3 py-2 text-sm hover:bg-[#111111]/5">
                          Chỉnh sửa
                        </button>
                      </li>
                      <li>
                        <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                          Xóa
                        </button>
                      </li>
                    </ul>
                  </details>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="rounded-full border border-[#e5e5e5] bg-white p-6">
              <Plus className="h-8 w-8 text-[#111111]/30" />
            </div>
            <h3 className="mt-6 text-lg font-medium text-[#111111]">Chưa có thương hiệu nào</h3>
            <p className="mt-2 text-sm text-[#111111]/50">Hãy bắt đầu bằng cách thêm thương hiệu đầu tiên</p>
            <Link
              href="/admin/add-brand"
              className="mt-6 rounded-sm border border-[#e5e5e5] bg-white px-4 py-2 text-sm font-medium text-[#111111] transition-colors hover:bg-[#111111]/5"
            >
              + Thêm Brand Mới
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
