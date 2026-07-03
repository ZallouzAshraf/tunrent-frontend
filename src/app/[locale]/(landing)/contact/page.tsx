"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Mail, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactPage() {
  const t = useTranslations("pages.contact");
  const tFooter = useTranslations("landing.footer");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSending(false);
    toast.success(t("success"));
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          {t("intro")}
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{t("formTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("name")}</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">{t("subject")}</Label>
                <Input id="subject" name="subject" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">{t("message")}</Label>
                <Textarea id="message" name="message" rows={5} required />
              </div>
              <Button type="submit" disabled={sending} className="gap-2">
                <Send className="size-4" />
                {t("submit")}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-foreground">{t("infoTitle")}</h2>
              <ul className="mt-4 space-y-4">
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  {t("address")}
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="size-4 shrink-0 text-primary" />
                  <a
                    href={`mailto:${tFooter("email")}`}
                    className="hover:text-primary"
                  >
                    {tFooter("email")}
                  </a>
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Clock className="size-4 shrink-0 text-primary" />
                  {t("hours")}
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
