-- Create the applicants table
create table applicants (
  id uuid default gen_random_uuid() primary key,
  application_id text not null unique,
  name text not null,
  phone text, -- Added for WhatsApp notifications
  service_type text not null,
  status text default 'Pending',
  paid boolean default false, -- Kept for backward compatibility, but moving to amount_paid/due
  amount_paid decimal default 0,
  amount_due decimal default 0,
  documents text[] default array[]::text[], -- Keeping for backward compatibility or simple list
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table applicants enable row level security;

-- Policy: Allow unrestricted read access (for Status Check)
-- In a real app, you might want to restrict this to only ID lookups
create policy "Allow public read access"
  on applicants for select
  using (true);

-- Policy: Allow authenticated users (Admin) to do everything
create policy "Allow admin full access"
  on applicants for all
  using (auth.role() = 'authenticated');

-- DOCUMENTS TABLE
create table documents (
  id uuid default gen_random_uuid() primary key,
  applicant_id uuid references applicants(id) on delete cascade not null,
  file_path text not null,
  document_type text not null,
  metadata jsonb default '{}'::jsonb,
  uploaded_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS on documents
alter table documents enable row level security;

-- Policy: Allow authenticated users (Admin) to do everything on documents
create policy "Allow admin full access to documents"
  on documents for all
  using (auth.role() = 'authenticated');

-- STORAGE BUCKET POLICIES (These need to be run in SQL Editor)
-- Create the bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('applicant_documents', 'applicant_documents', false)
on conflict (id) do nothing;

-- Policy: Allow authenticated users (Admin) to upload files
create policy "Allow admin upload"
  on storage.objects for insert
  with check ( bucket_id = 'applicant_documents' and auth.role() = 'authenticated' );

-- Policy: Allow authenticated users (Admin) to read files
create policy "Allow admin read"
  on storage.objects for select
  using ( bucket_id = 'applicant_documents' and auth.role() = 'authenticated' );

-- Whatsapp Sessions Table (for RemoteAuth)
create table whatsapp_sessions (
  session_id text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Policy: Allow authenticated users (Admin) or Service Role to manage sessions
alter table whatsapp_sessions enable row level security;

create policy "Allow full access to whatsapp_sessions"
  on whatsapp_sessions for all
  using (true)
  with check (true);
