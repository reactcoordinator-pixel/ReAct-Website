-- =============================================================================
-- ReAct — Supabase schema
-- Run this in the Supabase SQL Editor (Project → SQL Editor → New query).
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE where possible.
-- =============================================================================

create extension if not exists pgcrypto;   -- gen_random_uuid(), crypt(), gen_salt()
create extension if not exists citext;      -- case-insensitive email/username

-- ---------------------------------------------------------------------------
-- CMS: one JSONB row per page/section document (mirrors old Firestore cms/*).
-- ids: homepage, navigation, contact, privacy, socialLinks, ...
-- ---------------------------------------------------------------------------
create table if not exists public.cms (
  id          text primary key,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Blogs / News
-- ---------------------------------------------------------------------------
create table if not exists public.blogs (
  id          uuid primary key default gen_random_uuid(),
  title       text not null default '',
  subtitle    text not null default '',
  about       text not null default '',        -- rich HTML body
  category    text not null default '',
  image_url   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists blogs_created_at_idx on public.blogs (created_at desc);

-- ---------------------------------------------------------------------------
-- Projects (old "service" collection)
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null default '',
  subtitle    text not null default '',
  description text not null default '',
  about       text not null default '',        -- rich HTML body
  image_url   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists projects_created_at_idx on public.projects (created_at desc);

-- ---------------------------------------------------------------------------
-- Newsletter signups (old "emails" collection)
-- ---------------------------------------------------------------------------
create table if not exists public.newsletter_emails (
  id          uuid primary key default gen_random_uuid(),
  email       citext not null unique,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Contact form messages (old "inbox" collection)
-- ---------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id            uuid primary key default gen_random_uuid(),
  name          text,
  email         text,
  phone         text,
  organization  text,
  message       text,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Admins (simple table, bcrypt-hashed passwords via pgcrypto)
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  id            uuid primary key default gen_random_uuid(),
  name          text not null default '',
  email         citext unique,
  username      citext not null unique,
  job_role      text not null default '',
  password_hash text not null,
  created_at    timestamptz not null default now()
);

-- updated_at auto-touch trigger for cms/blogs/projects
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists cms_touch on public.cms;
create trigger cms_touch before update on public.cms
  for each row execute function public.touch_updated_at();
drop trigger if exists blogs_touch on public.blogs;
create trigger blogs_touch before update on public.blogs
  for each row execute function public.touch_updated_at();
drop trigger if exists projects_touch on public.projects;
create trigger projects_touch before update on public.projects
  for each row execute function public.touch_updated_at();

-- Admin auth + password hashing is handled server-side in Node (bcryptjs)
-- via Next.js API routes, so no SQL auth functions are needed here.

-- =============================================================================
-- Row Level Security
--   * Public site reads cms/blogs/projects with the anon key.
--   * Anyone can subscribe to the newsletter / send a contact message.
--   * All writes to content + reading admins/messages go through the
--     service_role key (server-side only), which bypasses RLS.
-- =============================================================================
alter table public.cms               enable row level security;
alter table public.blogs             enable row level security;
alter table public.projects          enable row level security;
alter table public.newsletter_emails enable row level security;
alter table public.contact_messages  enable row level security;
alter table public.admins            enable row level security;

-- public read
drop policy if exists "public read cms"      on public.cms;
create policy "public read cms"      on public.cms      for select using (true);
drop policy if exists "public read blogs"    on public.blogs;
create policy "public read blogs"    on public.blogs    for select using (true);
drop policy if exists "public read projects" on public.projects;
create policy "public read projects" on public.projects for select using (true);

-- public insert (newsletter + contact)
drop policy if exists "public subscribe" on public.newsletter_emails;
create policy "public subscribe" on public.newsletter_emails for insert with check (true);
drop policy if exists "public contact"   on public.contact_messages;
create policy "public contact"   on public.contact_messages for insert with check (true);

-- admins table + contact_messages reads have NO anon policy → service_role only.

-- =============================================================================
-- Storage bucket for uploaded images (blog/project/hero/logo).
-- The bucket is created via the storage API in the setup script (public read).
-- Uploads/deletes go through the service_role key from our API routes, which
-- bypasses storage RLS, so no storage.objects policy is required here.
-- =============================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Reload the PostgREST schema cache so the API sees these tables immediately.
notify pgrst, 'reload schema';
