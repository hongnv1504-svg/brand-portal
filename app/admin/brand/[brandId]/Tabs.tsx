'use client';

import { useMemo, useState, useTransition } from 'react';
import type { DatabaseBrandColor, DatabaseBrandAsset, AssetCategory } from '@/lib/types';
import { getAssetType } from '@/lib/utils';
import { uploadAsset } from './actions';

type TabsProps = {
  colors: DatabaseBrandColor[];
  assets: DatabaseBrandAsset[];
};

export default function Tabs({ colors, assets }: TabsProps) {
  const [activeTab, setActiveTab] = useState<'colors' | 'assets'>('assets');
  const [categoryFilter, setCategoryFilter] = useState<AssetCategory | 'All'>('All');
  const [assetList, setAssetList] = useState<DatabaseBrandAsset[]>(assets);
  const [isUploading, startUploading] = useTransition();

  const filteredAssets = useMemo(() => {
    const base = categoryFilter === 'All' ? assetList : assetList.filter((a) => a.category === categoryFilter);
    return base;
  }, [assetList, categoryFilter]);

  const logoAssets = useMemo(() => filteredAssets.filter((a) => a.category === 'Logo'), [filteredAssets]);
  const groupedByType = useMemo(() => {
    const groups: Record<string, DatabaseBrandAsset[]> = {};
    for (const a of logoAssets) {
      const type = getAssetType(a.name || a.url);
      if (!groups[type]) groups[type] = [];
      groups[type].push(a);
    }
    return groups;
  }, [logoAssets]);

  const copyHex = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
    } catch (e) {}
  };

  const onUploadChange = (brandId: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.set('brandId', brandId);
    formData.set('file', file);
    startUploading(async () => {
      try {
        const inserted = await uploadAsset(formData);
        setAssetList((prev) => [inserted as DatabaseBrandAsset, ...prev]);
      } catch {}
    });
    e.currentTarget.value = '';
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
            <div className="relative">
              <label className="rounded-sm border border-[#e5e5e5] bg-white px-4 py-2 text-sm text-[#111111] hover:bg-[#111111]/5 cursor-pointer">
                {isUploading ? 'Đang tải...' : '+ Thêm Tài Sản'}
                <input
                  type="file"
                  className="hidden"
                  accept=".ai,.eps,.pdf,image/png,image/jpeg"
                  onChange={onUploadChange(assetList[0]?.brand_id || '')}
                />
              </label>
            </div>
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

          {Object.keys(groupedByType).length > 0 ? (
            <div className="space-y-4">
              {(['AI', 'PDF', 'EPS', 'PNG/JPG', 'Other'] as const).map((key) => {
                const items = groupedByType[key] || [];
                if (items.length === 0) return null;
                const folderName =
                  key === 'AI'
                    ? '📂 AI Source Files'
                    : key === 'PDF'
                    ? '📂 PDF'
                    : key === 'EPS'
                    ? '📂 EPS'
                    : key === 'PNG/JPG'
                    ? '📂 PNG/JPG'
                    : '📂 Other';
                return (
                  <details key={key} className="rounded-sm border border-[#e5e5e5] bg-white">
                    <summary className="cursor-pointer p-3 text-sm font-medium text-[#111111]">
                      {folderName} <span className="ml-2 text-[#111111]/50">({items.length})</span>
                    </summary>
                    <div className="border-t border-[#e5e5e5]">
                      {items.map((a) => (
                        <div key={a.id} className="flex items-center justify-between p-3 border-b border-[#e5e5e5] last:border-b-0">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-6 w-6 rounded-sm bg-[#111111]/5 flex items-center justify-center text-xs">
                              {key === 'PNG/JPG' ? '🖼️' : key === 'PDF' ? '📄' : key === 'AI' ? '🅰️' : key === 'EPS' ? '📦' : '📁'}
                            </div>
                            <p className="text-sm text-[#111111] truncate">{a.name}</p>
                          </div>
                          <a
                            href={a.url}
                            download
                            className="rounded-sm border border-[#e5e5e5] bg-white px-3 py-1.5 text-sm text-[#111111] hover:bg-[#111111]/5"
                          >
                            Tải Xuống
                          </a>
                        </div>
                      ))}
                    </div>
                  </details>
                );
              })}
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
