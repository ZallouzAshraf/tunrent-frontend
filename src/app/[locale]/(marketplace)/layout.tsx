import { MarketplaceHeader } from "@/components/marketplace/marketplace-header";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketplaceHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-muted/30 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} TunRent — Location de voitures en Tunisie</p>
        </div>
      </footer>
    </div>
  );
}
