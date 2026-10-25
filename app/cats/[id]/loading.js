import { DetailLayout } from "../../../src/components/Detail";
import CatSkeleton from "./skeleton";

export default function Loading() {
  return (
    <DetailLayout slug="cats" label="All cats">
      <CatSkeleton />
    </DetailLayout>
  );
}
