alter table if exists users
  add column if not exists is_online boolean not null default false;

alter table if exists users
  add column if not exists last_seen timestamptz;

create index if not exists idx_users_is_online on users(is_online);
create index if not exists idx_users_last_seen on users(last_seen);

create or replace view users_presence as
select
  id as user_id,
  is_online,
  last_seen,
  (last_seen is not null and last_seen >= now() - interval '90 seconds') as is_recently_active,
  (is_online and last_seen is not null and last_seen >= now() - interval '90 seconds') as is_effectively_online
from users;
