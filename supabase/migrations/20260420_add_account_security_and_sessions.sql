alter table if exists users
  add column if not exists password_updated_at timestamptz;

alter table if exists users
  add column if not exists failed_login_attempts integer not null default 0;

alter table if exists users
  add column if not exists locked_until timestamptz;

alter table if exists users
  add column if not exists last_login_at timestamptz;

create index if not exists idx_users_locked_until on users(locked_until);

create table if not exists user_sessions (
  id bigint generated always as identity primary key,
  user_id bigint not null references users(id) on delete cascade,
  token_hash text not null unique,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz
);

create index if not exists idx_user_sessions_user_id on user_sessions(user_id);
create index if not exists idx_user_sessions_expires_at on user_sessions(expires_at);
create index if not exists idx_user_sessions_revoked_at on user_sessions(revoked_at);
