import { DetailLayout } from "../../../src/components/Detail";
import DogSkeleton from "./skeleton";

export default function Loading() {
  return (
    <DetailLayout slug="dogs" label="All dogs">
      <DogSkeleton />
    </DetailLayout>
  );
}
