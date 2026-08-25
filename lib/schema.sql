-- Run this once against your Neon database before first use.
-- psql "$DATABASE_URL" -f lib/schema.sql

CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS images (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('profile-pic', 'anime-wallpaper', 'natural-wallpaper')),
  imagekit_file_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  file_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  width INT,
  height INT,
  size_bytes BIGINT NOT NULL DEFAULT 0,
  download_count INT NOT NULL DEFAULT 0,
  view_count INT NOT NULL DEFAULT 0,
  uploaded_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_images_category_created
  ON images (category, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_images_imagekit_file_id
  ON images (imagekit_file_id);

CREATE TABLE IF NOT EXISTS category_covers (
  category TEXT PRIMARY KEY,
  cover_url TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
