import { DetailLayout } from "../../../src/components/Detail";
import MealSkeleton from "./skeleton";

export default function Loading() {
  return (
    <DetailLayout slug="meals" label="All meals">
      <MealSkeleton />
    </DetailLayout>
  );
}
