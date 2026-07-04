import { redirect } from "@/i18n/routing";

export default async function CgvRedirectPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/conditions", locale });
}
