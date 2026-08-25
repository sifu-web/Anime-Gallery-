'use client';

import { useRef, useState } from 'react';
import type { Category } from '@/lib/categories';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 15 * 1024 * 1024;

export default function UploadDropzone({ category, onUploaded }: { category: Category; onUploaded: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || !fileList.length) return;
    const files = Array.from(fileList);

    const rejected: string[] = [];
    const accepted: File[] = [];
    for (const f of files) {
      if (!ALLOWED.includes(f.type)) {
        rejected.push(`${f.name}: unsupported type`);
      } else if (f.size > MAX_BYTES) {
        rejected.push(`${f.name}: larger than 15MB`);
      } else {
        accepted.push(f);
      }
    }

    if (!accepted.length) {
      setErrors(rejected);
      return;
    }

    setUploading(true);
    setErrors(rejected);

    const form = new FormData();
    form.set('category', category);
    accepted.forEach((f) => form.append('files', f));

    try {
      const res = await fetch('/api/images', { method: 'POST', body: form });
      const data = await res.json();
      if (data.errors?.length) {
        setErrors((prev) => [...prev, ...data.errors.map((e: any) => `${e.fileName}: ${e.reason}`)]);
      }
      if (data.uploaded?.length) onUploaded();
    } catch {
      setErrors((prev) => [...prev, 'Upload request failed. Check your connection.']);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center transition-colors ${
          dragging ? 'border-sakura bg-sakura/5' : 'border-edge hover:border-white/30'
        }`}
      >
        <p className="font-medium text-ink">{uploading ? 'Uploading…' : '+ Upload images'}</p>
        <p className="mt-1 text-sm text-muted">Drag & drop, or click to choose files · JPG/PNG/WebP · up to 15MB each</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {errors.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm text-red-400">
          {errors.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
