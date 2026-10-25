import { DetailLayout } from "../../../src/components/Detail";
import UserSkeleton from "./skeleton";

export default function Loading() {
  return (
    <DetailLayout slug="users" label="All users">
      <UserSkeleton />
    </DetailLayout>
  );
}
