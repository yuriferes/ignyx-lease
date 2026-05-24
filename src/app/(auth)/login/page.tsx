import Image from 'next/image';
import { redirect } from 'next/navigation';
import { LoginForm } from './login-form';
import { getSession } from '@/lib/auth/session';

interface LoginPageProps {
  searchParams: Promise<{ next?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps): Promise<JSX.Element> {
  const session = await getSession();
  if (session) redirect('/dashboard');

  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-ignyx-bg px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Image src="/logo.svg" alt="iGNYX Lease" width={180} height={42} priority />
          <p className="mt-3 text-sm text-text-secondary">Plataforma da rede Maff Franchising</p>
        </div>

        <div className="rounded-2xl border border-border-default bg-white p-8 shadow-ignyx-md">
          <h1 className="mb-1 text-2xl font-semibold tracking-tight text-text-primary">Entrar</h1>
          <p className="mb-6 text-sm text-text-secondary">
            Acesse sua conta com e-mail e senha.
          </p>

          <LoginForm next={params.next} initialError={params.error} />
        </div>

        <p className="mt-6 text-center text-xs text-text-tertiary">
          © {new Date().getFullYear()} Maff Franchising
        </p>
      </div>
    </main>
  );
}
