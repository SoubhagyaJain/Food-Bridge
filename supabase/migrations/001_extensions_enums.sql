-- FoodBridge v1: extensions and enum types
-- Run first in Supabase SQL Editor

create extension if not exists postgis;

do $$ begin
  create type user_role as enum ('donor', 'ngo', 'volunteer');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type donation_status as enum (
    'available', 'claimed', 'in_transit', 'delivered', 'expired', 'cancelled'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type claim_status as enum ('pending', 'approved', 'rejected', 'fulfilled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type pickup_status as enum ('open', 'assigned', 'in_transit', 'delivered', 'cancelled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type food_unit as enum ('kg', 'lbs', 'meals', 'boxes', 'liters', 'items');
exception when duplicate_object then null;
end $$;