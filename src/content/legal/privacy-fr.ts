import type { LegalDocumentContent } from "./types";

const CONTACT_EMAIL = "contact@tunrent.tn";

export const privacyFr: LegalDocumentContent = {
  title: "Politique de confidentialité",
  metaDescription:
    "Politique de confidentialité TunRent — protection des données personnelles.",
  lastUpdated: "Dernière mise à jour : 4 juillet 2026",
  tocTitle: "Tableau des matières",
  sections: [
    {
      id: "1",
      title: "Introduction et champ d'application",
      subsections: [
        {
          title: "Objet de la présente politique",
          paragraphs: [
            "TunRent (« nous » ou « la plateforme ») s'engage à protéger la vie privée de ses utilisateurs. La présente politique décrit la manière dont nous collectons, utilisons, conservons et partageons les données à caractère personnel lorsque vous accédez aux services disponibles sur TunRent ou que vous les utilisez.",
            "En créant un compte ou en utilisant l'une des fonctionnalités de la plateforme, vous reconnaissez avoir pris connaissance de la présente politique et consentez au traitement de vos données dans les conditions qui y sont décrites.",
          ],
        },
        {
          title: "Personnes concernées",
          paragraphs: [
            "La présente politique s'applique à toute personne qui interagit avec la plateforme, qu'il s'agisse d'un client particulier ou d'un représentant d'une agence de location professionnelle inscrite sur TunRent.",
            "Elle ne s'applique pas aux traitements effectués de manière indépendante par les agences une fois qu'une demande de réservation leur a été transmise.",
          ],
        },
        {
          title: "Nature de la plateforme",
          paragraphs: [
            "TunRent intervient exclusivement en qualité d'intermédiaire technique. TunRent n'est partie à aucun contrat de location conclu entre un client et une agence. La plateforme a pour vocation de faciliter la mise en relation et la gestion des activités des agences partenaires.",
          ],
        },
      ],
    },
    {
      id: "2",
      title: "Identité du responsable de traitement",
      subsections: [
        {
          title: "Responsable de traitement",
          paragraphs: [
            "Le responsable de traitement des données personnelles traitées via la plateforme est TunRent, plateforme SaaS dédiée à l'intermédiation en matière de location de véhicules en Tunisie.",
          ],
        },
        {
          title: "Contact",
          paragraphs: [
            `Pour toute question relative au traitement de vos données, contactez-nous à : ${CONTACT_EMAIL}`,
          ],
        },
        {
          title: "Les agences en tant que responsables indépendants",
          paragraphs: [
            "Lorsqu'une demande de réservation est transmise à une agence, celle-ci devient responsable de traitement indépendant pour les données reçues dans le cadre du contrat de location.",
          ],
        },
      ],
    },
    {
      id: "3",
      title: "Données collectées",
      subsections: [
        {
          title: "Données obligatoires",
          paragraphs: ["Pour créer un compte et utiliser les services, nous collectons :"],
          list: [
            "Nom et prénom",
            "Adresse électronique",
            "Numéro de téléphone",
            "Matricule fiscal (pour les agences professionnelles)",
          ],
        },
        {
          title: "Données facultatives",
          paragraphs: [
            "Vous pouvez fournir volontairement : CIN, date de naissance, permis de conduire, passeport, adresse postale, nationalité.",
            "TunRent ne collecte pas de scans ou photographies de documents officiels, sauf fonctionnalité d'upload explicitement utilisée.",
          ],
        },
        {
          title: "Données non collectées",
          paragraphs: [
            "TunRent ne stocke pas les données bancaires complètes. Les paiements en ligne, lorsqu'ils sont activés, sont traités par des prestataires tiers certifiés.",
          ],
        },
      ],
    },
    {
      id: "4",
      title: "Finalités et bases légales du traitement",
      subsections: [
        {
          title: "Finalités",
          paragraphs: ["Vos données sont traitées pour :"],
          list: [
            "Gestion du compte et authentification",
            "Transmission des réservations aux agences",
            "Communications liées à votre demande",
            "Sécurité de la plateforme et prévention de la fraude",
            "Envoi d'emails transactionnels (confirmation, réinitialisation de mot de passe, etc.)",
            "Conformité légale",
          ],
        },
        {
          title: "Bases légales",
          paragraphs: [
            "Le traitement repose sur l'exécution du contrat, le consentement lorsque requis, l'obligation légale et l'intérêt légitime (sécurité, amélioration du service).",
          ],
        },
      ],
    },
    {
      id: "5",
      title: "Partage des données",
      subsections: [
        {
          title: "Destinataires",
          paragraphs: ["Vos données peuvent être communiquées à :"],
          list: [
            "L'agence de location que vous avez sélectionnée",
            "Nos hébergeurs cloud sécurisés",
            "Nos prestataires d'envoi d'emails (ex. Brevo)",
            "Les prestataires de paiement en ligne lorsque vous choisissez ce mode de règlement",
            "Les autorités compétentes lorsque la loi l'exige",
          ],
        },
        {
          title: "Absence de vente de données",
          paragraphs: [
            "TunRent ne vend, ne loue ni ne cède vos données personnelles à des tiers à des fins commerciales.",
          ],
        },
      ],
    },
    {
      id: "6",
      title: "Hébergement et transferts",
      subsections: [
        {
          title: "Infrastructure",
          paragraphs: [
            "La plateforme et les données associées sont hébergées sur une infrastructure cloud sécurisée. Des contrats de traitement encadrent nos sous-traitants techniques.",
          ],
        },
        {
          title: "Transferts internationaux",
          paragraphs: [
            "Certains prestataires (hébergement, email) peuvent traiter des données en dehors de la Tunisie. Ces transferts sont encadrés par des garanties contractuelles appropriées.",
          ],
        },
      ],
    },
    {
      id: "7",
      title: "Durée de conservation",
      subsections: [
        {
          title: "Durées applicables",
          paragraphs: [
            "Les données de compte sont conservées tant que le compte est actif. Après suppression, les données sont effacées ou anonymisées dans un délai raisonnable, sauf obligation légale de conservation.",
            "Les journaux techniques sont conservés pour une durée limitée à des fins de sécurité.",
          ],
        },
      ],
    },
    {
      id: "8",
      title: "Sécurité des données",
      subsections: [
        {
          title: "Mesures techniques",
          paragraphs: [
            "TunRent met en œuvre des mesures appropriées : chiffrement en transit, contrôles d'accès, authentification sécurisée et surveillance.",
          ],
        },
        {
          title: "Responsabilité de l'utilisateur",
          paragraphs: [
            "Vous êtes responsable de la confidentialité de vos identifiants. Signalez toute utilisation non autorisée à",
            CONTACT_EMAIL,
          ],
        },
      ],
    },
    {
      id: "9",
      title: "Droits des utilisateurs",
      subsections: [
        {
          title: "Vos droits",
          paragraphs: ["Sous réserve du droit applicable, vous disposez des droits d'accès, de rectification, d'effacement, de limitation, d'opposition et de retrait du consentement."],
        },
        {
          title: "Exercice des droits",
          paragraphs: [
            `Adressez votre demande à ${CONTACT_EMAIL}. Nous répondons dans un délai de trente (30) jours.`,
          ],
        },
        {
          title: "Protection des mineurs",
          paragraphs: [
            "La plateforme n'est pas destinée aux personnes de moins de 18 ans.",
          ],
        },
      ],
    },
    {
      id: "10",
      title: "Modifications de la politique",
      subsections: [
        {
          title: "Évolution",
          paragraphs: [
            "TunRent peut modifier la présente politique à tout moment. Les modifications substantielles seront portées à votre connaissance via la plateforme.",
            "La poursuite de l'utilisation après publication vaut acceptation de la version mise à jour.",
          ],
        },
        {
          title: "Droit applicable",
          paragraphs: [
            "La présente politique est régie par le droit tunisien, notamment la loi n° 2004-63 relative à la protection des données à caractère personnel.",
          ],
        },
      ],
    },
  ],
};
