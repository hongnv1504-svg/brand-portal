'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { signOut } from '../actions';

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut();
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center gap-2 rounded-sm border border-[#e5e5e5] bg-white px-3 py-1.5 text-xs font-medium text-[#111111] transition-colors hover:bg-[#111111]/5 disabled:opacity-50"
      title="Sign Out"
    >
      <LogOut className="h-3.5 w-3.5" />
      {isLoading ? 'Signing out...' : 'Sign Out'}
    </button>
  );
}

