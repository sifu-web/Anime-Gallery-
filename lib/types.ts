export type ImageItem = {
  id: number;
  category: string;
  title: string;
  file_url: string;
  thumbnail_url: string;
  width: number | null;
  height: number | null;
  size_bytes: number;
  download_count: number;
  created_at: string;
};
