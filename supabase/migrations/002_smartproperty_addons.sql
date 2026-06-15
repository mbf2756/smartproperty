-- ═══════════════════════════════════════════════════════════════
--  SmartProperty — Additional Tables Only
--  Run this in your existing SmartSuper Supabase project
--  Skips profiles, subscriptions (already exist from SmartSuper)
-- ═══════════════════════════════════════════════════════════════

-- ─── SAVED PROPERTIES ──────────────────────────────────────────
create table if not exists public.saved_properties (
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
  loan_type               text          default 'PI',
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

-- ─── SAVED CALCULATIONS ────────────────────────────────────────
create table if not exists public.saved_calculations (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  module      text not null,
  label       text,
  inputs      jsonb not null default '{}',
  results     jsonb not null default '{}',
  notes       text,
  created_at  timestamptz default now()
);

-- ─── CONTACT SUBMISSIONS ───────────────────────────────────────
-- Only create if it doesn't already exist from SmartSuper
create table if not exists public.contact_submissions (
  id          uuid default uuid_generate_v4() primary key,
  name        text not null,
  email       text not null,
  subject     text,
  message     text not null,
  category    text default 'general',
  created_at  timestamptz default now()
);

-- ─── UPDATE SUBSCRIPTIONS TABLE ────────────────────────────────
-- Add 'investor' and 'advisor' as valid plans alongside existing SmartSuper plans
-- The plan column is just text so no enum change needed — this is informational only

-- ─── ROW LEVEL SECURITY ────────────────────────────────────────
alter table public.saved_properties    enable row level security;
alter table public.saved_calculations  enable row level security;

-- saved_properties policies
do $$ begin
  create policy "Users manage own properties"
    on public.saved_properties for all using (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

-- saved_calculations policies
do $$ begin
  create policy "Users manage own calculations"
    on public.saved_calculations for all using (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

-- contact_submissions policy
do $$ begin
  alter table public.contact_submissions enable row level security;
  create policy "Anyone can submit contact form"
    on public.contact_submissions for insert with check (true);
exception when duplicate_object then null;
end $$;

-- ─── INDEXES ───────────────────────────────────────────────────
create index if not exists idx_saved_properties_user_id   on public.saved_properties(user_id);
create index if not exists idx_saved_calculations_user_id on public.saved_calculations(user_id);
create index if not exists idx_saved_calculations_module  on public.saved_calculations(module);
