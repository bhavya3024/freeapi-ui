'use client';
import { getUsers } from "../../src/apis/users";
import Collection from "../../src/components/Collection";
import { ProfileCard } from "../../src/components/Cards";
import ShimmerImage from "../../src/components/ShimmerImage";
import { Badge } from "../../src/components/ui";

const fullName = (user) => `${user.name?.first ?? ''} ${user.name?.last ?? ''}`.trim() || 'Unknown user';

const columns = [
  {
    key: 'user',
    label: 'User',
    skeleton: 'avatar',
    render: (user) => (
      <div className="flex items-center gap-3">
        <ShimmerImage src={user.picture?.thumbnail} fallbackIcon="users" className="h-10 w-10 shrink-0 rounded-full" />
        <div className="min-w-0">
          <p className="max-w-56 truncate font-medium text-fg">{fullName(user)}</p>
          <p className="max-w-56 truncate text-xs text-subtle">@{user.login?.username}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'email',
    label: 'Email',
    render: (user) => <span className="block max-w-64 truncate text-muted">{user.email}</span>,
  },
  {
    key: 'phone',
    label: 'Phone',
    render: (user) => <span className="whitespace-nowrap font-mono text-[13px] text-muted">{user.phone}</span>,
  },
  {
    key: 'country',
    label: 'Country',
    skeleton: 'badge',
    render: (user) => <Badge icon="pin">{user.location?.country ?? 'Unknown'}</Badge>,
  },
  {
    key: 'age',
    label: 'Age',
    align: 'right',
    render: (user) => <span className="tabular-nums text-muted">{user.dob?.age ?? '—'}</span>,
  },
];

const renderCard = (user) => (
  <ProfileCard
    image={user.picture?.large}
    title={fullName(user)}
    subtitle={user.email}
    meta={
      <>
        {user.location?.country && <Badge icon="pin">{user.location.country}</Badge>}
        {user.dob?.age && <Badge>{user.dob.age} yrs</Badge>}
      </>
    }
  />
);

export default function UsersPage() {
  return (
    <Collection
      slug="users"
      fetchPage={getUsers}
      getKey={(user) => user.id}
      getHref={(user) => `/users/${user.id}`}
      renderCard={renderCard}
      columns={columns}
    />
  );
}
