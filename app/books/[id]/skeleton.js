import { ActionsSkeleton, HeroSkeleton, Line, LoadingRegion, PanelSkeleton } from "../../../src/components/Shimmer";

// Mirrors the layout in page.js
export default function BookSkeleton() {
  return (
    <LoadingRegion label="Loading book" className="space-y-6">
      <HeroSkeleton media="portrait" mediaClassName="w-36 md:w-44">
        <div className="mt-3">
          <Line className="w-48" />
        </div>
        <ActionsSkeleton count={2} />
      </HeroSkeleton>
      <div className="grid gap-6 md:grid-cols-5">
        <PanelSkeleton rows={6} className="md:col-span-2" />
        <PanelSkeleton kind="text" rows={8} className="md:col-span-3" />
      </div>
    </LoadingRegion>
  );
}
