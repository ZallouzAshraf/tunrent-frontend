import type { LegalDocumentContent } from "./types";

const CONTACT_EMAIL = "contact@tunrent.tn";

export const termsFr: LegalDocumentContent = {
  title: "Conditions générales d'utilisation",
  metaDescription:
    "Conditions générales d'utilisation de la plateforme TunRent — location de voitures en Tunisie.",
  lastUpdated: "Dernière mise à jour : 4 juillet 2026",
  tocTitle: "Tableau des matières",
  sections: [
    {
      id: "1",
      title: "Nature du service et éligibilité",
      subsections: [
        {
          title: "Rôle de la plateforme",
          paragraphs: [
            "TunRent agit exclusivement en tant qu'intermédiaire technique et fournisseur de solution logicielle (SaaS).",
            "La plateforme facilite la mise en relation entre des agences de location professionnelles et des clients potentiels.",
            "TunRent n'est ni loueur, ni propriétaire des véhicules, ni mandataire, ni partie au contrat de location conclu entre l'agence et le client.",
          ],
        },
        {
          title: "Éligibilité des agences",
          paragraphs: [
            "Seules les agences de location de véhicules légalement constituées et enregistrées conformément à la législation tunisienne peuvent s'inscrire sur la plateforme.",
            "La fourniture d'un matricule fiscal valide est obligatoire.",
            "La location entre particuliers est strictement interdite sur TunRent.",
          ],
        },
        {
          title: "Éligibilité des clients",
          paragraphs: ["Les services sont accessibles uniquement aux clients :"],
          list: [
            "âgés d'au moins 18 ans ;",
            "titulaires d'un permis de conduire valide ;",
            "respectant les conditions spécifiques définies par chaque agence (âge minimum, ancienneté du permis, etc.).",
          ],
        },
      ],
    },
    {
      id: "2",
      title: "Mentions légales",
      subsections: [
        {
          title: "Éditeur",
          paragraphs: [
            "Le site TunRent est édité par TunRent, plateforme SaaS dédiée à l'intermédiation en matière de location de véhicules en Tunisie.",
          ],
        },
        {
          title: "Contact",
          paragraphs: [`Adresse email : ${CONTACT_EMAIL}`],
        },
        {
          title: "Activité",
          paragraphs: [
            "Fournisseur de solution logicielle (SaaS) et intermédiaire technique de mise en relation entre agences et clients.",
          ],
        },
      ],
    },
    {
      id: "3",
      title: "Comptes et données utilisateurs",
      subsections: [
        {
          title: "Inscription et responsabilité",
          paragraphs: [
            "L'utilisateur est seul responsable de l'exactitude, de la sincérité et de la mise à jour des informations transmises via la plateforme.",
            "Toute fausse déclaration ou information inexacte peut entraîner la suspension ou la suppression du compte.",
          ],
        },
        {
          title: "Données obligatoires",
          paragraphs: [
            "La création d'un compte nécessite la fourniture des informations suivantes :",
          ],
          list: [
            "Nom et prénom",
            "Adresse email",
            "Numéro de téléphone",
          ],
        },
        {
          title: "Données optionnelles (non exigées)",
          paragraphs: [
            "Les informations suivantes sont strictement facultatives et destinées à accélérer la préparation du contrat de location par l'agence :",
          ],
          list: [
            "Numéro de CIN et date de délivrance",
            "Date de naissance",
            "Numéro de permis de conduire et date de délivrance",
            "Numéro de passeport (notamment pour les touristes)",
            "Adresse postale",
            "Nationalité",
          ],
        },
        {
          title: "Sécurité des données",
          paragraphs: [
            "TunRent ne collecte ni ne conserve de copies numériques (images, scans ou fichiers) des documents d'identité ou de conduite, sauf fonctionnalité d'upload explicitement proposée et acceptée par l'utilisateur.",
            "Seules les données textuelles saisies volontairement par l'utilisateur sont traitées et transmises à l'agence concernée.",
          ],
        },
      ],
    },
    {
      id: "4",
      title: "Processus de réservation et paiement",
      subsections: [
        {
          title: "Réservation",
          paragraphs: [
            "Le client soumet une demande de réservation via la plateforme.",
            "L'agence doit confirmer ou refuser la demande pour que la mise en relation soit validée.",
          ],
        },
        {
          title: "Paiement",
          paragraphs: [
            "Sauf mention contraire lors de la réservation, le règlement du loyer, de la caution et des éventuels frais s'effectue directement entre le client et l'agence selon les modalités définies par cette dernière.",
            "Lorsque le paiement en ligne est proposé (Flouci, D17 ou autres moyens locaux), il est traité via des prestataires tiers sécurisés. TunRent n'est pas responsable des incidents liés à ces prestataires.",
            "Les agences partenaires souscrivent à un abonnement TunRent pour accéder aux outils de gestion ; cet abonnement est distinct du contrat de location conclu avec le client.",
          ],
        },
      ],
    },
    {
      id: "5",
      title: "Disponibilité du service et responsabilité",
      subsections: [
        {
          title: "Disponibilité",
          paragraphs: [
            "TunRent s'efforce d'assurer une disponibilité continue de la plateforme mais ne garantit pas un fonctionnement sans interruption.",
            "TunRent ne saurait être tenu responsable des interruptions temporaires liées à la maintenance, à des incidents techniques, à des mises à jour ou à des contraintes externes.",
          ],
        },
        {
          title: "Responsabilité",
          paragraphs: [
            "Les agences sont seules responsables de la véracité des photos, tarifs, descriptions et conditions affichées.",
            "TunRent ne peut être tenu responsable des écarts entre les informations publiées et l'état réel du véhicule.",
          ],
        },
      ],
    },
    {
      id: "6",
      title: "Annulations et litiges",
      subsections: [
        {
          title: "Annulations",
          paragraphs: [
            "Les politiques d'annulation, de modification et de remboursement sont définies par chaque agence.",
            "TunRent les affiche à titre informatif uniquement et n'intervient pas dans leur application.",
          ],
        },
        {
          title: "Litiges",
          paragraphs: [
            "En cas de différend entre un client et une agence (état du véhicule, caution, facturation, etc.), TunRent n'assume aucune responsabilité légale.",
            "Les parties devront résoudre leur litige directement entre elles ou devant les autorités compétentes.",
          ],
        },
      ],
    },
    {
      id: "7",
      title: "Suspension et suppression de compte",
      subsections: [
        {
          title: "Mesures",
          paragraphs: [
            "TunRent se réserve le droit de suspendre ou supprimer tout compte (client ou agence), le cas échéant sans préavis, notamment en cas de :",
          ],
          list: [
            "utilisation frauduleuse ou abusive ;",
            "non-respect des présentes conditions ;",
            "comportement portant atteinte au bon fonctionnement ou à l'image de la plateforme.",
          ],
        },
      ],
    },
    {
      id: "8",
      title: "Modification des conditions",
      subsections: [
        {
          title: "Évolution des conditions",
          paragraphs: [
            "TunRent se réserve le droit de modifier les présentes conditions à tout moment.",
            "La version applicable est celle publiée sur la plateforme à la date d'utilisation. Il appartient à l'utilisateur de consulter régulièrement cette page.",
          ],
        },
      ],
    },
    {
      id: "9",
      title: "Droit applicable et juridiction",
      subsections: [
        {
          title: "Cadre légal",
          paragraphs: ["Les présentes conditions sont régies par le droit tunisien."],
        },
        {
          title: "Compétence",
          paragraphs: [
            "En cas de litige relatif à l'utilisation de la plateforme et à défaut d'accord amiable, compétence exclusive est attribuée aux tribunaux de Tunis territorialement compétents.",
          ],
        },
      ],
    },
    {
      id: "10",
      title: "Acceptation des conditions",
      subsections: [
        {
          title: "Acceptation",
          paragraphs: [
            "L'accès et l'utilisation de la plateforme TunRent emportent l'acceptation automatique, pleine et entière des présentes conditions générales d'utilisation.",
          ],
        },
        {
          title: "Refus des conditions",
          paragraphs: [
            "Si l'utilisateur n'accepte pas tout ou partie des présentes conditions, il doit immédiatement cesser d'utiliser la plateforme.",
          ],
        },
        {
          title: "Mise à jour",
          paragraphs: [
            "L'utilisation continue de la plateforme après toute modification des conditions vaut acceptation de la version mise à jour.",
          ],
        },
      ],
    },
  ],
};
