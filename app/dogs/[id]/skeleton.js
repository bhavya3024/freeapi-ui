import { ChipsSkeleton, HeroSkeleton, LoadingRegion, PanelSkeleton } from "../../../src/components/Shimmer";

// Mirrors the layout in page.js
export default function DogSkeleton() {
  return (
    <LoadingRegion label="Loading breed" className="space-y-6">
      <HeroSkeleton media="landscape" mediaClassName="w-full md:w-80">
        <ChipsSkeleton count={5} />
      </HeroSkeleton>
      <div className="grid items-start gap-6 md:grid-cols-2">
        <PanelSkeleton rows={4} />
        <PanelSkeleton rows={4} />
      </div>
    </LoadingRegion>
  );
}
