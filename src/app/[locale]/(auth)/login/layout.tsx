import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 grid h-dvh max-h-dvh overflow-hidden bg-background lg:grid-cols-2">
      <AuthBrandPanel />
      {children}
    </div>
  );
}
