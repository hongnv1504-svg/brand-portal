'use client';

import { useMemo, useState } from 'react';
import type { DatabaseBrandColor, DatabaseBrandAsset, AssetCategory } from '@/lib/types';

type TabsProps = {
  colors: DatabaseBrandColor[];
  assets: DatabaseBrandAsset[];
};

export default function Tabs({ colors, assets }: TabsProps) {
  const [activeTab, setActiveTab] = useState<'colors' | 'assets'>('colors');
  const [categoryFilter, setCategoryFilter] = useState<AssetCategory | 'All'>('All');

  const filteredAssets = useMemo(() => {
    if (categoryFilter === 'All') return assets;
    return assets.filter((a) => a.category === categoryFilter);
  }, [assets, categoryFilter]);

  const copyHex = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      <div className="inline-flex rounded-lg border border-[#e5e5e5] bg-white p-1">
        <button
          type="button"
          onClick={() => setActiveTab('colors')}
          className={`px-4 py-2 text-sm rounded-md ${activeTab === 'colors' ? 'bg-[#111111] text-white' : 'text-[#111111] hover:bg-[#111111]/5'}`}
        >
          Màu Sắc
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('assets')}
          className={`px-4 py-2 text-sm rounded-md ${activeTab === 'assets' ? 'bg-[#111111] text-white' : 'text-[#111111] hover:bg-[#111111]/5'}`}
        >
          Tài Sản
        </button>
      </div>

      {activeTab === 'colors' ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-[#111111]">Màu Sắc</h2>
            <button className="rounded-sm border border-[#e5e5e5] bg-white px-4 py-2 text-sm text-[#111111] hover:bg-[#111111]/5">
              + Thêm Màu
            </button>
          </div>
          {colors.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {colors.map((c) => (
                <div key={c.id} className="rounded-sm border border-[#e5e5e5] bg-white p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-sm border border-[#e5e5e5]" style={{ backgroundColor: c.hex }} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#111111] truncate">{c.name}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <code className="text-xs text-[#111111]/70">{c.hex}</code>
                        <button
                          type="button"
                          onClick={() => copyHex(c.hex)}
                          className="text-xs rounded-sm border border-[#e5e5e5] px-2 py-1 hover:bg-[#111111]/5"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-sm border border-[#e5e5e5] bg-white p-8 text-center">
              <p className="text-sm text-[#111111]/50">Chưa có màu</p>
            </div>
          )}
        </section>
      ) : (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-[#111111]">Tài Sản</h2>
            <button className="rounded-sm border border-[#e5e5e5] bg-white px-4 py-2 text-sm text-[#111111] hover:bg-[#111111]/5">
              + Thêm Tài Sản
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-[#111111]/70">Bộ lọc:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as AssetCategory | 'All')}
              className="rounded-sm border border-[#e5e5e5] bg-white px-3 py-2 text-sm text-[#111111]"
            >
              <option value="All">Tất cả</option>
              <option value="Logo">Logo</option>
              <option value="Typography">Typography</option>
              <option value="Imagery">Imagery</option>
              <option value="Other">Khác</option>
            </select>
          </div>

          {filteredAssets.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAssets.map((a) => (
                <div key={a.id} className="rounded-sm border border-[#e5e5e5] bg-white overflow-hidden">
                  <div className="aspect-[4/3] bg-white flex items-center justify-center">
                    {a.thumbnail_url ? (
                      <img src={a.thumbnail_url} alt={a.name} className="h-full w-full object-contain" />
                    ) : (
                      <div className="text-xs text-[#111111]/50">No preview</div>
                    )}
                  </div>
                  <div className="border-t border-[#e5e5e5] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-[#111111] truncate">{a.name}</p>
                      <span className="text-xs rounded-sm border border-[#e5e5e5] px-2 py-0.5 text-[#111111]/70">
                        {a.category}
                      </span>
                    </div>
                    <div className="mt-3">
                      <a
                        href={a.url}
                        download
                        className="inline-block rounded-sm border border-[#e5e5e5] bg-white px-3 py-1.5 text-sm text-[#111111] hover:bg-[#111111]/5"
                      >
                        Tải Xuống
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-sm border border-[#e5e5e5] bg-white p-8 text-center">
              <p className="text-sm text-[#111111]/50">Chưa có tài sản</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
