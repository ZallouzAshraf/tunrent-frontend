export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-secondary via-background to-secondary/50"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 end-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 start-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
