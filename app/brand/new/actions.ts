'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createBrand(formData: FormData) {
  const supabase = await createClient();

  // Get form values
  const name = formData.get('name') as string;
  const logoFile = formData.get('logo') as File | null;
  const colorsJson = formData.get('colors') as string;
  const fontsJson = formData.get('fonts') as string;

  // Parse colors and fonts arrays
  let colors: Array<{ id: string; name: string; hex: string }> = [];
  let fonts: string[] = [];

  try {
    if (colorsJson) {
      const colorsData = JSON.parse(colorsJson);
      colors = Array.isArray(colorsData) ? colorsData : [];
    }
  } catch (e) {
    console.error('Error parsing colors:', e);
  }

  try {
    if (fontsJson) {
      fonts = JSON.parse(fontsJson);
      if (!Array.isArray(fonts)) {
        fonts = [];
      }
    }
  } catch (e) {
    console.error('Error parsing fonts:', e);
  }

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
    const { data: uploadData, error: uploadError } = await supabase.storage
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

  // Insert brand into database
  const { data, error } = await supabase
    .from('brands')
    .insert({
      name: name,
      logo_url: logoUrl,
      colors: colors,
      fonts: fonts,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating brand:', error);
    throw new Error('Failed to create brand');
  }

  // Revalidate dashboard and redirect
  revalidatePath('/dashboard');
  redirect('/dashboard?success=true');
}

