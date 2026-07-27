import { Play } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { ImageWithOverlay } from "@/components/shared/ImageWithOverlay";

/**
 * Polished placeholder for the homepage video, per the brief's fallback:
 * a poster image with a "Watch Our Story" label, no autoplay, no fake
 * interactive affordance until a real video file exists. Once a video is
 * supplied, replace this with a real <video> element (captions, keyboard
 * controls, lazy loading, no autoplay-with-sound).
 */
export function VideoStory() {
  return (
    <section className="bg-white pb-16 md:pb-24">
      <Container>
        <ImageWithOverlay
          src="/images/photos/photo-014.webp"
          alt="Community members and volunteers gathered together in Uganda"
          overlay="dark"
          preset="hero"
          containerClassName="aspect-[21/9] w-full rounded-2xl"
        >
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-white">
            <span
              className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur"
              aria-hidden="true"
            >
              <Play className="h-7 w-7 translate-x-0.5" fill="currentColor" />
            </span>
            <div>
              <p className="text-lg font-semibold">Watch Our Story</p>
              <p className="mt-1 text-sm text-white/80">Video coming soon</p>
            </div>
          </div>
        </ImageWithOverlay>
      </Container>
    </section>
  );
}
