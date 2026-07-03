import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

const steps = [
  { key: "step1" as const, image: "/assets/howitworksstep1.webp" },
  { key: "step2" as const, image: "/assets/howitworksstep2.webp" },
  { key: "step3" as const, image: "/assets/howitworksstep3.webp" },
  { key: "step4" as const, image: "/assets/howitworksstep4.webp" },
] as const;

interface HowItWorksStepsProps {
  namespace?: "landing.howItWorks" | "pages.howItWorks";
  className?: string;
}

export async function HowItWorksSteps({
  namespace = "landing.howItWorks",
  className,
}: HowItWorksStepsProps) {
  const t = await getTranslations(namespace);

  const title = namespace === "pages.howItWorks" ? t("stepsTitle") : t("title");
  const subtitle =
    namespace === "pages.howItWorks" ? t("stepsSubtitle") : t("subtitle");

  return (
    <section className={cn("bg-background", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        </div>

        <div className="mt-11 grid grid-cols-1 gap-9 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:mt-12 lg:grid-cols-4 lg:gap-x-8">
          {steps.map(({ key, image }) => (
            <div
              key={key}
              className="flex w-full min-w-0 flex-col items-center px-3 text-center sm:px-4"
            >
              <div className="flex h-24 w-full items-center justify-center sm:h-[6.5rem]">
                <Image
                  src={image}
                  alt={t(`${key}Title`)}
                  width={112}
                  height={112}
                  className="h-[5.25rem] w-auto object-contain sm:h-24"
                  sizes="112px"
                />
              </div>

              <h3 className="mt-4 w-full text-base font-bold leading-snug text-foreground">
                {t(`${key}Title`)}
              </h3>
              <p className="mt-2 w-full text-sm leading-relaxed text-muted-foreground">
                {t(`${key}Desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
