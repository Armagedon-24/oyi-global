#!/bin/bash
# Köşeden esneyerek çevirme + Tam Oku doğrulaması
# Not: pkill YASAK — kalıcı sunucu ayakta kalmalı (Task 6 dersi)
cd /home/z/my-project
OUT=download/kose-cevirme-kontrol
mkdir -p $OUT

echo "===== 1) Masaüstü kapak + kulak görselli ====="
agent-browser set viewport 1440 900
agent-browser open http://localhost:3000
agent-browser wait --load networkidle --timeout 60000
sleep 4
agent-browser eval "(() => { const s = document.querySelector('.mag-frame'); if (s) s.scrollIntoView({block:'center'}); return 'ok'; })()"
sleep 1.5
agent-browser screenshot $OUT/01-kapak-kulaklar.png

echo "=== Kulak var mı? ==="
agent-browser eval "
(() => {
  const r = document.querySelector('.mag-ear-right');
  const l = document.querySelector('.mag-ear-left');
  const f = document.querySelector('.mag-frame');
  const rr = r ? r.getBoundingClientRect() : null;
  const fr = f ? f.getBoundingClientRect() : null;
  return JSON.stringify({
    rightEar: !!r, leftEar: !!l,
    earRect: rr ? { right: Math.round(rr.right), bottom: Math.round(rr.bottom), w: Math.round(rr.width) } : null,
    frameRect: fr ? { right: Math.round(fr.right), bottom: Math.round(fr.bottom), w: Math.round(fr.width) } : null,
    cursor: r ? getComputedStyle(r).cursor : null
  });
})()
"

echo "===== 2) Tuşla çevirme — esnek animasyon ortası ====="
agent-browser eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.getAttribute('aria-label')==='Sonraki sayfa'); b.click(); return 'click'; })()"
sleep 0.55
agent-browser eval "
(() => {
  const leaf = document.querySelector('.mag-leaf');
  if (!leaf) return JSON.stringify({ leaf: false });
  const cs = getComputedStyle(leaf);
  return JSON.stringify({ leaf: true, anim: cs.animationName, dur: cs.animationDuration, tf: cs.transform.slice(0, 60) });
})()
"
agent-browser screenshot $OUT/02-cevirme-ortasi-esneme.png
sleep 1.4
agent-browser eval "(() => { const t=document.querySelector('[class*=mag-serif]'); const label=document.querySelector('.mag-serif.min-w-\\\\[86px\\\\]'); return JSON.stringify({ label: label ? label.textContent : null }); })()"
agent-browser screenshot $OUT/03-cevirme-sonrasi.png

echo "===== 3) Sağ alt köşeden SÜRÜKLEYEREK çevirme (commit) ====="
agent-browser eval "
(() => {
  const ear = document.querySelector('.mag-ear-right');
  const r = ear.getBoundingClientRect();
  const x0 = r.right - 12, y0 = r.bottom - 12;
  const ev = (type, x, y) => new PointerEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerId: 9, pointerType: 'mouse', isPrimary: true });
  ear.dispatchEvent(ev('pointerdown', x0, y0));
  window.dispatchEvent(ev('pointermove', x0 - 150, y0 - 40));
  window.dispatchEvent(ev('pointermove', x0 - 300, y0 - 60));
  return 'drag başladı';
})()
"
sleep 0.5
agent-browser eval "
(() => {
  const leaf = document.querySelector('.mag-leaf');
  const frame = document.querySelector('.mag-frame');
  return JSON.stringify({
    dragging: frame ? frame.className.includes('mag-dragging') : false,
    leafTf: leaf ? getComputedStyle(leaf).transform.slice(0, 70) : null
  });
})()
"
agent-browser screenshot $OUT/04-surukleme-ortasi.png
agent-browser eval "
(() => {
  const ear = document.querySelector('.mag-ear-right');
  const r = ear.getBoundingClientRect();
  const ev = (type, x, y) => new PointerEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerId: 9, pointerType: 'mouse', isPrimary: true });
  window.dispatchEvent(ev('pointerup', r.right - 320, r.bottom - 60));
  return 'bırakıldı (commit bekleniyor)';
})()
"
sleep 1.2
agent-browser eval "
(() => {
  const label = document.querySelector('.mag-serif.min-w-\\\\[86px\\\\]');
  const dragLeaf = document.querySelector('.mag-leaf');
  return JSON.stringify({ label: label ? label.textContent : null, dragKaldi: !!dragLeaf });
})()
"
agent-browser screenshot $OUT/05-surukleme-commit-sonrasi.png

echo "===== 4) Kısa sürükleme — yaylanarak geri dönme ====="
agent-browser eval "
(() => {
  const ear = document.querySelector('.mag-ear-right');
  if (!ear) return 'kulak yok';
  const r = ear.getBoundingClientRect();
  const x0 = r.right - 12, y0 = r.bottom - 12;
  const ev = (type, x, y) => new PointerEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerId: 11, pointerType: 'mouse', isPrimary: true });
  ear.dispatchEvent(ev('pointerdown', x0, y0));
  window.dispatchEvent(ev('pointermove', x0 - 60, y0 - 15));
  window.dispatchEvent(ev('pointerup', x0 - 60, y0 - 15));
  return 'kısa sürükleme + bırakma';
})()
"
sleep 1.2
agent-browser eval "
(() => {
  const label = document.querySelector('.mag-serif.min-w-\\\\[86px\\\\]');
  return JSON.stringify({ label: label ? label.textContent : null, geriDondu: !document.querySelector('.mag-leaf') });
})()
"

echo "===== 5) TAM OKU — büyük okuma penceresi ====="
agent-browser eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim().startsWith('Tam Oku')); if(!b) return 'buton yok'; b.click(); return 'tıklandı'; })()"
sleep 1.5
agent-browser eval "
(() => {
  const dlg = document.querySelector('[data-slot=dialog-content]');
  if (!dlg) return JSON.stringify({ open: false });
  const r = dlg.getBoundingClientRect();
  const arts = dlg.querySelectorAll('article p');
  let len = 0; arts.forEach(p => len += (p.textContent || '').length);
  const figs = dlg.querySelectorAll('figure');
  return JSON.stringify({
    open: true, w: Math.round(r.width), h: Math.round(r.height),
    vw: window.innerWidth, paragraf: arts.length, metinUzunluk: len, gorsel: figs.length,
    butonlar: [...dlg.querySelectorAll('button, a')].map(b => (b.textContent || '').trim()).filter(Boolean).slice(0, 8)
  });
})()
"
agent-browser screenshot $OUT/06-tam-oku-buyuk.png

echo "=== Tam Oku lightbox ==="
agent-browser eval "
(() => {
  const fig = document.querySelector('[data-slot=dialog-content] figure');
  if (!fig) return 'görsel yok';
  fig.click();
  return 'lightbox açılıyor';
})()
"
sleep 1.2
agent-browser eval "
(() => {
  const lb = document.querySelector('.z-\\[70\\]') || [...document.querySelectorAll('div')].find(d => d.className && String(d.className).includes('bg-black/90'));
  return JSON.stringify({ lightbox: !!lb });
})()
"
agent-browser screenshot $OUT/07-tam-oku-lightbox.png
agent-browser eval "(() => { const lb=[...document.querySelectorAll('div')].find(d=>d.className&&String(d.className).includes('bg-black/90')); if(lb) lb.click(); return 'kapandı'; })()"
sleep 0.6
agent-browser eval "(() => { const btn=document.querySelector('[aria-label=Okuma\\\\ penceresini\\\\ kapat]'); if(!btn) return 'kapat yok'; btn.click(); return 'kapatıldı'; })()"
sleep 1
agent-browser eval "(() => JSON.stringify({ dialogKaldi: !!document.querySelector('[data-slot=dialog-content]') }))()"

echo "===== 6) Sol kulak geri çevirme ====="
agent-browser eval "
(() => {
  const ear = document.querySelector('.mag-ear-left');
  if (!ear) return 'sol kulak yok';
  const r = ear.getBoundingClientRect();
  const x0 = r.left + 12, y0 = r.bottom - 12;
  const ev = (type, x, y) => new PointerEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerId: 13, pointerType: 'mouse', isPrimary: true });
  ear.dispatchEvent(ev('pointerdown', x0, y0));
  window.dispatchEvent(ev('pointermove', x0 + 320, y0 - 50));
  window.dispatchEvent(ev('pointerup', x0 + 320, y0 - 50));
  return 'soldan sürüklendi';
})()
"
sleep 1.2
agent-browser eval "
(() => {
  const label = document.querySelector('.mag-serif.min-w-\\\\[86px\\\\]');
  return JSON.stringify({ label: label ? label.textContent : null });
})()
"
agent-browser screenshot $OUT/08-geri-cevirme.png

echo "===== 7) Mobil 390px ====="
agent-browser set viewport 390 844
agent-browser open http://localhost:3000
agent-browser wait --load networkidle --timeout 60000
sleep 4
agent-browser eval "
(() => {
  const vw = document.documentElement.clientWidth;
  return JSON.stringify({ vw, scrollW: document.documentElement.scrollWidth, earW: (() => { const e = document.querySelector('.mag-ear-right'); return e ? Math.round(e.getBoundingClientRect().width) : 0; })() });
})()
"
agent-browser screenshot $OUT/09-mobil-kapak.png
agent-browser eval "
(() => {
  const ear = document.querySelector('.mag-ear-right');
  const r = ear.getBoundingClientRect();
  const x0 = r.right - 10, y0 = r.bottom - 10;
  const ev = (type, x, y) => new PointerEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerId: 21, pointerType: 'touch', isPrimary: true });
  ear.dispatchEvent(ev('pointerdown', x0, y0));
  window.dispatchEvent(ev('pointermove', x0 - 130, y0 - 30));
  window.dispatchEvent(ev('pointerup', x0 - 130, y0 - 30));
  return 'mobil sürükleme';
})()
"
sleep 1.3
agent-browser eval "(() => { const label=document.querySelector('.mag-serif.min-w-\\\\[86px\\\\]'); return JSON.stringify({ label: label ? label.textContent : null, scrollW: document.documentElement.scrollWidth }); })()"
agent-browser screenshot $OUT/10-mobil-cevirme-sonrasi.png

echo "===== 8) Konsol hataları ====="
agent-browser errors

echo "BİTTİ — çıktılar: $OUT"
