import { DetailLayout } from "../../../src/components/Detail";
import BookSkeleton from "./skeleton";

export default function Loading() {
  return (
    <DetailLayout slug="books" label="All books">
      <BookSkeleton />
    </DetailLayout>
  );
}
