import type { LegalDocumentContent } from "@/content/legal/types";
import { cn } from "@/lib/utils";

export function LegalDocument({ document }: { document: LegalDocumentContent }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {document.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{document.lastUpdated}</p>
      </header>

      <nav
        aria-label={document.tocTitle}
        className="mt-10 rounded-xl border border-black/[0.06] bg-muted/30 p-6"
      >
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
          {document.tocTitle}
        </h2>
        <ol className="mt-4 space-y-2 text-sm">
          {document.sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#section-${section.id}`}
                className="text-primary hover:underline"
              >
                {section.id}. {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-12 space-y-12">
        {document.sections.map((section) => (
          <section
            key={section.id}
            id={`section-${section.id}`}
            className="scroll-mt-24"
          >
            <h2 className="text-xl font-semibold text-foreground">
              {section.id}. {section.title}
            </h2>
            <div className="mt-6 space-y-8">
              {section.subsections.map((subsection, index) => (
                <div key={index}>
                  <h3 className="text-base font-medium text-foreground">
                    {subsection.title}
                  </h3>
                  {subsection.paragraphs?.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className={cn(
                        "mt-3 text-sm leading-relaxed text-muted-foreground",
                        pIndex > 0 && "mt-3",
                      )}
                    >
                      {paragraph}
                    </p>
                  ))}
                  {subsection.list && subsection.list.length > 0 && (
                    <ul className="mt-3 list-disc space-y-2 ps-5 text-sm leading-relaxed text-muted-foreground">
                      {subsection.list.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
