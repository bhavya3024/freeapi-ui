import { DetailLayout } from "../../../src/components/Detail";
import ProductSkeleton from "./skeleton";

export default function Loading() {
  return (
    <DetailLayout slug="products" label="All products">
      <ProductSkeleton />
    </DetailLayout>
  );
}
