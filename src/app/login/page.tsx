export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-ink)] px-4">
      <div className="w-full max-w-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h1 className="mb-1 font-[family-name:var(--font-display)] text-2xl tracking-wide text-[var(--color-bone)]">100 Day Log</h1>
        <p className="mb-6 text-sm text-[var(--color-muted)]">Enter your passphrase to continue.</p>
        <form action="/api/login" method="POST" className="flex flex-col gap-3">
          <input type="hidden" name="next" value={next ?? "/"} />
          <input type="password" name="passphrase" autoFocus placeholder="Passphrase" className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-bone)]" />
          {error && <p className="text-xs text-[var(--color-ember)]">That passphrase didn&apos;t match.</p>}
          <button type="submit" className="rounded-lg bg-[var(--color-ember)] px-4 py-2 text-sm font-medium text-[var(--color-ink)]">Enter</button>
        </form>
      </div>
    </div>
  );
}
