import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-medium tracking-tight text-[#111111]">
          Brand Asset Portal
        </h1>
        <p className="mt-4 text-sm text-[#111111]/60">
          Manage and share brand assets with your clients
        </p>
        <Link
          href="/dashboard"
          className="mt-8 inline-block rounded-sm border border-[#e5e5e5] bg-white px-6 py-3 text-sm font-medium text-[#111111] transition-colors hover:bg-[#111111]/5"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
