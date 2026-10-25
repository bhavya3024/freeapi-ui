import { panelStyles } from "../../../src/components/Detail";
import { Line, LoadingRegion, PanelSkeleton, Shimmer } from "../../../src/components/Shimmer";

// Mirrors the layout in page.js
export default function VideoSkeleton() {
  return (
    <LoadingRegion label="Loading video" className="space-y-6">
      <Shimmer className="aspect-video w-full rounded-2xl" />
      <div>
        <Line size="heading" className="w-4/5" />
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          {['w-24', 'w-20', 'w-28', 'w-24'].map((w, i) => (
            <Line key={i} className={w} />
          ))}
        </div>
      </div>
      <div className={`${panelStyles} flex items-center gap-3 p-4`}>
        <Shimmer className="h-11 w-11 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1">
          <Line className="w-40" />
          <Line size="xs" className="w-28" />
        </div>
        <Shimmer className="h-9 w-36 rounded-lg" />
      </div>
      <PanelSkeleton kind="text" rows={6} />
    </LoadingRegion>
  );
}
