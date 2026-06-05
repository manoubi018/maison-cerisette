-- Enums
create type role as enum ('ADMIN', 'CLIENT');

create type status_commande as enum (
  'ANNULEE',
  'EN_COURS',
  'LIVREE',
  'CONFIRMER',
  'EN_ROUTE',
  'EN_EN_APPELLE',
  'APPELLE_CLIENT_1',
  'APPELLE_CLIENT_2',
  'NON_REPONDRE_CLIENT_1',
  'NON_REPONDRE_CLIENT_2'
);

create type payment_method_order as enum (
  'ENLIGNE',
  'CACHE'
);

-- Users
create table if not exists users (
  id bigint generated always as identity primary key,
  nom text not null,
  email text not null unique,
  telephone text not null,
  image text,
  created_at timestamptz not null default now(),
  statut text not null default 'active',
  is_online boolean not null default false,
  last_seen timestamptz,
  role role not null default 'CLIENT',
  password_hash text,
  password_updated_at timestamptz,
  failed_login_attempts integer not null default 0,
  locked_until timestamptz,
  last_login_at timestamptz,
  email_verified_at timestamptz
);

alter table if exists users
  add column if not exists is_online boolean not null default false;

alter table if exists users
  add column if not exists last_seen timestamptz;

alter table if exists users
  add column if not exists password_hash text;

alter table if exists users
  add column if not exists password_updated_at timestamptz;

alter table if exists users
  add column if not exists failed_login_attempts integer not null default 0;

alter table if exists users
  add column if not exists locked_until timestamptz;

alter table if exists users
  add column if not exists last_login_at timestamptz;

alter table if exists users
  add column if not exists email_verified_at timestamptz;

create index if not exists idx_users_last_seen on users(last_seen);
create index if not exists idx_users_locked_until on users(locked_until);
create index if not exists idx_users_email_verified_at on users(email_verified_at);

create table if not exists email_verification_requests (
  id bigint generated always as identity primary key,
  email text not null unique,
  token_hash text not null unique,
  verified boolean not null default false,
  expires_at timestamptz not null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_email_verification_requests_email
  on email_verification_requests(email);

create index if not exists idx_email_verification_requests_token_hash
  on email_verification_requests(token_hash);

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

create or replace view users_presence as
select
  id as user_id,
  is_online,
  last_seen,
  (last_seen is not null and last_seen >= now() - interval '90 seconds') as is_recently_active,
  (is_online and last_seen is not null and last_seen >= now() - interval '90 seconds') as is_effectively_online
from users;

-- Addresses
create table if not exists addresses (
  id bigint generated always as identity primary key,
  user_id bigint references users(id) on delete cascade,
  latitude double precision,
  longitude double precision,
  country text not null,
  city text not null,
  street text not null,
  postal_code text not null,
  is_default boolean not null default false
);

-- Categories
create table if not exists categories (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_categories_slug on categories(slug);
create index if not exists idx_categories_is_active on categories(is_active);

insert into categories (slug, name, description)
values
  ('confitures', 'Confitures & Compotes', 'Preparations artisanales aux cerises de saison.'),
  ('liqueurs', 'Liqueurs & Spiritueux', 'Liqueurs de griotte et creations de degustation.'),
  ('chocolats', 'Chocolats & Confiseries', 'Chocolats noirs, cerises confites et douceurs.'),
  ('sirops', 'Sirops & Boissons', 'Sirops naturels et boissons gourmandes.')
on conflict (slug) do nothing;

-- Products
create table if not exists products (
  id bigint generated always as identity primary key,
  nom text not null,
  description text,
  prix numeric(12, 3) not null check (prix > 0),
  stock integer not null default 0 check (stock >= 0),
  unite text not null,
  image text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  category_id bigint references categories(id) on delete restrict
);

alter table if exists products
  add column if not exists created_at timestamptz not null default now();

alter table if exists products
  add column if not exists category_id bigint references categories(id) on delete restrict;

update products
set category_id = coalesce(
  category_id,
  (
    select id
    from categories
    where slug = case
      when lower(products.nom) like '%liqueur%'
        or lower(products.nom) like '%griotte%'
      then 'liqueurs'
      when lower(products.nom) like '%chocolat%'
        or lower(products.nom) like '%truffe%'
        or lower(products.nom) like '%confiserie%'
      then 'chocolats'
      when lower(products.nom) like '%sirop%'
        or lower(products.nom) like '%boisson%'
      then 'sirops'
      else 'confitures'
    end
    limit 1
  )
);

create index if not exists idx_products_category_id on products(category_id);

-- Offers
create table if not exists offers (
  id bigint generated always as identity primary key,
  nom text not null,
  date_debut date not null,
  date_fin date not null,
  active boolean not null default true,
  nouveau_prix numeric(12, 3) not null check (nouveau_prix > 0),
  check (date_fin >= date_debut)
);

create table if not exists product_offers (
  id bigint generated always as identity primary key,
  product_id bigint not null references products(id) on delete cascade,
  offer_id bigint not null references offers(id) on delete cascade,
  unique (product_id, offer_id)
);

-- Orders
create table if not exists orders (
  id bigint generated always as identity primary key,
  user_id bigint not null references users(id) on delete restrict,
  telephone text not null,
  status status_commande not null default 'EN_COURS',
  payment_method payment_method_order not null default 'CACHE',
  payment_session_id text unique,
  created_at timestamptz not null default now(),
  total numeric(12, 3) not null check (total > 0),
  shipping_address_id bigint references addresses(id) on delete set null
);

create table if not exists order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references orders(id) on delete cascade,
  product_id bigint not null references products(id) on delete restrict,
  quantite integer not null check (quantite > 0)
);

create index if not exists idx_orders_user_id on orders(user_id);
create index if not exists idx_orders_payment_method on orders(payment_method);
create index if not exists idx_order_items_order_id on order_items(order_id);
create index if not exists idx_addresses_user_id on addresses(user_id);
create index if not exists idx_users_is_online on users(is_online);

-- Admin notifications
create table if not exists admin_notifications (
  id bigint generated always as identity primary key,
  admin_id bigint not null references users(id) on delete cascade,
  order_id bigint references orders(id) on delete cascade,
  type text not null default 'ORDER_CONFIRMED',
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_admin_notifications_admin_id
  on admin_notifications(admin_id);

create index if not exists idx_admin_notifications_order_id
  on admin_notifications(order_id);

create index if not exists idx_admin_notifications_read_at
  on admin_notifications(read_at);

create or replace function create_admin_notification_on_order_confirmed()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'CONFIRMER'
     and (tg_op = 'INSERT' or old.status is distinct from new.status)
  then
    insert into admin_notifications (admin_id, order_id, title, body)
    select
      users.id,
      new.id,
      'Nouvelle commande confirmee',
      'La commande #' || new.id || ' a ete confirmee.'
    from users
    where users.role = 'ADMIN';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_admin_notification_order_confirmed on orders;

create trigger trg_admin_notification_order_confirmed
after insert or update of status on orders
for each row
execute function create_admin_notification_on_order_confirmed();

create table if not exists admin_push_subscriptions (
  id bigint generated always as identity primary key,
  admin_id bigint not null references users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_admin_push_subscriptions_admin_id
  on admin_push_subscriptions(admin_id);

create index if not exists idx_admin_push_subscriptions_active
  on admin_push_subscriptions(active);
