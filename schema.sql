-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create links table
create table public.links (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  destination_url text not null,
  smartlink_url text not null,
  clicks integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table public.links enable row level security;

-- Create policies
-- 1. Allow public read access to all links
create policy "Allow public read access"
  on public.links
  for select
  to public
  using (true);

-- 2. Allow authenticated users to insert, update, delete
create policy "Allow authenticated CRUD"
  on public.links
  for all
  to authenticated
  using (true);

-- Create simple function to increment clicks securely
create or replace function increment_click(link_id uuid)
returns void as $$
begin
  update public.links
  set clicks = clicks + 1
  where id = link_id;
end;
$$ language plpgsql security definer;
