-- Create tables without any fancy stuff
create table users (
  id uuid references auth.users primary key,
  full_name text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table events (
  id serial primary key,
  title text not null,
  description text,
  date date not null,
  time time not null,
  location text not null,
  type text default 'public',
  tier text default 'silver',
  price decimal not null,
  capacity integer not null,
  logistics_phone text,
  user_id uuid references users(id),
  views integer default 0,
  shares integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table event_images (
  id serial primary key,
  event_id integer references events(id) on delete cascade,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table tickets (
  id serial primary key,
  event_id integer references events(id),
  user_id uuid references users(id),
  code text,
  price decimal not null,
  purchase_date timestamp with time zone default timezone('utc'::text, now())
);

-- Create a simple trigger for new users
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

-- Create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 