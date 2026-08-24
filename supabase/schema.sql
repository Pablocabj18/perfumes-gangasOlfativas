create extension if not exists pgcrypto;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  phone text unique not null,
  name text,
  email text,
  birthday date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text not null check (discount_type in ('percentage','fixed')),
  discount_value numeric not null check (discount_value > 0),
  min_purchase numeric not null default 0,
  active boolean not null default true,
  expires_at timestamptz,
  max_uses integer,
  uses integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.loyalty_accounts (
  customer_phone text primary key references public.customers(phone) on update cascade on delete cascade,
  points integer not null default 0 check (points >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.loyalty_movements (
  id uuid primary key default gen_random_uuid(),
  customer_phone text not null references public.customers(phone) on update cascade on delete cascade,
  points integer not null,
  reason text not null,
  order_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.saved_carts (
  customer_phone text primary key references public.customers(phone) on update cascade on delete cascade,
  items jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_phone text not null,
  customer_name text,
  items jsonb not null,
  subtotal numeric not null,
  coupon_code text,
  discount numeric not null default 0,
  status text not null default 'pending' check (status in ('pending','confirmed','paid','cancelled','completed')),
  created_at timestamptz not null default now()
);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_phone text not null,
  referred_phone text not null,
  status text not null default 'pending' check (status in ('pending','approved','rewarded')),
  created_at timestamptz not null default now(),
  unique(referrer_phone, referred_phone),
  check(referrer_phone <> referred_phone)
);

create table if not exists public.restock_alerts (
  id uuid primary key default gen_random_uuid(),
  customer_phone text not null,
  perfume_id text not null,
  perfume_name text not null,
  notified_at timestamptz,
  created_at timestamptz not null default now(),
  unique(customer_phone, perfume_id)
);

insert into public.coupons (code, discount_type, discount_value, min_purchase)
values ('GANGAS5', 'percentage', 5, 0)
on conflict (code) do nothing;

alter table public.customers enable row level security;
alter table public.coupons enable row level security;
alter table public.loyalty_accounts enable row level security;
alter table public.loyalty_movements enable row level security;
alter table public.saved_carts enable row level security;
alter table public.orders enable row level security;
alter table public.referrals enable row level security;
alter table public.restock_alerts enable row level security;

create policy "read active coupons" on public.coupons for select to anon using (active = true);
create policy "create customers" on public.customers for insert to anon with check (true);
create policy "update customers" on public.customers for update to anon using (true) with check (true);
create policy "save carts" on public.saved_carts for insert to anon with check (true);
create policy "update carts" on public.saved_carts for update to anon using (true) with check (true);
create policy "create orders" on public.orders for insert to anon with check (true);
create policy "create referrals" on public.referrals for insert to anon with check (true);
create policy "create alerts" on public.restock_alerts for insert to anon with check (true);

create or replace function public.reward_completed_order()
returns trigger language plpgsql security definer as $$
begin
  if new.status = 'completed' and old.status <> 'completed' then
    insert into public.loyalty_accounts(customer_phone, points)
    values (new.customer_phone, floor((new.subtotal - new.discount) / 1000))
    on conflict (customer_phone) do update set points = public.loyalty_accounts.points + excluded.points, updated_at = now();
    insert into public.loyalty_movements(customer_phone, points, reason, order_id)
    values (new.customer_phone, floor((new.subtotal - new.discount) / 1000), 'Compra completada', new.id);
  end if;
  return new;
end $$;

drop trigger if exists order_loyalty_reward on public.orders;
create trigger order_loyalty_reward after update on public.orders for each row execute function public.reward_completed_order();
