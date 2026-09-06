-- Printfinity: tabla de pedidos y seguridad a nivel de fila.
-- Pega este script completo en Supabase -> SQL Editor -> New query -> Run.

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  client text not null,
  piece text not null,
  due_date date,
  price numeric not null default 0,
  paid boolean not null default false,
  link text,
  notes text,
  status text not null default 'Pendiente' check (status in ('Pendiente', 'En proceso', 'Entregado')),
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "Los usuarios ven solo sus pedidos"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Los usuarios crean solo sus pedidos"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Los usuarios actualizan solo sus pedidos"
  on public.orders for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Los usuarios eliminan solo sus pedidos"
  on public.orders for delete
  using (auth.uid() = user_id);

create index if not exists orders_user_id_created_at_idx
  on public.orders (user_id, created_at desc);
