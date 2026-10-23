// Fallback articles for the home page and /blog/[slug]. General guidance only;
// always confirm eligibility details with your local blood bank.
export const defaultBlogs = [
  {
    _id: "default-blog-1",
    slug: "who-can-donate-blood-eligibility-guide",
    title: "Who can donate blood? A plain-language eligibility guide",
    category: "Donor Guide",
    author: "SaveBlood Editorial Team",
    readTime: 4,
    coverImage: "/images/hospital.svg",
    publishedAt: "2026-10-04T08:00:00.000Z",
    tags: ["eligibility", "first-time donor", "health"],
    excerpt: "Age, weight, haemoglobin and recent illness all decide whether you can give blood today. Here is what blood centres check, and what to do if you are turned away.",
    content: [
      "Most healthy adults can donate blood, but every blood centre follows a short checklist to protect both the donor and the patient. Commonly, donors are between 18 and 60 years old, weigh at least 50 kg and have a haemoglobin level high enough to avoid becoming anaemic after donating. The exact limits differ between centres, so treat these numbers as a general guide and confirm with your local blood bank.",
      "Before you donate, a trained staff member will check your pulse, blood pressure and temperature, and take a small finger-prick sample to measure haemoglobin. You will also answer a confidential health questionnaire. Answer honestly: it exists to keep the blood supply safe, and nobody will judge an answer that means you cannot donate today.",
      "You may be asked to wait if you have had a fever or infection recently, are taking certain medicines, have had a tattoo, piercing or dental surgery, or are pregnant or breastfeeding. Long-term conditions are reviewed case by case by the medical officer.",
      "If you are deferred, it is rarely permanent. Come back after the waiting period, eat a balanced meal, drink plenty of water and sleep well the night before. You can also register on SaveBlood so that nearby patients can reach you once you are eligible again.",
    ],
  },
  {
    _id: "default-blog-2",
    slug: "what-to-eat-and-drink-after-donating-blood",
    title: "What to eat and drink after donating blood",
    category: "Aftercare",
    author: "SaveBlood Editorial Team",
    readTime: 3,
    coverImage: "/images/bag.svg",
    publishedAt: "2026-09-27T08:00:00.000Z",
    tags: ["aftercare", "recovery", "nutrition"],
    excerpt: "A little rest, plenty of fluids and an iron-rich meal help you feel normal again quickly. A short checklist for the first day after you donate.",
    content: [
      "Your body replaces the fluid you donate within a day or so, and rebuilds red blood cells over the following weeks. A few simple habits make the recovery more comfortable.",
      "Rest for about fifteen minutes at the donation centre and have the drink and snack that is offered. Over the rest of the day, drink more water than usual and avoid alcohol. Keep the dressing on for a few hours.",
      "At your next meals, include foods that contain iron, such as lentils, leafy vegetables, eggs, fish or meat, and add a source of vitamin C, for example a squeeze of lemon or a piece of fruit, which helps the body absorb iron.",
      "Skip heavy lifting and strenuous exercise for the rest of the day. If you feel dizzy, sit or lie down with your feet raised and tell someone nearby. If symptoms continue or worry you, contact the blood centre or a doctor.",
    ],
  },
  {
    _id: "default-blog-3",
    slug: "how-to-organise-a-blood-drive",
    title: "How to organise a blood drive in your neighbourhood",
    category: "Community",
    author: "SaveBlood Editorial Team",
    readTime: 5,
    coverImage: "/images/community.svg",
    publishedAt: "2026-09-18T08:00:00.000Z",
    tags: ["volunteering", "blood drive", "community"],
    excerpt: "A step-by-step checklist for clubs and local committees: partner with a licensed blood bank, choose a venue, spread the word and look after donors on the day.",
    content: [
      "Start by partnering with a licensed blood bank or a Red Crescent unit. They bring the trained staff, equipment and screening, and are responsible for safe collection and storage. Agree a date at least three weeks ahead so their mobile team can plan.",
      "Choose a venue with shade, ventilation, running water and a quiet area for donors to rest, such as a school hall or community centre. Avoid places with many stairs.",
      "Promote the drive through posters, local messaging groups and the notice boards of nearby schools, mosques and offices. Ask people to register in advance, and remind them to eat and drink well before they come.",
      "On the day, assign volunteers to registration, queue management and refreshments. Thank every donor, including those who are deferred, and afterwards share how many units were collected. People give again when they see the impact.",
    ],
  },
];

export const getDefaultBlog = (slug) => {
  const post = defaultBlogs.find((item) => item.slug === slug);
  if (!post) return null;
  return { ...post, related: defaultBlogs.filter((item) => item.slug !== slug).slice(0, 2) };
};
