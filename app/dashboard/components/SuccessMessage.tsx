'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function SuccessMessage() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="mb-6 rounded-sm border border-[#111111]/20 bg-[#111111]/5 px-4 py-3 flex items-center gap-2">
      <CheckCircle2 className="h-4 w-4 text-[#111111]" />
      <p className="text-sm text-[#111111]">Brand created successfully!</p>
    </div>
  );
}

