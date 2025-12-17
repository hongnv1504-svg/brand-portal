// Database types (matching Supabase schema)
export interface DatabaseBrand {
  id: string;
  name: string;
  description?: string;
  logo_url: string;
  owner_id?: string;
  colors: Array<{
    id: string;
    name: string;
    hex: string;
  }>;
  fonts: string[]; // Simple array of font names
}

export interface DatabaseBrandColor {
  id: string;
  brand_id: string;
  name: string;
  hex: string;
}

export type AssetCategory = 'Logo' | 'Typography' | 'Imagery' | 'Other';

export interface DatabaseBrandAsset {
  id: string;
  brand_id: string;
  name: string;
  category: AssetCategory;
  url: string;
  thumbnail_url?: string;
  mime_type?: string;
}

// App types (for UI components)
export interface Brand {
  id: string;
  name: string;
  logo: string;
  logos: {
    id: string;
    name: string;
    url: string;
    format: 'PNG' | 'SVG';
  }[];
  colors: {
    id: string;
    name: string;
    hex: string;
  }[];
  fonts: string[]; // Simple array of font names
}

// Helper function to transform database brand to app brand
export function transformBrand(dbBrand: DatabaseBrand): Brand {
  return {
    id: dbBrand.id,
    name: dbBrand.name,
    logo: dbBrand.logo_url || '',
    logos: [], // Will be populated from separate logos table if needed
    colors: Array.isArray(dbBrand.colors) ? dbBrand.colors : [],
    fonts: Array.isArray(dbBrand.fonts) ? dbBrand.fonts : [],
  };
}
