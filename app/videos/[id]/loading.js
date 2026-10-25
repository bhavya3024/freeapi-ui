import { DetailLayout } from "../../../src/components/Detail";
import VideoSkeleton from "./skeleton";

export default function Loading() {
  return (
    <DetailLayout slug="videos" label="All videos">
      <VideoSkeleton />
    </DetailLayout>
  );
}
