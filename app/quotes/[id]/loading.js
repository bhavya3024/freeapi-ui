import { DetailLayout } from "../../../src/components/Detail";
import { TextFeatureSkeleton } from "../../../src/components/Shimmer";

export default function Loading() {
  return (
    <DetailLayout slug="quotes" label="All quotes" width="max-w-3xl">
      <TextFeatureSkeleton label="Loading quote" />
    </DetailLayout>
  );
}
