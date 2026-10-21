import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { LocaleScrollRestore } from "@/components/locale-scroll-restore";
import { LocaleSwitchOverlay } from "@/components/locale-switch-overlay";
import { Navbar } from "@/components/navbar";
import { PageTransition } from "@/components/page-transition";
import { RouteLoadingOverlay } from "@/components/route-loading-overlay";
import { LocaleProvider } from "@/lib/i18n/provider";
import { isLocale, locales } from "@/lib/i18n/path";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <LocaleProvider locale={locale}>
      <LocaleScrollRestore />
      <div className="relative z-1 flex min-h-svh flex-col">
        <Navbar />
        <RouteLoadingOverlay />
        <LocaleSwitchOverlay />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </div>
    </LocaleProvider>
  );
}
