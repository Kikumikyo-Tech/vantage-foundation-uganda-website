import { ImageOrPlaceholder } from "@/components/shared/ImageOrPlaceholder";

interface ArticleHeroProps {
  src?: string;
  alt: string;
}

export function ArticleHero({ src, alt }: ArticleHeroProps) {
  return (
    <div
      className="relative mt-8 h-[250px] overflow-hidden rounded-[18px] bg-surface-strong min-[375px]:h-[270px] min-[430px]:h-[290px] sm:aspect-[16/9] sm:h-auto sm:rounded-[22px] lg:max-h-[585px]"
      data-testid="article-hero"
    >
      <ImageOrPlaceholder
        src={src}
        alt={alt}
        fill
        priority
        sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) calc(100vw - 48px), 1040px"
        objectPosition="center center"
        containerClassName="h-full w-full"
      />
    </div>
  );
}
