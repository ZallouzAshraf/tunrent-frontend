export type LegalSubsection = {
  title: string;
  paragraphs?: string[];
  list?: string[];
};

export type LegalSection = {
  id: string;
  title: string;
  subsections: LegalSubsection[];
};

export type LegalDocumentContent = {
  title: string;
  metaDescription: string;
  lastUpdated: string;
  tocTitle: string;
  sections: LegalSection[];
};

export type LegalDocumentType = "terms" | "privacy" | "cookies";
