import Link from "next/link";
import { Story } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ImageOrPlaceholder } from "./ImageOrPlaceholder";

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden">
        <ImageOrPlaceholder
          src={story.heroImage}
          alt={story.title}
          fill
          containerClassName="h-full w-full"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Badge variant="accent">{story.category}</Badge>
        <h3 className="mt-3 text-lg font-semibold leading-snug">
          <Link href={`/stories/${story.slug}`} className="hover:text-primary">
            {story.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {story.excerpt}
        </p>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>{story.author}</span>
          <span>{story.date}</span>
        </div>
        <Link
          href={`/stories/${story.slug}`}
          className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
        >
          Read the story
        </Link>
      </div>
    </Card>
  );
}
