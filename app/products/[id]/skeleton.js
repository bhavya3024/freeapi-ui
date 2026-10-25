import { HeroSkeleton, Line, LoadingRegion, PanelSkeleton, Shimmer } from "../../../src/components/Shimmer";

// Mirrors the layout in page.js
export default function ProductSkeleton() {
  return (
    <LoadingRegion label="Loading product" className="space-y-6">
      <HeroSkeleton media="square" mediaClassName="w-full md:w-80">
        <div className="mt-5">
          <Line size="3xl" className="w-40" />
        </div>
        <div className="mt-2">
          <Line className="w-32" />
        </div>
        <div className="mt-4">
          <Line size="sm-relaxed" className="w-full" />
          <Line size="sm-relaxed" className="w-4/5" />
        </div>
        <div className="mt-5">
          <Shimmer className="h-5 w-24" />
        </div>
      </HeroSkeleton>
      <PanelSkeleton rows={6} />
    </LoadingRegion>
  );
}
