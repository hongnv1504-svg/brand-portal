import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAssetType(filenameOrUrl: string): 'AI' | 'PDF' | 'EPS' | 'PNG/JPG' | 'Other' {
  try {
    const url = new URL(filenameOrUrl, 'http://example.com');
    const pathname = url.pathname || '';
    const parts = pathname.split('/');
    const name = (parts.length > 0 ? parts[parts.length - 1] : '') || filenameOrUrl;
    const extPart = name.includes('.') ? name.split('.').pop() : '';
    const ext = (extPart ?? '').toLowerCase();
    if (ext === 'ai') return 'AI';
    if (ext === 'pdf') return 'PDF';
    if (ext === 'eps') return 'EPS';
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') return 'PNG/JPG';
    return 'Other';
  } catch {
    const name = filenameOrUrl;
    const extPart = name.includes('.') ? name.split('.').pop() : '';
    const ext = (extPart ?? '').toLowerCase();
    if (ext === 'ai') return 'AI';
    if (ext === 'pdf') return 'PDF';
    if (ext === 'eps') return 'EPS';
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') return 'PNG/JPG';
    return 'Other';
  }
}
