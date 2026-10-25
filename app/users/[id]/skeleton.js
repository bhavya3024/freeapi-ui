import { ActionsSkeleton, HeroSkeleton, LoadingRegion, PanelSkeleton } from "../../../src/components/Shimmer";

// Mirrors the layout in page.js
export default function UserSkeleton() {
  return (
    <LoadingRegion label="Loading user" className="space-y-6">
      <HeroSkeleton media="avatar" mediaClassName="w-auto" badges={3}>
        <ActionsSkeleton count={2} />
      </HeroSkeleton>
      <div className="grid gap-6 md:grid-cols-2">
        <PanelSkeleton rows={3} />
        <PanelSkeleton rows={5} />
        <PanelSkeleton rows={4} />
        <PanelSkeleton rows={3} />
      </div>
    </LoadingRegion>
  );
}
