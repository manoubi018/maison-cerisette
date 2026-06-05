alter table if exists orders
  add column if not exists telephone text;

update orders
set telephone = users.telephone
from users
where orders.user_id = users.id
  and orders.telephone is null;

alter table if exists orders
  alter column telephone set not null;
