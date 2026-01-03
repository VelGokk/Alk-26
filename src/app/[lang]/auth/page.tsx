import AuthForm from "@/components/public/AuthForm";

export default function AuthPage({ params }: { params: { lang: string } }) {
  const showGoogle = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  );
  const showGitHub = Boolean(
    process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
  );

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Acceso
        </p>
        <h1 className="font-heading text-3xl">Ingresa a ALKAYA</h1>
      </div>
      <div className="glass-panel rounded-3xl p-8">
        <AuthForm
          lang={params.lang}
          showGoogle={showGoogle}
          showGitHub={showGitHub}
        />
      </div>
    </div>
  );
}

