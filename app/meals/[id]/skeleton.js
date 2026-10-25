import { ActionsSkeleton, ChipsSkeleton, HeroSkeleton, LoadingRegion, PanelSkeleton } from "../../../src/components/Shimmer";

// Mirrors the layout in page.js
export default function MealSkeleton() {
  return (
    <LoadingRegion label="Loading recipe" className="space-y-6">
      <HeroSkeleton media="square" mediaClassName="w-full md:w-72">
        <ChipsSkeleton count={3} />
        <ActionsSkeleton count={2} />
      </HeroSkeleton>
      <div className="grid items-start gap-6 lg:grid-cols-3">
        <PanelSkeleton rows={9} />
        <PanelSkeleton kind="text" rows={12} className="lg:col-span-2" />
      </div>
    </LoadingRegion>
  );
}
