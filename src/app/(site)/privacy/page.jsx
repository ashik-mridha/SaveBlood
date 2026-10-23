import { SITE } from "@/lib/site";
import PolicyPage from "./PolicyPage";

export const metadata = {
  title: "Privacy Policy",
  description: "What personal information SaveBlood collects, who can see it and how you can control it.",
};

const sections = [
  {
    heading: "Information we collect",
    body: ["When you create an account or use the platform we collect only what is needed to connect donors and patients:"],
    list: [
      "Account details: your name, email address and a password (stored only as a salted hash).",
      "Donor profile: blood group, district, upazila and an optional profile photo and mobile number.",
      "Requests you create: patient name, hospital, address, date, time, urgency and message.",
      "Messages you send through the contact form, and contributions you make on the Funding page.",
    ],
  },
  {
    heading: "How we use your information",
    body: [
      "We use your information to show donors to people who search by blood group and location, to let families publish blood requests, to coordinate donations and to reply to your messages.",
      "We do not sell your data, and we do not use it for advertising.",
    ],
  },
  {
    heading: "Who can see what",
    body: ["Visibility depends on whether the viewer is signed in:"],
    list: [
      "Anyone can see open donation requests, including the patient's first-hand details needed to donate (hospital, date, blood group).",
      "Donor search results show name, blood group and location to everyone. Email addresses and phone numbers are shown only to signed-in members.",
      "Requester and donor contact details on a request are visible only to the people involved in that request, volunteers and administrators.",
    ],
  },
  {
    heading: "Payments",
    body: [
      "Contributions are processed by Stripe. SaveBlood never sees or stores your card number; we keep only the amount, date and the name of the account that paid. Contributor email addresses are not displayed publicly.",
    ],
  },
  {
    heading: "Security",
    body: [
      "Passwords are hashed before storage, sessions use signed tokens that expire, and the API only accepts requests from approved origins. No system is perfectly secure, so please choose a strong, unique password and log out on shared devices.",
    ],
  },
  {
    heading: "Your choices",
    body: [
      "You can edit your name, blood group, location, phone number and photo at any time from your dashboard profile, and change your password from Settings. To delete your account or any request, or to ask for a copy of your data, contact us using the details below.",
    ],
  },
  {
    heading: "Cookies and local storage",
    body: ["We store your sign-in token and your light or dark theme preference in your browser's local storage. We do not use advertising or cross-site tracking cookies."],
  },
  {
    heading: "Contact",
    body: [`For privacy questions email ${SITE.email}, call ${SITE.phone} or write to ${SITE.address}.`],
  },
];

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      updated="1 October 2026"
      intro="SaveBlood helps people find voluntary blood donors. Because that involves health-related and location information, we keep what we collect to a minimum and tell you plainly how it is used."
      sections={sections}
    />
  );
}
