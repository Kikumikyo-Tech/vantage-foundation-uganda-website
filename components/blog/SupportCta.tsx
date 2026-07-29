import { Button } from "@/components/ui/Button";
import { ArticleContainer } from "./ArticleContainer";

export function SupportCta() {
  return (
    <ArticleContainer width="wide" className="mt-16 md:mt-[72px]">
      <aside
        className="mx-auto max-w-[960px] rounded-2xl bg-primary-light px-6 py-7 sm:px-8 sm:py-8 md:flex md:items-center md:justify-between md:gap-10 lg:px-10"
        aria-labelledby="support-this-work"
      >
        <div className="max-w-2xl">
          <h2
            id="support-this-work"
            className="text-2xl font-bold tracking-tight text-foreground"
          >
            Support this work
          </h2>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Your contribution helps us expand our health, education and
            humanitarian programmes.
          </p>
        </div>
        <Button href="/donate" className="mt-5 shrink-0 md:mt-0">
          Donate now
        </Button>
      </aside>
    </ArticleContainer>
  );
}
