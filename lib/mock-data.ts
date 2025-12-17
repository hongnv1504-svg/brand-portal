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
  typography: {
    id: string;
    name: string;
    fontFamily: string;
    weights: string[];
  }[];
}

export const mockBrands: Brand[] = [
  {
    id: '1',
    name: 'TechFlow',
    logo: 'https://via.placeholder.com/120x60/111111/FFFFFF?text=TechFlow',
    logos: [
      {
        id: 'logo-1',
        name: 'Logo Primary',
        url: 'https://via.placeholder.com/400x200/111111/FFFFFF?text=TechFlow+Logo',
        format: 'PNG',
      },
      {
        id: 'logo-2',
        name: 'Logo Icon',
        url: 'https://via.placeholder.com/200x200/111111/FFFFFF?text=TF',
        format: 'SVG',
      },
      {
        id: 'logo-3',
        name: 'Logo Horizontal',
        url: 'https://via.placeholder.com/600x150/111111/FFFFFF?text=TechFlow+Horizontal',
        format: 'PNG',
      },
    ],
    colors: [
      {
        id: 'color-1',
        name: 'Primary Blue',
        hex: '#0066FF',
      },
      {
        id: 'color-2',
        name: 'Dark Gray',
        hex: '#111111',
      },
      {
        id: 'color-3',
        name: 'Light Gray',
        hex: '#F5F5F5',
      },
      {
        id: 'color-4',
        name: 'Accent Orange',
        hex: '#FF6B35',
      },
    ],
    typography: [
      {
        id: 'font-1',
        name: 'Primary Font',
        fontFamily: 'Inter, sans-serif',
        weights: ['400', '500', '600', '700'],
      },
      {
        id: 'font-2',
        name: 'Display Font',
        fontFamily: 'Poppins, sans-serif',
        weights: ['400', '600', '700'],
      },
    ],
  },
  {
    id: '2',
    name: 'Elegance Co.',
    logo: 'https://via.placeholder.com/120x60/111111/FFFFFF?text=Elegance',
    logos: [
      {
        id: 'logo-1',
        name: 'Logo Mark',
        url: 'https://via.placeholder.com/300x300/111111/FFFFFF?text=E',
        format: 'SVG',
      },
      {
        id: 'logo-2',
        name: 'Logo Full',
        url: 'https://via.placeholder.com/500x200/111111/FFFFFF?text=Elegance+Co.',
        format: 'PNG',
      },
      {
        id: 'logo-3',
        name: 'Logo White',
        url: 'https://via.placeholder.com/500x200/FFFFFF/111111?text=Elegance+Co.',
        format: 'PNG',
      },
    ],
    colors: [
      {
        id: 'color-1',
        name: 'Charcoal',
        hex: '#2C2C2C',
      },
      {
        id: 'color-2',
        name: 'Gold',
        hex: '#D4AF37',
      },
      {
        id: 'color-3',
        name: 'Cream',
        hex: '#F8F6F0',
      },
      {
        id: 'color-4',
        name: 'Deep Navy',
        hex: '#1A1F3A',
      },
    ],
    typography: [
      {
        id: 'font-1',
        name: 'Body Font',
        fontFamily: 'Helvetica Neue, sans-serif',
        weights: ['300', '400', '500'],
      },
      {
        id: 'font-2',
        name: 'Heading Font',
        fontFamily: 'Playfair Display, serif',
        weights: ['400', '600', '700'],
      },
    ],
  },
];

export function getBrandById(id: string): Brand | undefined {
  return mockBrands.find((brand) => brand.id === id);
}

