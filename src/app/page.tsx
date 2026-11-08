import { cookies } from "next/headers";
import { ComingSoonView } from "@/components/coming-soon/coming-soon-view";
import { LocaleProvider } from "@/lib/i18n/provider";
import { defaultLocale, isLocale } from "@/lib/i18n/path";

export default async function ComingSoonPage() {
  const jar = await cookies();
  const raw = jar.get("pun-locale")?.value;
  const locale = raw && isLocale(raw) ? raw : defaultLocale;

  return (
    <LocaleProvider locale={locale}>
      <ComingSoonView />
    </LocaleProvider>
  );
}
