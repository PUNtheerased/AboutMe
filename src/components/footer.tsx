"use client";

import { GithubIcon, InstagramIcon } from "@/components/icons";
import { ScrambleText } from "@/components/ui/scramble-text";
import { profile } from "@/lib/data/profile";
import { useLocale } from "@/lib/i18n/provider";

export function Footer() {
  const { dict } = useLocale();
  return (
    <footer className="relative z-1 px-5 pt-10 pb-[calc(40px+env(safe-area-inset-bottom,0px))] text-center text-sm text-muted">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
        <p className="font-semibold text-ink">CODE × CAPTURE</p>
        <div className="flex items-center gap-3">
          <a
            href={profile.social.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex size-11 items-center justify-center rounded-full glass"
            aria-label="Instagram"
          >
            <InstagramIcon className="size-4" />
          </a>
          <a
            href={profile.social.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex size-11 items-center justify-center rounded-full glass"
            aria-label="GitHub"
          >
            <GithubIcon className="size-4" />
          </a>
        </div>
        <p>
          <ScrambleText text={dict.footer.copyright} />
        </p>
      </div>
    </footer>
  );
}
