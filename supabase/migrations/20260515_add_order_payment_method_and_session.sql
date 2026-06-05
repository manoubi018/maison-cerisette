do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'payment_method_order'
  ) then
    create type payment_method_order as enum ('ENLIGNE', 'CACHE');
  end if;
end $$;

alter table if exists orders
  add column if not exists payment_method payment_method_order not null default 'CACHE';

alter table if exists orders
  add column if not exists payment_session_id text;

create unique index if not exists idx_orders_payment_session_id
  on orders(payment_session_id)
  where payment_session_id is not null;

create index if not exists idx_orders_payment_method
  on orders(payment_method);
