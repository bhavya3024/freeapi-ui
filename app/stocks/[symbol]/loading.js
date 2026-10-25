import { DetailLayout } from "../../../src/components/Detail";
import StockSkeleton from "./skeleton";

export default function Loading() {
  return (
    <DetailLayout slug="stocks" label="All stocks">
      <StockSkeleton />
    </DetailLayout>
  );
}
