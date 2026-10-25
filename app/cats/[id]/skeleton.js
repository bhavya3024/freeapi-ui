import { ActionsSkeleton, ChipsSkeleton, HeroSkeleton, Line, LoadingRegion, PanelSkeleton } from "../../../src/components/Shimmer";

// Mirrors the layout in page.js
export default function CatSkeleton() {
  return (
    <LoadingRegion label="Loading breed" className="space-y-6">
      <HeroSkeleton media="landscape" mediaClassName="w-full md:w-80">
        <div className="mt-4">
          <Line size="sm-relaxed" className="w-full" />
          <Line size="sm-relaxed" className="w-3/4" />
        </div>
        <ChipsSkeleton count={5} />
        <ActionsSkeleton count={2} />
      </HeroSkeleton>
      <div className="grid items-start gap-6 lg:grid-cols-3">
        <PanelSkeleton kind="bars" rows={7} />
        <PanelSkeleton kind="bars" rows={5} />
        <PanelSkeleton rows={7} />
      </div>
    </LoadingRegion>
  );
}
