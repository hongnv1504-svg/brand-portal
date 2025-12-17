'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createBrandAdmin(formData: FormData) {
  const supabase = await createClient();

  // Get current user for owner_id
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get form values
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const logoFile = formData.get('logo') as File | null;
  const colorsJson = formData.get('colors') as string | null;

  let logoUrl = '';

  // Upload logo if provided
  if (logoFile && logoFile.size > 0) {
    const fileExt = logoFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = fileName;

    // Convert File to ArrayBuffer then to Uint8Array for Supabase Storage
    const arrayBuffer = await logoFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(filePath, uint8Array, {
        contentType: logoFile.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Error uploading logo:', uploadError);
      throw new Error(`Failed to upload logo: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('logos')
      .getPublicUrl(filePath);

    logoUrl = urlData.publicUrl;
  }

  let colors: Array<{ id: string; name: string; hex: string }> = [];
  try {
    if (colorsJson) {
      const parsed = JSON.parse(colorsJson);
      colors = Array.isArray(parsed) ? parsed : [];
    }
  } catch {
    colors = [];
  }

  // Insert brand into database
  const { error } = await supabase
    .from('brands')
    .insert({
      name: name,
      description: description, // Assuming this column exists
      logo_url: logoUrl,
      owner_id: user?.id, // Assuming this column exists
      colors: colors, 
      fonts: [],
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating brand:', error);
    throw new Error('Failed to create brand');
  }

  // Revalidate dashboard and redirect
  revalidatePath('/admin/dashboard');
  redirect('/admin/dashboard?success=true');
}
