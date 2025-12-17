'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { createBrandAdmin } from './actions';

export default function AddBrandPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
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
                  accept="image/png,image/jpeg,image/svg+xml"
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
