import { SITE } from "@/lib/site";
import PolicyPage from "../privacy/PolicyPage";

export const metadata = {
  title: "Terms of Service",
  description: "The rules for using SaveBlood as a donor, requester, volunteer or administrator.",
};

const sections = [
  {
    heading: "Acceptance of terms",
    body: ["By creating an account or using SaveBlood you agree to these terms. If you do not agree, please do not use the platform."],
  },
  {
    heading: "What SaveBlood is, and is not",
    body: [
      "SaveBlood is a free matching service between voluntary blood donors and people who need blood. We are not a hospital or a licensed blood bank, we do not collect, test or store blood, and we do not give medical advice. All donations take place at licensed medical facilities that apply their own screening.",
    ],
  },
  {
    heading: "No sale of blood",
    body: ["Blood and blood products must never be bought or sold through SaveBlood. Offering or requesting payment for blood, or using the platform to broker it, will lead to immediate removal of your account and may be reported to the authorities."],
  },
  {
    heading: "Your account",
    body: ["You must provide accurate information, including your real blood group, and keep your password confidential. You are responsible for activity on your account. You must be at least 18 years old to register as a donor."],
  },
  {
    heading: "Posting requests",
    body: ["Requests must describe a genuine medical need. You agree to:"],
    list: [
      "provide truthful patient, hospital and date information;",
      "update or close the request once the need has been met or cancelled;",
      "not post duplicate, misleading or abusive requests.",
    ],
  },
  {
    heading: "Responding as a donor",
    body: ["Donating is voluntary. Respond only if you are eligible and willing to attend, follow the screening rules of the hospital, and tell the family promptly if you can no longer donate. Eligibility is decided by the medical staff on the day."],
  },
  {
    heading: "Acceptable use",
    body: ["You agree not to harass other users, misuse contact details, scrape the site, attempt to access other accounts or interfere with the service. We may suspend or block accounts that break these rules."],
  },
  {
    heading: "Contributions",
    body: ["Contributions on the Funding page are voluntary, are processed by Stripe and are used for donor transport and awareness camps. They are non-refundable unless a payment was made in error, in which case contact us promptly."],
  },
  {
    heading: "Disclaimer and liability",
    body: ["The service is provided as is. To the extent permitted by law, SaveBlood and its volunteers are not liable for the outcome of any donation or for the accuracy of information posted by users. In a medical emergency, contact the hospital or emergency services directly."],
  },
  {
    heading: "Changes and contact",
    body: [`We may update these terms and will change the date above when we do. Questions can be sent to ${SITE.email} or ${SITE.phone}.`],
  },
];

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms of Service"
      updated="1 October 2026"
      intro="These terms explain the rules for using SaveBlood. They are written to protect donors, patients and families alike."
      sections={sections}
    />
  );
}
