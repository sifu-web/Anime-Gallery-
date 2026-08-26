import sys
p = "app/admin/[category]/page.tsx"
s = open(p, encoding="utf-8").read()
old = """  async function setCover(url: string) {
    await fetch('/api/categories/cover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: params.category, cover_url: url }),
    });
    alert('Cover photo updated!');
  }"""
new = """  async function setCover(url: string) {
    try {
      const res = await fetch('/api/categories/cover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: params.category, cover_url: url }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert('Cover photo update failed: ' + (data.error || res.statusText));
        return;
      }
      alert('Cover photo updated!');
    } catch (err) {
      alert('Cover photo update failed: network error.');
    }
  }"""
if s.count(old) != 1:
    print("NO_UNIQUE_MATCH found=" + str(s.count(old)))
    sys.exit(1)
open(p, "w", encoding="utf-8").write(s.replace(old, new))
print("PATCHED_OK")
