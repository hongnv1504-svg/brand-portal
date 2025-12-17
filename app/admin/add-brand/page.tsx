'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { createBrandAdmin } from './actions';

export default function AddBrandPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestedColors, setSuggestedColors] = useState<string[]>([]);
  const [colors, setColors] = useState<Array<{ id: string; name: string; hex: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const rgbToHex = (r: number, g: number, b: number) => {
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  };

  const isPureBlackOrWhite = (hex: string) => {
    const h = hex.toUpperCase();
    return h === '#000000' || h === '#FFFFFF';
  };

  useEffect(() => {
    const extractColors = async () => {
      if (!logoPreview) {
        setSuggestedColors([]);
        setIsAnalyzing(false);
        return;
      }
      try {
        setIsAnalyzing(true);
        type Swatch = { rgb: [number, number, number] };
        const VibrantModule = await import('node-vibrant');
        const VibrantCandidate = VibrantModule as unknown as {
          default?: { from: (src: string) => { getPalette: () => Promise<Record<string, Swatch | null>> } };
          Vibrant?: { from: (src: string) => { getPalette: () => Promise<Record<string, Swatch | null>> } };
        };
        const Vibrant = (VibrantCandidate.default ?? VibrantCandidate.Vibrant)!;
        const palette = await Vibrant.from(logoPreview).getPalette();
        const hexes = Object.values(palette)
          .filter((s): s is Swatch => Boolean(s))
          .map((s) => rgbToHex(s.rgb[0], s.rgb[1], s.rgb[2]))
          .filter((hex) => !isPureBlackOrWhite(hex));
        const unique = Array.from(new Set(hexes)).slice(0, 5);
        setSuggestedColors(unique);
      } catch (e) {
        setSuggestedColors([]);
      } finally {
        setIsAnalyzing(false);
      }
    };
    extractColors();
  }, [logoPreview]);

  const addColorFromSuggestion = (hex: string) => {
    const normalized = hex.startsWith('#') ? hex.toUpperCase() : `#${hex.toUpperCase()}`;
    if (colors.some((c) => c.hex === normalized)) return;
    const newColor = {
      id: `color-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      name: normalized,
      hex: normalized,
    };
    setColors((prev) => [...prev, newColor]);
  };

  const removeColor = (id: string) => {
    setColors((prev) => prev.filter((c) => c.id !== id));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size too large. Please upload an image smaller than 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
        
        // Trigger change event manually or just update state
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeLogo = () => {
    setLogoPreview(null);
    setSuggestedColors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      formData.set('colors', JSON.stringify(colors));
      await createBrandAdmin(formData);
    } catch (error) {
      console.error(error);
      alert('Failed to create brand. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[600px] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-gray-900">Thêm Thương Hiệu Mới</h1>
            <p className="mt-2 text-sm text-gray-500">Nhập thông tin chi tiết để tạo thương hiệu mới</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Brand Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Tên Thương Hiệu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                placeholder="Nhập tên thương hiệu..."
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả ngắn
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-400 resize-none"
                placeholder="Mô tả về thương hiệu..."
              />
            </div>

            {/* Main Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo Chính <span className="text-red-500">*</span>
              </label>
              
              <div 
                className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                  logoPreview ? 'border-gray-200 bg-gray-50' : 'border-gray-300 hover:border-gray-400 bg-white'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  name="logo"
                  id="logo"
                  onChange={handleLogoChange}
                  className="hidden"
                  required={!logoPreview}
                />

                {logoPreview ? (
                  <div className="relative flex items-center justify-center">
                    <div className="relative w-40 h-40">
                      <Image
                        src={logoPreview}
                        alt="Logo preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md border border-gray-200 hover:bg-gray-50 text-gray-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="text-sm text-gray-600">
                      <label
                        htmlFor="logo"
                        className="relative cursor-pointer rounded-md font-medium text-black hover:underline focus-within:outline-none"
                      >
                        <span>Tải lên logo</span>
                      </label>
                      <span className="pl-1">hoặc kéo thả vào đây</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, SVG (Tối đa 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {logoPreview && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-800">Màu đề xuất</h3>
                  {isAnalyzing && (
                    <div className="inline-flex items-center text-xs text-gray-500">
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      Đang phân tích...
                    </div>
                  )}
                </div>
                {suggestedColors.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {suggestedColors.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => addColorFromSuggestion(hex)}
                        className="group inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-800 hover:bg-gray-50"
                        title="Thêm vào danh sách màu"
                      >
                        <span
                          className="h-4 w-4 rounded-sm border border-gray-200"
                          style={{ backgroundColor: hex }}
                        />
                        <code className="text-[11px] text-gray-700">{hex}</code>
                      </button>
                    ))}
                  </div>
                ) : (
                  !isAnalyzing && (
                    <p className="text-xs text-gray-500">Không tìm thấy màu nổi bật</p>
                  )
                )}
              </div>
            )}

            {colors.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-800">Màu của Brand</h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <div key={c.id} className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-2 py-1">
                      <span
                        className="h-4 w-4 rounded-sm border border-gray-200"
                        style={{ backgroundColor: c.hex }}
                      />
                      <code className="text-[11px] text-gray-700">{c.hex}</code>
                      <button
                        type="button"
                        onClick={() => removeColor(c.id)}
                        className="text-[11px] text-gray-500 hover:text-gray-700"
                        aria-label="Remove color"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hidden Owner Field is handled in server action via auth.getUser() */}

            {/* Actions */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Đang xử lý...
                  </>
                ) : (
                  'Tạo Brand →'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
