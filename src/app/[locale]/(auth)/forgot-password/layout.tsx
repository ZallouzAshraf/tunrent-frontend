import { AuthForgotBrandPanel } from "@/components/auth/auth-forgot-brand-panel";

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 grid h-dvh max-h-dvh overflow-hidden bg-background lg:grid-cols-2">
      <AuthForgotBrandPanel />
      {children}
    </div>
  );
}
