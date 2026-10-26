#!/bin/bash
# Köşe sürükleme + Tam Oku genişlik — odaklı yeniden doğrulama
cd /home/z/my-project
OUT=download/kose-cevirme-kontrol
mkdir -p $OUT

agent-browser set viewport 1440 900
agent-browser open http://localhost:3000
agent-browser wait --load networkidle --timeout 60000
sleep 4
agent-browser eval "(() => { const s = document.querySelector('.mag-frame'); if (s) s.scrollIntoView({block:'center'}); return 'ok'; })()"
sleep 1

echo "===== A) Sağ köşeden sürükleme — adım adım (ayrı görevler) ====="
agent-browser eval "
(() => {
  const ear = document.querySelector('.mag-ear-right');
  if (!ear) return 'kulak yok';
  const r = ear.getBoundingClientRect();
  const ev = (type, x, y) => new PointerEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerId: 9, pointerType: 'mouse', isPrimary: true });
  ear.dispatchEvent(ev('pointerdown', r.right - 12, r.bottom - 12));
  return 'pointerdown gönderildi';
})()
"
sleep 0.4
agent-browser eval "
(() => {
  const ear = document.querySelector('.mag-ear-right');
  const r = ear ? ear.getBoundingClientRect() : null;
  if (!r) return 'kulak gitti (drag aktif)';
  const x0 = r.right - 12, y0 = r.bottom - 12;
  const ev = (type, x, y) => new PointerEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerId: 9, pointerType: 'mouse', isPrimary: true });
  window.dispatchEvent(ev('pointermove', x0 - 160, y0 - 40));
  return 'pointermove 1';
})()
"
sleep 0.3
agent-browser eval "
(() => {
  const ev = (type, x, y) => new PointerEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerId: 9, pointerType: 'mouse', isPrimary: true });
  window.dispatchEvent(ev('pointermove', 715 - 330, 858 - 70));
  const leaf = document.querySelector('.mag-leaf');
  const frame = document.querySelector('.mag-frame');
  return JSON.stringify({
    dragging: frame ? frame.className.includes('mag-dragging') : false,
    leafTf: leaf ? getComputedStyle(leaf).transform.slice(0, 80) : null
  });
})()
"
sleep 0.2
agent-browser screenshot $OUT/11-surukleme-esneme.png
agent-browser eval "
(() => {
  const ev = (type, x, y) => new PointerEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerId: 9, pointerType: 'mouse', isPrimary: true });
  window.dispatchEvent(ev('pointerup', 715 - 330, 858 - 70));
  return 'pointerup (commit)';
})()
"
sleep 1.2
agent-browser eval "
(() => {
  const label = document.querySelector('.mag-serif.min-w-\\\\[86px\\\\]');
  return JSON.stringify({ label: label ? label.textContent : null, leafKaldi: !!document.querySelector('.mag-leaf') });
})()
"

echo "===== B) Sol köşeden geri sürükleme ====="
agent-browser eval "
(() => {
  const ear = document.querySelector('.mag-ear-left');
  if (!ear) return 'sol kulak yok';
  const r = ear.getBoundingClientRect();
  const ev = (type, x, y) => new PointerEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerId: 10, pointerType: 'mouse', isPrimary: true });
  ear.dispatchEvent(ev('pointerdown', r.left + 12, r.bottom - 12));
  return 'sol pointerdown';
})()
"
sleep 0.4
agent-browser eval "
(() => {
  const ev = (type, x, y) => new PointerEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerId: 10, pointerType: 'mouse', isPrimary: true });
  window.dispatchEvent(ev('pointermove', 405 + 340, 858 - 55));
  const leaf = document.querySelector('.mag-leaf');
  return JSON.stringify({ leafTf: leaf ? getComputedStyle(leaf).transform.slice(0, 80) : null });
})()
"
sleep 0.2
agent-browser screenshot $OUT/12-soldan-geri-esneme.png
agent-browser eval "
(() => {
  const ev = (type, x, y) => new PointerEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerId: 10, pointerType: 'mouse', isPrimary: true });
  window.dispatchEvent(ev('pointerup', 405 + 340, 858 - 55));
  return 'sol pointerup';
})()
"
sleep 1.2
agent-browser eval "
(() => {
  const label = document.querySelector('.mag-serif.min-w-\\\\[86px\\\\]');
  return JSON.stringify({ label: label ? label.textContent : null });
})()
"

echo "===== C) Yaylanarak geri dönme (kısa sürükleme, bırakma) ====="
agent-browser eval "
(() => {
  const ear = document.querySelector('.mag-ear-right');
  if (!ear) return 'kulak yok';
  const r = ear.getBoundingClientRect();
  const ev = (type, x, y) => new PointerEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerId: 11, pointerType: 'mouse', isPrimary: true });
  ear.dispatchEvent(ev('pointerdown', r.right - 12, r.bottom - 12));
  return 'pointerdown';
})()
"
sleep 0.4
agent-browser eval "
(() => {
  const ev = (type, x, y) => new PointerEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerId: 11, pointerType: 'mouse', isPrimary: true });
  window.dispatchEvent(ev('pointermove', 1035 - 12 - 90, 858 - 20));
  return 'kısa move';
})()
"
sleep 0.2
agent-browser eval "
(() => {
  const ev = (type, x, y) => new PointerEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerId: 11, pointerType: 'mouse', isPrimary: true });
  window.dispatchEvent(ev('pointerup', 1035 - 12 - 90, 858 - 20));
  return 'bırakıldı (geri yaylanmalı)';
})()
"
sleep 1.3
agent-browser eval "
(() => {
  const label = document.querySelector('.mag-serif.min-w-\\\\[86px\\\\]');
  return JSON.stringify({ label: label ? label.textContent : null, sayfaDegismedi: !document.querySelector('.mag-leaf') });
})()
"

echo "===== D) TAM OKU genişlik (makale sayfasına gidip) ====="
agent-browser eval "(() => { const e=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('01')&&x.textContent.includes('PARMAK')); if(e){e.click();return 'içindekilerden atlandı';} return 'bulunamadı'; })()"
sleep 1.6
agent-browser eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim().startsWith('Tam Oku')); if(!b) return 'buton yok'; b.click(); return 'Tam Oku tıklandı'; })()"
sleep 1.6
agent-browser eval "
(() => {
  const dlg = document.querySelector('[data-slot=dialog-content]');
  if (!dlg) return JSON.stringify({ open: false });
  const r = dlg.getBoundingClientRect();
  const arts = dlg.querySelectorAll('article p');
  let len = 0; arts.forEach(p => len += (p.textContent || '').length);
  return JSON.stringify({
    open: true, w: Math.round(r.width), h: Math.round(r.height), vw: window.innerWidth,
    paragraf: arts.length, tamMetinUzunluk: len,
    figurler: dlg.querySelectorAll('figure').length
  });
})()
"
agent-browser screenshot $OUT/13-tam-oku-genis.png
echo "=== Lightbox ==="
agent-browser eval "(() => { const f=document.querySelector('[data-slot=dialog-content] figure'); if(!f) return 'figür yok'; f.click(); return 'açılıyor'; })()"
sleep 1.2
agent-browser eval "
(() => {
  const lb = [...document.querySelectorAll('div')].find(d => d.className && String(d.className).includes('bg-black/90'));
  return JSON.stringify({ lightboxAcik: !!lb });
})()
"
agent-browser screenshot $OUT/14-tam-oku-lightbox.png
agent-browser eval "(() => { const b=document.querySelector('[aria-label=\"Büyütücüyı kapat\"]'); if(b){b.click();return 'lb kapandı';} return 'lb buton yok'; })()"
sleep 0.5
agent-browser eval "(() => { const b=document.querySelector('[aria-label=\"Okuma penceresini kapat\"]'); if(b){b.click();return 'pencere kapandı';} return 'buton yok'; })()"
sleep 0.8
agent-browser eval "(() => JSON.stringify({ dialogKaldi: !!document.querySelector('[data-slot=dialog-content]'), label: (document.querySelector('.mag-serif.min-w-\\\\[86px\\\\]')||{}).textContent }))()"

echo "===== E) Konsol hataları ====="
agent-browser errors
echo "BİTTİ"
