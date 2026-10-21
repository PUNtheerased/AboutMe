"use client";

import { Glass } from "@/components/glass";
import { ScrambleText } from "@/components/ui/scramble-text";
import { profile } from "@/lib/data/profile";
import { useLocale } from "@/lib/i18n/provider";

export function AboutContent() {
  const { locale, dict } = useLocale();
  const code = profile.codeSkills[locale];
  const photo = profile.photoSkills[locale];

  return (
    <div className="mx-auto max-w-[1100px] px-5 pt-[130px] pb-[90px]">
      <div className="grid items-start gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h1 className="mb-4 text-[clamp(2.4rem,6vw,4.5rem)] font-extrabold tracking-tight">
            <ScrambleText text={dict.about.title} />
          </h1>
          <p className="mb-2 text-sm text-muted">
            <ScrambleText text={dict.about.legalName} />
          </p>
          <p className="max-w-[50ch] text-lg text-muted">
            <ScrambleText text={dict.about.body} speed={25} />
          </p>
        </div>
        <div
          className="mx-auto aspect-3/4 w-[min(260px,70vw)] polaroid rotate-[-4deg] bg-linear-to-br from-pink to-blue"
          role="img"
          aria-label="Portrait placeholder"
        />
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <Glass className="rounded-3xl p-8">
          <h2 className="mb-3 text-2xl font-extrabold">
            <ScrambleText text={dict.about.codeTitle} />
          </h2>
          <ul className="space-y-2 text-muted">
            {code.map((item) => (
              <li key={item}>
                <ScrambleText text={item} />
              </li>
            ))}
          </ul>
        </Glass>
        <Glass className="rounded-3xl p-8">
          <h2 className="mb-3 text-2xl font-extrabold">
            <ScrambleText text={dict.about.photoTitle} />
          </h2>
          <ul className="space-y-2 text-muted">
            {photo.map((item) => (
              <li key={item}>
                <ScrambleText text={item} />
              </li>
            ))}
          </ul>
        </Glass>
      </div>

      <section className="mt-14">
        <h2 className="mb-6 text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-tight">
          <ScrambleText text={dict.about.timelineTitle} />
        </h2>
        <ol className="relative space-y-6 border-l border-edge pl-6">
          {profile.timeline.map((item) => (
            <li key={item.year} className="relative">
              <span className="absolute top-1.5 -left-[31px] size-3 rounded-full bg-blue" />
              <p className="text-sm font-semibold text-blue">{item.year}</p>
              <p className="text-muted">
                <ScrambleText text={item[locale]} />
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14">
        <h2 className="mb-6 text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-tight">
          <ScrambleText text={dict.about.factsTitle} />
        </h2>
        <div className="flex flex-wrap gap-3">
          {profile.funFacts.map((fact) => (
            <span
              key={fact.en}
              className="rounded-full border border-edge bg-sun/80 px-4 py-2 text-sm font-semibold text-[#14161C]"
              style={{ transform: `rotate(${fact.rotate}deg)` }}
            >
              <ScrambleText text={fact[locale]} />
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
