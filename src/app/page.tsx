import Link from 'next/link';

export default function HomePage(): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-ignyx-navy">iGNYX Lease</h1>
        <p className="mt-2 text-ignyx-ink-3">
          Plataforma de gestão da locação Khronner — Maff Franchising
        </p>
      </div>
      <Link
        href="/dashboard"
        className="rounded-md bg-ignyx-navy px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:opacity-90"
      >
        Acessar plataforma
      </Link>
    </main>
  );
}
