"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import {
  sendContactMessage,
  type ContactState,
} from "@/lib/contact-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrambleText } from "@/components/ui/scramble-text";
import { useLocale } from "@/lib/i18n/provider";
import { profile } from "@/lib/data/profile";

const initial: ContactState = { ok: false };

export function ContactForm() {
  const { dict } = useLocale();
  const [state, action, pending] = useActionState(sendContactMessage, initial);

  useEffect(() => {
    if (state.ok) toast.success(dict.contact.success);
    else if (state.error) toast.error(dict.contact.error);
  }, [state, dict.contact.error, dict.contact.success]);

  return (
    <div className="mx-auto max-w-[720px] px-5 pt-[130px] pb-[90px]">
      <h1 className="mb-2 text-[clamp(2.4rem,6vw,4.5rem)] font-extrabold tracking-tight">
        <ScrambleText text={dict.contact.title} />
      </h1>
      <p className="mb-8 max-w-[42ch] text-muted">
        <ScrambleText text={dict.contact.subtitle} />
      </p>

      <form action={action} className="glass space-y-4 rounded-3xl p-5 sm:p-7">
        <div>
          <Label htmlFor="name">
            <ScrambleText text={dict.contact.name} />
          </Label>
          <Input id="name" name="name" required autoComplete="name" />
        </div>
        <div>
          <Label htmlFor="email">
            <ScrambleText text={dict.contact.email} />
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
        </div>
        <div>
          <Label htmlFor="message">
            <ScrambleText text={dict.contact.message} />
          </Label>
          <Textarea id="message" name="message" required rows={6} />
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button type="submit" disabled={pending}>
            <ScrambleText
              text={pending ? dict.contact.sending : dict.contact.send}
            />
          </Button>
          <a
            href={`mailto:${profile.email}`}
            className="text-sm font-medium text-muted underline-offset-4 hover:text-ink hover:underline"
          >
            {profile.email}
          </a>
        </div>
      </form>
    </div>
  );
}
