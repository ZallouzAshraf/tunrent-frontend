import type { LegalDocumentContent } from "./types";

const CONTACT_EMAIL = "contact@tunrent.tn";

export const cookiesFr: LegalDocumentContent = {
  title: "Politique de gestion des cookies",
  metaDescription:
    "Politique des cookies TunRent — types de cookies et gestion de vos préférences.",
  lastUpdated: "Dernière mise à jour : 4 juillet 2026",
  tocTitle: "Tableau des matières",
  sections: [
    {
      id: "1",
      title: "Introduction",
      subsections: [
        {
          title: "Objet",
          paragraphs: [
            "TunRent utilise des cookies et des technologies similaires lorsque vous visitez notre site. La présente politique explique ce que sont les cookies, lesquels nous utilisons et comment gérer vos préférences.",
            "Elle complète notre politique de confidentialité, avec laquelle elle doit être lue conjointement.",
          ],
        },
        {
          title: "Cadre juridique",
          paragraphs: [
            "Nos pratiques sont régies par la loi tunisienne n° 2004-63 relative à la protection des données à caractère personnel et, le cas échéant, par les principes du RGPD pour les utilisateurs concernés.",
            "Les cookies strictement nécessaires peuvent être déposés sans consentement préalable. Les autres cookies nécessitent votre accord via la bannière affichée lors de votre première visite.",
          ],
        },
      ],
    },
    {
      id: "2",
      title: "Qu'est-ce qu'un cookie ?",
      subsections: [
        {
          title: "Définition",
          paragraphs: [
            "Les cookies sont de petits fichiers texte stockés sur votre terminal lorsque vous visitez un site. Ils permettent au site de reconnaître votre appareil et de mémoriser certaines informations.",
          ],
        },
        {
          title: "Technologies similaires",
          paragraphs: [
            "Nous pouvons également utiliser le stockage local du navigateur pour conserver vos préférences (langue, consentement cookies).",
          ],
        },
      ],
    },
    {
      id: "3",
      title: "Catégories de cookies utilisés",
      subsections: [
        {
          title: "Vue d'ensemble",
          paragraphs: ["TunRent utilise les catégories suivantes :"],
          list: [
            "Cookies strictement nécessaires — indispensables au fonctionnement ; sans consentement préalable.",
            "Cookies de préférence — mémorisent vos choix (langue) ; soumis à consentement.",
          ],
        },
        {
          title: "Absence de cookies publicitaires tiers",
          paragraphs: [
            "À ce jour, TunRent ne déploie pas de cookies publicitaires tiers (Meta Pixel, Google Ads, etc.). Si cela venait à changer, la présente politique serait mise à jour et votre consentement sollicité.",
          ],
        },
      ],
    },
    {
      id: "4",
      title: "Cookies strictement nécessaires",
      subsections: [
        {
          title: "Finalité",
          paragraphs: [
            "Ces cookies permettent l'authentification, la gestion de session, la sécurité (protection CSRF) et le bon fonctionnement de la plateforme.",
          ],
        },
        {
          title: "Cookies déployés",
          list: [
            "Cookie de session d'authentification — maintient votre connexion.",
            "Cookie de sécurité — prévention des accès frauduleux.",
            "Cookie d'état de connexion — indique si vous êtes connecté pour adapter l'interface.",
          ],
        },
        {
          title: "Conséquences de la désactivation",
          paragraphs: [
            "Bloquer ces cookies peut empêcher la connexion, la gestion de session ou la finalisation d'une réservation.",
          ],
        },
      ],
    },
    {
      id: "5",
      title: "Cookies de préférence",
      subsections: [
        {
          title: "Finalité",
          paragraphs: [
            "Ces cookies mémorisent vos choix pour une expérience cohérente d'une visite à l'autre.",
          ],
        },
        {
          title: "Cookies déployés",
          list: [
            "Préférence de langue — français ou arabe.",
            "Consentement cookies — mémorise votre choix concernant la bannière cookies.",
          ],
        },
      ],
    },
    {
      id: "6",
      title: "Gestion et retrait du consentement",
      subsections: [
        {
          title: "Bannière cookies",
          paragraphs: [
            "Lors de votre première visite, une bannière vous permet d'accepter les cookies non essentiels. Vous pouvez retirer votre consentement en supprimant les cookies via les paramètres de votre navigateur.",
          ],
        },
        {
          title: "Paramètres du navigateur",
          paragraphs: [
            "La plupart des navigateurs permettent de bloquer ou supprimer les cookies. Consultez l'aide de votre navigateur pour plus d'informations.",
          ],
        },
        {
          title: "Contact",
          paragraphs: [
            `Pour toute question : ${CONTACT_EMAIL}. Nous répondons dans un délai de trente (30) jours.`,
          ],
        },
      ],
    },
    {
      id: "7",
      title: "Modifications de la présente politique",
      subsections: [
        {
          title: "Évolution",
          paragraphs: [
            "TunRent peut mettre à jour cette politique à tout moment. La date de dernière mise à jour figure en tête de page.",
          ],
        },
        {
          title: "Droit applicable",
          paragraphs: [
            "La présente politique est régie par le droit tunisien. Tout litige relève des juridictions tunisiennes compétentes.",
          ],
        },
      ],
    },
  ],
};
