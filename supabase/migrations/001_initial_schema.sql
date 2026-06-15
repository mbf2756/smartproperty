-- SmartProperty — Initial Database Schema
-- Run this in your Supabase SQL editor or via supabase db push

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── PROFILES ──────────────────────────────────────────────────────────────
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text,
  full_name   text,
  role        text default 'investor', -- investor | broker | buyers_agent | accountant | adviser
  avatar_url  text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'role', 'investor')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── SUBSCRIPTIONS ─────────────────────────────────────────────────────────
create table public.subscriptions (
  id                      uuid default uuid_generate_v4() primary key,
  user_id                 uuid references public.profiles(id) on delete cascade not null unique,
  stripe_customer_id      text,
  stripe_subscription_id  text,
  plan                    text not null default 'free', -- free | investor | advisor
  status                  text default 'active',        -- active | cancelled | past_due | trialing
  current_period_end      timestamptz,
  cancel_at_period_end    boolean default false,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

-- Auto-create free subscription on profile creation
create or replace function public.handle_new_profile()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.subscriptions (user_id, plan) values (new.id, 'free');
  return new;
end;
$$;

create trigger on_profile_created
  after insert on public.profiles
  for each row execute procedure public.handle_new_profile();

-- ─── SAVED PROPERTIES ──────────────────────────────────────────────────────
create table public.saved_properties (
  id                      uuid default uuid_generate_v4() primary key,
  user_id                 uuid references public.profiles(id) on delete cascade not null,
  name                    text not null default 'Untitled property',
  address                 text,
  -- Purchase
  purchase_price          numeric(12,2) not null default 0,
  deposit_pct             numeric(5,2)  default 20,
  stamp_duty              numeric(10,2) default 0,
  legal_costs             numeric(10,2) default 2500,
  other_upfront           numeric(10,2) default 0,
  -- Loan
  interest_rate           numeric(5,3)  default 6.2,
  loan_term_years         integer       default 30,
  loan_type               text          default 'PI', -- IO | PI
  -- Income
  weekly_rent             numeric(8,2)  default 0,
  vacancy_rate            numeric(4,2)  default 4,
  -- Expenses
  council_rates           numeric(8,2)  default 0,
  water_rates             numeric(8,2)  default 0,
  insurance               numeric(8,2)  default 0,
  property_management_pct numeric(4,2)  default 8,
  maintenance             numeric(8,2)  default 0,
  strata_fees             numeric(8,2)  default 0,
  other_expenses          numeric(8,2)  default 0,
  -- Tax
  taxable_income          numeric(12,2) default 120000,
  building_depreciation   numeric(10,2) default 0,
  content_depreciation    numeric(10,2) default 0,
  -- Growth
  capital_growth_rate     numeric(5,2)  default 6,
  hold_years              integer       default 10,
  created_at              timestamptz   default now(),
  updated_at              timestamptz   default now()
);

-- ─── SAVED CALCULATIONS ────────────────────────────────────────────────────
-- Stores snapshots of any tool output for history
create table public.saved_calculations (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  module      text not null, -- 'analyser' | 'cgt' | 'portfolio' | 'scenario'
  label       text,
  inputs      jsonb not null default '{}',
  results     jsonb not null default '{}',
  notes       text,
  created_at  timestamptz default now()
);

-- ─── CONTACT SUBMISSIONS ───────────────────────────────────────────────────
create table public.contact_submissions (
  id          uuid default uuid_generate_v4() primary key,
  name        text not null,
  email       text not null,
  subject     text,
  message     text not null,
  category    text default 'general',
  created_at  timestamptz default now()
);

-- ─── ROW LEVEL SECURITY ────────────────────────────────────────────────────
alter table public.profiles             enable row level security;
alter table public.subscriptions        enable row level security;
alter table public.saved_properties     enable row level security;
alter table public.saved_calculations   enable row level security;
alter table public.contact_submissions  enable row level security;

-- Profiles: users can only see and update their own
create policy "Users view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Subscriptions: users can only see their own
create policy "Users view own subscription"
  on public.subscriptions for select using (auth.uid() = user_id);

-- Saved properties: full CRUD on own records
create policy "Users manage own properties"
  on public.saved_properties for all using (auth.uid() = user_id);

-- Saved calculations: full CRUD on own records
create policy "Users manage own calculations"
  on public.saved_calculations for all using (auth.uid() = user_id);

-- Contact: anyone can insert (no auth required), only service role can read
create policy "Anyone can submit contact form"
  on public.contact_submissions for insert with check (true);

-- ─── INDEXES ───────────────────────────────────────────────────────────────
create index idx_saved_properties_user_id    on public.saved_properties(user_id);
create index idx_saved_calculations_user_id  on public.saved_calculations(user_id);
create index idx_saved_calculations_module   on public.saved_calculations(module);
create index idx_subscriptions_stripe_sub_id on public.subscriptions(stripe_subscription_id);
