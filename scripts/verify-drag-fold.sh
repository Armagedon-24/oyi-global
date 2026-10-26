#!/bin/bash
# Kulaktan sürükleme — ayrı eval adımlarıyla (React listener'ları yetişsin)
cd /home/z/my-project
OUT=download/profesyonel-flip-kontrol

agent-browser set viewport 1440 900
agent-browser open http://localhost:3000
agent-browser wait --load networkidle --timeout 60000
sleep 4
# Kapak -> İçindekiler -> Makale 1
agent-browser eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.getAttribute('aria-label')==='Sonraki sayfa'); b.click(); return 1; })()" > /dev/null 2>&1
sleep 1.7
agent-browser eval "(() => { const t=[...document.querySelectorAll('button')].find(x => x.className.includes('border-dotted')); t.click(); return 1; })()" > /dev/null 2>&1
sleep 1.8

echo "=== 1) pointerdown (kulak) ==="
agent-browser eval "
(() => {
  const ear = document.querySelector('.mag-ear-right');
  if (!ear) return 'kulak yok';
  const r = ear.getBoundingClientRect();
  window.__sx = r.right - 12; window.__sy = r.bottom - 12;
  const mk = (t, x, y) => new PointerEvent(t, { bubbles: true, pointerId: 7, clientX: x, clientY: y, isPrimary: true });
  ear.dispatchEvent(mk('pointerdown', window.__sx, window.__sy));
  return 'basıldı';
})()
"
sleep 0.3

echo "=== 2) pointermove (ayrı eval — listener'lar artık aktif) ==="
agent-browser eval "
(() => {
  const mk = (t, x, y) => new PointerEvent(t, { bubbles: true, pointerId: 7, clientX: x, clientY: y, isPrimary: true });
  document.dispatchEvent(mk('pointermove', window.__sx - 130, window.__sy - 30));
  return 'hareket 1';
})()
"
sleep 0.15
agent-browser eval "
(() => {
  const mk = (t, x, y) => new PointerEvent(t, { bubbles: true, pointerId: 7, clientX: x, clientY: y, isPrimary: true });
  document.dispatchEvent(mk('pointermove', window.__sx - 280, window.__sy - 65));
  return 'hareket 2';
})()
"
sleep 0.3

echo "=== 3) Sürükleme ortasında yaprak + katlama açıları ==="
agent-browser eval "(() => { const l=document.querySelector('.mag-leaf'); const f=document.querySelector('.mag-leaf .mag-fold'); if(!l) return JSON.stringify({yaprak:false}); return JSON.stringify({ yaprakTransform: (l.style.transform||'').slice(0,80), katTransform: (f?.style?.transform||'').slice(0,50), katComputed: f ? getComputedStyle(f).transform.slice(0,40) : null }); })()"
agent-browser screenshot "$OUT/07-surukle-katlama.png"

echo "=== 4) pointerup — tamamlama ==="
agent-browser eval "
(() => {
  const mk = (t, x, y) => new PointerEvent(t, { bubbles: true, pointerId: 7, clientX: x, clientY: y, isPrimary: true });
  document.dispatchEvent(mk('pointerup', window.__sx - 280, window.__sy - 65));
  return 'bırakıldı';
})()
"
sleep 1.7
agent-browser eval "(() => { const l=document.querySelector('.mag-serif.min-w-\\\\[86px\\\\]'); return JSON.stringify({ sayfaEtiketi: l ? l.textContent : null }); })()"
agent-browser errors
echo "=== BİTTİ ==="
