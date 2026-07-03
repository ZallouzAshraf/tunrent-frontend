import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export default async function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
