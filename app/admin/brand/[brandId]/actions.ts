'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function uploadAsset(formData: FormData) {
  const supabase = await createClient();
  const brandId = formData.get('brandId') as string;
  const file = formData.get('file') as File | null;

  if (!brandId || !file) {
    throw new Error('Missing brandId or file');
  }

  const ext = file.name.split('.').pop() || '';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `${brandId}/${fileName}`;

  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from('assets')
    .upload(filePath, uint8Array, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: publicUrlData } = supabase.storage.from('assets').getPublicUrl(filePath);
  const url = publicUrlData.publicUrl;

  const { data, error } = await supabase
    .from('brand_assets')
    .insert({
      brand_id: brandId,
      name: file.name,
      category: 'Logo',
      url,
      mime_type: file.type || null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/brand/${brandId}`);
  return data;
}
