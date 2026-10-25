import { heroStyles } from "../../../src/components/Detail";
import { Line, LoadingRegion, Shimmer, StatTileSkeleton } from "../../../src/components/Shimmer";

// Mirrors the layout in page.js
export default function StockSkeleton() {
  return (
    <LoadingRegion label="Loading stock" className="space-y-6">
      <section className={heroStyles}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex gap-1.5">
              <Shimmer className="h-5 w-24" />
              <Shimmer className="h-5 w-28" />
            </div>
            <Line size="title" className="w-3/4" />
            <div className="mt-1.5">
              <Line className="w-36" />
            </div>
          </div>
          <div className="shrink-0 sm:w-56">
            <Line size="xs" className="w-20 sm:ml-auto" />
            <div className="mt-1">
              <Line size="3xl" className="w-32 sm:ml-auto" />
            </div>
          </div>
        </div>
        <div className="mt-6 border-t border-line pt-5">
          <div className="flex justify-between">
            <Line size="xs" className="w-24" />
            <Line size="xs" className="w-24" />
          </div>
          <Shimmer className="mt-2 h-2 w-full rounded-full" />
        </div>
      </section>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <StatTileSkeleton key={i} />
        ))}
      </div>
    </LoadingRegion>
  );
}
