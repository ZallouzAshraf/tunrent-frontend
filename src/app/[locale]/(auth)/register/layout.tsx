import { AuthRegisterBrandPanel } from "@/components/auth/auth-register-brand-panel";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 grid h-dvh max-h-dvh overflow-hidden bg-background lg:grid-cols-2">
      {children}
      <AuthRegisterBrandPanel />
    </div>
  );
}
