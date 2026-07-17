import { Story } from "@/types";

export const stories: Story[] = [
  {
    id: "what-are-we-without-our-dreams",
    slug: "what-are-we-without-our-dreams",
    title: "What are we without our dreams?",
    excerpt:
      "A reflection from one of the young people who has journeyed with Vantage Foundation on what it means to hold onto hope.",
    author: "Kauthar Wangi",
    role: "Youth participant",
    date: "2023",
    location: "Uganda",
    category: "Youth voice",
    heroImage: "/images/placeholder-story.jpg",
    relatedProjectSlugs: ["savegirl-uganda", "advantage-book-club"],
    body: `"What are we without our dreams?" This question sits at the heart of Vantage Foundation's work. For many young people in underserved communities, dreams are often buried under the weight of poverty, lack of opportunity and limited support systems.

Vantage Foundation has become a space where those dreams are named, nurtured and given a path forward. Through mentorship, reading, health education and community, young people are reminded that their aspirations matter — and that they are not alone in pursuing them.`,
  },
  {
    id: "the-meaning-of-advantage",
    slug: "the-meaning-of-advantage",
    title: "The meaning of advantage",
    excerpt:
      "Hillary Turyasingura on why true advantage is not about luxury, but about lifting others up.",
    author: "Hillary Turyasingura",
    role: "Founding team",
    date: "2023",
    location: "Uganda",
    category: "Leadership reflection",
    heroImage: "/images/placeholder-story.jpg",
    relatedProjectSlugs: ["savegirl-uganda"],
    body: `"Advantage isn't about driving the latest cars or flying first class. It's about how that elevated post helps your people. It's about bringing people together and making lives better."

This belief shapes how Vantage Foundation approaches every project. We are not chasing status or visibility. We are working to make sure that the communities we serve have the tools, knowledge and support they need to build better lives — together.`,
  },
  {
    id: "a-journey-from-pads-to-mentorship",
    slug: "a-journey-from-pads-to-mentorship",
    title: "A journey from pads to mentorship",
    excerpt:
      "How SaveGirl Uganda grew from a crowdfunding campaign for sanitary pads into a holistic mentorship movement.",
    author: "Vantage Foundation team",
    role: "Programme team",
    date: "2023",
    location: "Rural Uganda",
    category: "Programme update",
    heroImage: "/images/placeholder-story.jpg",
    relatedProjectSlugs: ["savegirl-uganda", "menstrual-cups-project"],
    body: `SaveGirl Uganda began as a simple idea: crowdfund money to buy sanitary pads for young women in rural areas who could not afford them. The response was immediate and generous. But as we met the young women we were serving, we realised that pads alone would not remove the barriers they faced.

Period poverty is connected to low self-esteem, limited financial literacy, lack of mentorship and few safe spaces. So we restructured SaveGirl into a mentorship programme. Today it combines menstrual health education, life-skills training, financial literacy and ongoing support — and has reached about 500 young women and men across rural Uganda.`,
  },
  {
    id: "women-day-bushenyi-2023",
    slug: "women-day-bushenyi-2023",
    title: "International Women's Day 2023 in Bushenyi",
    excerpt:
      "A day of conversation, celebration and empowerment at Basajjabalaba High School.",
    author: "Vantage Foundation team",
    role: "Programme team",
    date: "March 2023",
    location: "Basajjabalaba High School, Bushenyi",
    category: "Event highlight",
    heroImage: "/images/placeholder-story.jpg",
    relatedProjectSlugs: ["savegirl-uganda", "mental-health-financial-literacy-workshops"],
    body: `On International Women's Day 2023, the Vantage Foundation team joined students and staff at Basajjabalaba High School in Bushenyi for a day of conversation, celebration and empowerment.

The event focused on confidence, education and the power of young women to shape their own futures. It was a reminder that progress happens when communities come together to support girls.`,
  },
  {
    id: "youth-conference-bushenyi",
    slug: "youth-conference-bushenyi",
    title: "Youth Conference on Financial Literacy and Career Education",
    excerpt:
      "Bringing financial literacy, habit building and career guidance to young people in Bushenyi.",
    author: "Vantage Foundation team",
    role: "Programme team",
    date: "2023",
    location: "Bushenyi, Uganda",
    category: "Event highlight",
    heroImage: "/images/placeholder-story.jpg",
    relatedProjectSlugs: ["advantage-book-club", "mental-health-financial-literacy-workshops"],
    body: `Our youth conference in Bushenyi brought together young people for sessions on financial literacy, habit building and career education. The day was designed to fill gaps left by the formal school system, giving participants practical skills they can use immediately.

From budgeting to goal-setting, the conversations were energetic and honest. Young people left with tools, contacts and a renewed sense of direction.`,
  },
  {
    id: "mental-health-high-school-kampala",
    slug: "mental-health-high-school-kampala",
    title: "Mental Health Mentorship in Kampala",
    excerpt:
      "A high-school mentorship session that opened up safe conversations about mental health.",
    author: "Vantage Foundation team",
    role: "Programme team",
    date: "2023",
    location: "Kampala, Uganda",
    category: "Event highlight",
    heroImage: "/images/placeholder-story.jpg",
    relatedProjectSlugs: ["mental-health-financial-literacy-workshops"],
    body: `At a high school in Kampala, our team led a mentorship session focused on mental health. The conversation covered stress, coping skills, seeking help and supporting friends.

For many students, it was the first time mental health had been discussed openly in school. The session created a safe space for questions and reflection, and several students signed up for follow-up activities.`,
  },
];

export function getStoryBySlug(slug: string): Story | undefined {
  return stories.find((s) => s.slug === slug);
}

export function getStorySlugs(): string[] {
  return stories.map((s) => s.slug);
}
