const fs = require('fs');
const path = require('path');
const fail = m => { console.error('❌ ' + m); process.exit(1); };
const relOk = p => typeof p === 'string' && p && !path.isAbsolute(p) && !p.split(/[\\/]/).includes('..');
for (const f of ['content/profile.json', 'content/posts.json']) {
  try { JSON.parse(fs.readFileSync(f, 'utf8')); }
  catch (e) { fail(`${f} sai cú pháp JSON: ${e.message}`); }
}
const profile = JSON.parse(fs.readFileSync('content/profile.json', 'utf8'));
if (!profile.name) fail('content/profile.json thiếu trường "name"');
if (profile.photo && !relOk(profile.photo)) fail('profile.photo đường dẫn không hợp lệ (phải tương đối, không "..")');
const posts = JSON.parse(fs.readFileSync('content/posts.json', 'utf8'));
if (!Array.isArray(posts)) fail('content/posts.json phải là mảng');
const req = ['id', 'type', 'title'];
const types = ['project', 'video', 'guide', 'tool'];
const ids = new Set();
posts.forEach((p, i) => {
  const n = `Bài #${i + 1} (${p.id || '?'})`;
  req.forEach(k => { if (!p[k]) fail(`${n} thiếu trường "${k}"`); });
  if (!types.includes(p.type)) fail(`${n}: type "${p.type}" không hợp lệ`);
  if (ids.has(p.id)) fail(`Trùng id "${p.id}"`);
  ids.add(p.id);
  if (p.module !== undefined && !Array.isArray(p.module)) fail(`${n}: "module" phải là mảng`);
  for (const k of ['thumbnail', 'url']) {
    if (p[k] && !relOk(p[k])) fail(`${n}: ${k} đường dẫn không hợp lệ (tương đối, không "..", không "/...")`);
  }
  for (const st of p.steps || []) {
    if (!st.image) continue;
    if (!relOk(st.image)) fail(`${n}: steps[].image "${st.image}" đường dẫn không hợp lệ`);
    if (!fs.existsSync(st.image)) fail(`${n}: ảnh "${st.image}" không tồn tại trên đĩa`);
  }
});
console.log(`✅ ${posts.length} bài hợp lệ`);
