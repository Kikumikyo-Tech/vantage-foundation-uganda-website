import { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    id: "what-we-mean-when-we-say-advantage",
    slug: "what-we-mean-when-we-say-advantage",
    title: 'What We Mean When We Say "Advantage"',
    category: "Foundation News",
    summary:
      "At Vantage Foundation Uganda, advantage is not about status. It is about using what we have to bring people together and help communities build better lives.",
    author: "Hillary Turyasingura",
    publishedAt: "2026-07-29",
    readingTimeMinutes: 5,
    heroImage: "/images/blog/what-we-mean-advantage-hero.webp",
    heroImageAlt:
      "Hillary Turyasingura stands on a green hillside overlooking a broad mountain valley beneath a blue, cloud-filled sky.",
    consentClassification: "verified",
    seo: {
      title: 'What We Mean When We Say "Advantage"',
      description:
        "At Vantage Foundation Uganda, advantage means using our position, resources and connections to help communities build better lives together.",
      ogImage: "/images/blog/what-we-mean-advantage-hero.webp",
    },
    published: true,
    body: `There is a word in our name that people often misread before they have spent any real time with us: *Vantage*. It can sound like it belongs to a different world — the world of first-class lounges, corner offices and cars that turn heads on the way into them. That is not the world we mean. It is worth saying plainly what we do mean, because the difference shapes everything we do.

As founding-team member Hillary Turyasingura put it:

> "Advantage isn't about driving the latest cars or flying first class. It's about how that elevated post helps your people. It's about bringing people together and making lives better."

That single sentence carries the philosophy behind Vantage Foundation Uganda, and it is worth sitting with for a moment.

## Advantage as a Vantage Point, Not a Trophy

The word *advantage* came into English through the Anglo-French *avantage*, from *avant*, meaning "before". *Vantage* shares the same root. The word's early sense described the position of being ahead — a better position from which to see and act.

Somewhere along the way, in much of modern life, that meaning became flattened. Advantage became a synonym for accumulation: more comfort, more visibility, more distance between yourself and everyone else.

We think that is a diminished version of the word. If a vantage point only exists to be looked at from below, it has lost its purpose. A watchtower that only displays the person standing in it, and never watches over anything, is not doing what it was built for. The reason to climb higher is to see farther — to notice what others cannot yet see, to spot the need before it becomes a crisis and to find the path that is not visible from the ground.

That is the advantage we are interested in. Not status. Not a better view of yourself in the mirror. A better view of the people around you, and the responsibility that view creates.

## Elevation That Points Outward

Every one of us who works with or supports this foundation occupies some kind of elevated post, whether we think of it that way or not. It might be access to an education. It might be a network, a skill, a platform, capital, time or simply the stability that lets you plan further than a week ahead. These are not things to feel guilty about. They are, quite literally, advantages — positions from which you can see and reach further than someone without them.

The question we keep returning to is not *how do we get more of these?* but *what do we do with the ones we already have?* An elevated post that only serves the person standing on it is a wasted opportunity. It is a resource sitting idle. But an elevated post used to look out for others — to spot who is struggling, to build a bridge, to pass down what you have learned or to open a door you once had to force open yourself — becomes something else entirely. It becomes leverage for a whole community, not just a single life.

This is why we value the groundwork behind visible moments of change: the mentorship session, the reading circle, the health lesson, the financial-literacy workshop and the conversation that helps a young person see a new path. These efforts may not always make headlines, but together they help communities build confidence, knowledge and lasting support.

## Bringing People Together

The second half of that founding belief matters just as much as the first: advantage is about bringing people together. Real elevation is rarely a solitary act. The most lasting change we have seen does not come from a single person deciding to help from a distance. It comes from people standing shoulder to shoulder, sharing what they know and building something none of them could have built alone.

This is a deliberate departure from a model of charity that positions the giver above and the receiver below. We do not believe in that geometry. The communities we work alongside are not projects to be managed from a height; they are partners with their own knowledge, resilience and vision for what a better life looks like. Our role is to bring resources, connections and tools into that partnership — not to hand down a plan and walk away.

That is the "together" in our approach. It is not a soft word we add for warmth. It is a structural choice about how change actually happens: with communities, not for them.

## What This Looks Like in Practice

In practical terms, this belief becomes a simple filter for every project we take on. We ask whether an initiative genuinely equips people with tools, knowledge and support they can build with long after we have stepped back — or whether it simply makes us feel useful in the moment. We ask whether we are listening as much as we are offering. We ask whether the advantage involved in any partnership is actually reaching the people it is meant to reach, or getting absorbed somewhere along the way.

It is a demanding standard, and we do not always meet it perfectly. But it is the right standard, because it keeps the word *vantage* honest. It reminds us, every time we use it, that a better position is only worth having if it helps you see — and serve — the people who do not yet share it.

## A Different Kind of Elevation

So when we talk about advantage, we are not talking about the trappings that usually come to mind. We are talking about a vantage point used the way it was meant to be used: to look outward, to notice more, to reach farther and to bring more people up alongside you rather than simply standing taller than them.

That is the belief this foundation is built on. Not status. Not visibility. Just the conviction that whatever elevated post any of us occupies is only meaningful in proportion to how much it helps the people around us build better lives — together.`,
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getBlogSlugs(): string[] {
  return getPublishedBlogPosts().map((p) => p.slug);
}

/**
 * Returns published posts, newest first. In development, unpublished
 * drafts are included too so they can be previewed.
 */
export function getPublishedBlogPosts(): BlogPost[] {
  const isDev = process.env.NODE_ENV === "development";
  return blogPosts
    .filter((p) => isDev || p.published !== false)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return getPublishedBlogPosts().filter((p) => p.category === category);
}
