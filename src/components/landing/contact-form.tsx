"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Send,
  Loader2,
  CheckCircle2,
  User,
  Mail,
  FileText,
  MessageSquare,
  RotateCcw,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { publicApi, getErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

const TOPICS = [
  "booking",
  "partnership",
  "technical",
  "billing",
  "other",
] as const;

type Topic = (typeof TOPICS)[number];

const inputClassName =
  "h-11 rounded-xl border-black/[0.08] bg-white shadow-sm transition-shadow placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-primary/20";

export function ContactForm() {
  const t = useTranslations("pages.contact");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [topic, setTopic] = useState<Topic>("booking");
  const [messageLength, setMessageLength] = useState(0);
  const [formKey, setFormKey] = useState(0);

  const handleTopicSelect = (selected: Topic) => {
    setTopic(selected);
    const subjectInput = document.getElementById(
      "contact-subject",
    ) as HTMLInputElement | null;
    if (subjectInput && !subjectInput.value.trim()) {
      subjectInput.value = t(`topics.${selected}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setSending(true);
    try {
      await publicApi.contact({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        subject: String(data.get("subject") ?? ""),
        message: String(data.get("message") ?? ""),
      });
      setSent(true);
      toast.success(t("success"));
    } catch (error) {
      toast.error(getErrorMessage(error) || t("error"));
    } finally {
      setSending(false);
    }
  };

  const handleReset = () => {
    setSent(false);
    setTopic("booking");
    setMessageLength(0);
    setFormKey((k) => k + 1);
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50/80 to-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="size-8" aria-hidden />
        </div>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
          {t("successTitle")}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          {t("successDesc")}
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-8 gap-2 rounded-xl"
          onClick={handleReset}
        >
          <RotateCcw className="size-4" />
          {t("sendAnother")}
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white shadow-sm">
      <div className="border-b border-black/[0.05] px-6 py-6 sm:px-8">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          {t("formTitle")}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {t("formSubtitle")}
        </p>
      </div>

      <form
        key={formKey}
        onSubmit={handleSubmit}
        className="space-y-6 px-6 py-6 sm:px-8 sm:py-8"
      >
        <fieldset>
          <legend className="text-sm font-semibold text-foreground">
            {t("topicLabel")}
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {TOPICS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleTopicSelect(item)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all sm:text-sm",
                  topic === item
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-black/[0.08] bg-muted/30 text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-foreground",
                )}
              >
                {t(`topics.${item}`)}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contact-name" className="text-sm font-medium">
              {t("name")} <span className="text-accent">*</span>
            </Label>
            <div className="relative">
              <User className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                id="contact-name"
                name="name"
                required
                autoComplete="name"
                placeholder={t("namePlaceholder")}
                className={cn(inputClassName, "ps-10")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-email" className="text-sm font-medium">
              {t("email")} <span className="text-accent">*</span>
            </Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder={t("emailPlaceholder")}
                className={cn(inputClassName, "ps-10")}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-subject" className="text-sm font-medium">
            {t("subject")} <span className="text-accent">*</span>
          </Label>
          <div className="relative">
            <FileText className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              id="contact-subject"
              name="subject"
              required
              defaultValue={t(`topics.${topic}`)}
              placeholder={t("subjectPlaceholder")}
              className={cn(inputClassName, "ps-10")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="contact-message" className="text-sm font-medium">
              {t("message")} <span className="text-accent">*</span>
            </Label>
            <span className="text-xs text-muted-foreground tabular-nums">
              {messageLength} / 5000
            </span>
          </div>
          <div className="relative">
            <MessageSquare className="pointer-events-none absolute start-3 top-3.5 size-4 text-muted-foreground/70" />
            <Textarea
              id="contact-message"
              name="message"
              rows={6}
              required
              minLength={10}
              maxLength={5000}
              placeholder={t("messagePlaceholder")}
              onChange={(e) => setMessageLength(e.target.value.length)}
              className="min-h-[140px] resize-y rounded-xl border-black/[0.08] bg-white pt-3 ps-10 shadow-sm placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </div>
          <p className="text-xs text-muted-foreground">{t("messageHint")}</p>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground">
          {t("privacyNote")}{" "}
          <Link
            href="/confidentialite"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            {t("privacyLink")}
          </Link>
        </p>

        <Button
          type="submit"
          disabled={sending}
          size="lg"
          className="h-12 w-full gap-2 rounded-xl text-base font-semibold shadow-md sm:w-auto sm:min-w-[200px]"
        >
          {sending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {t("sending")}
            </>
          ) : (
            <>
              <Send className="size-4" />
              {t("submit")}
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
