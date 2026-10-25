'use client';
import { useParams } from 'next/navigation';
import { getUserById } from "../../../src/apis/users";
import { DetailBody, DetailLayout, Hero, HeroTitle, InfoList, InfoRow, Panel } from "../../../src/components/Detail";
import Icon from "../../../src/components/Icon";
import ShimmerImage from "../../../src/components/ShimmerImage";
import { Badge, buttonStyles } from "../../../src/components/ui";
import { useResource } from "../../../src/hooks/useFetch";
import { formatDate } from "../../../src/lib/format";
import UserSkeleton from "./skeleton";

function UserDetail({ user }) {
  const { name = {}, location = {}, login = {} } = user;
  const street = [location.street?.number, location.street?.name].filter(Boolean).join(' ');

  return (
    <>
      <Hero
        mediaClassName="w-auto"
        media={<ShimmerImage src={user.picture?.large} alt="" fallbackIcon="users" className="h-28 w-28 rounded-full" />}
      >
        <HeroTitle
          badges={
            <>
              <Badge tone="blue">#{user.id}</Badge>
              {user.gender && <Badge className="capitalize">{user.gender}</Badge>}
              {user.nat && <Badge icon="globe">{user.nat}</Badge>}
            </>
          }
          title={[name.title, name.first, name.last].filter(Boolean).join(' ')}
          subtitle={login.username && `@${login.username}`}
        />
        <div className="mt-5 flex flex-wrap gap-2">
          {user.email && (
            <a href={`mailto:${user.email}`} className={buttonStyles()}>
              <Icon name="mail" />
              Email
            </a>
          )}
          {user.phone && (
            <a href={`tel:${user.phone}`} className={buttonStyles()}>
              <Icon name="phone" />
              Call
            </a>
          )}
        </div>
      </Hero>

      <div className="grid gap-6 md:grid-cols-2">
        <Panel title="Contact" icon="mail">
          <InfoList>
            <InfoRow label="Email">{user.email}</InfoRow>
            <InfoRow label="Phone" mono>{user.phone}</InfoRow>
            <InfoRow label="Cell" mono>{user.cell}</InfoRow>
          </InfoList>
        </Panel>
        <Panel title="Location" icon="pin">
          <InfoList>
            <InfoRow label="Street">{street}</InfoRow>
            <InfoRow label="City">{[location.city, location.state].filter(Boolean).join(', ')}</InfoRow>
            <InfoRow label="Country">{location.country}</InfoRow>
            <InfoRow label="Postcode" mono>{location.postcode}</InfoRow>
            <InfoRow label="Timezone">
              {location.timezone && `UTC${location.timezone.offset} · ${location.timezone.description}`}
            </InfoRow>
          </InfoList>
        </Panel>
        <Panel title="Personal" icon="calendar">
          <InfoList>
            <InfoRow label="Born">{formatDate(user.dob?.date)}</InfoRow>
            <InfoRow label="Age">{user.dob?.age && `${user.dob.age} years`}</InfoRow>
            <InfoRow label="Registered">{formatDate(user.registered?.date)}</InfoRow>
            <InfoRow label="Member for">{user.registered?.age && `${user.registered.age} years`}</InfoRow>
          </InfoList>
        </Panel>
        <Panel title="Account" icon="lock">
          <InfoList>
            <InfoRow label="Username">{login.username}</InfoRow>
            <InfoRow label="UUID" mono>
              <span className="break-all">{login.uuid}</span>
            </InfoRow>
            <InfoRow label="Nationality">{user.nat}</InfoRow>
          </InfoList>
        </Panel>
      </div>
    </>
  );
}

export default function UserDetailPage() {
  const { id } = useParams();
  const resource = useResource(getUserById, id);

  return (
    <DetailLayout slug="users" label="All users">
      <DetailBody resource={resource} noun="user" skeleton={<UserSkeleton />}>
        {(user) => <UserDetail user={user} />}
      </DetailBody>
    </DetailLayout>
  );
}
