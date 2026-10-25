import { DetailLayout } from "../../../src/components/Detail";
import { TextFeatureSkeleton } from "../../../src/components/Shimmer";

export default function Loading() {
  return (
    <DetailLayout slug="jokes" label="All jokes" width="max-w-3xl">
      <TextFeatureSkeleton label="Loading joke" />
    </DetailLayout>
  );
}
