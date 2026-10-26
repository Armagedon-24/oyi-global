#!/bin/bash
# Mobil taşma teşhisi + dergiye kaydırarak görsel doğrulama
cd /home/z/my-project

agent-browser set viewport 390 844
agent-browser open http://localhost:3000
agent-browser wait --load networkidle --timeout 60000
sleep 4

echo "=== Taşan elemanları bul ==="
agent-browser eval "
(() => {
  const vw = document.documentElement.clientWidth;
  const bad = [];
  document.querySelectorAll('*').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.right > vw + 2 || r.left < -2) {
      const cls = (el.className && typeof el.className === 'string') ? el.className.slice(0, 80) : '';
      // sadece üst düzey taşanları raporla
      const parentBad = el.parentElement && (el.parentElement.getBoundingClientRect().right > vw + 2);
      if (!parentBad && r.width > 0) {
        bad.push({ tag: el.tagName, cls, right: Math.round(r.right), w: Math.round(r.width), text: (el.textContent||'').slice(0,30) });
      }
    }
  });
  return JSON.stringify({ vw, scrollW: document.documentElement.scrollWidth, count: bad.length, top5: bad.slice(0, 6) });
})()
"

echo "=== Masaüstü: dergiye kaydır ve görselleri al ==="
agent-browser set viewport 1440 900
sleep 1
agent-browser eval "
(() => {
  const stage = document.querySelector('.mag-frame');
  if (stage) stage.scrollIntoView({ block: 'center' });
  return 'kaydırıldı';
})()
"
sleep 1.5
agent-browser screenshot download/dergi-kontrol/08-kapak-kaydirilmis.png

echo "--- Sayfa çevirme animasyonu ortası ve sonu ---"
agent-browser eval "document.querySelector('button[aria-label=\"Sonraki sayfaya çevir\"]').click(); 'ok'"
sleep 0.45
agent-browser screenshot download/dergi-kontrol/09-cevirme-animasyonu.png
sleep 1.2
agent-browser screenshot download/dergi-kontrol/10-icindekiler.png

echo "--- İçindekilerden 3. makaleye atla ---"
agent-browser eval "
(() => {
  const rows = [...document.querySelectorAll('button')].filter(b => {
    const s = b.querySelector('span.mag-serif');
    return s && /^0[2-9]$/.test(s.textContent.trim());
  });
  if (rows.length) { rows[1].click(); return 'atlandı: ' + rows[1].textContent.trim().slice(0, 50); }
  return 'bulunamadı';
})()
"
sleep 1.3
agent-browser eval "
(() => {
  const stage = document.querySelector('.mag-frame');
  if (stage) stage.scrollIntoView({ block: 'center' });
  const dc = document.querySelector('.mag-dropcap');
  return JSON.stringify({ dropcapVar: !!dc });
})()
"
sleep 0.8
agent-browser screenshot download/dergi-kontrol/11-makale-dropcap.png

echo "--- Resimsiz makaleye kadar ilerle (drop cap kontrolü) ---"
agent-browser eval "document.querySelector('button[aria-label=\"Sonraki sayfaya çevir\"]').click(); 'ok'"
sleep 1.2
agent-browser eval "document.querySelector('button[aria-label=\"Sonraki sayfaya çevir\"]').click(); 'ok'"
sleep 1.2
agent-browser eval "
(() => {
  const stage = document.querySelector('.mag-frame');
  if (stage) stage.scrollIntoView({ block: 'center' });
  return 'ok';
})()
"
sleep 0.5
agent-browser screenshot download/dergi-kontrol/12-makale-sayfasi-2.png

echo "=== Mobil: dergi görünümü ==="
agent-browser set viewport 390 844
sleep 1
agent-browser open http://localhost:3000
agent-browser wait --load networkidle --timeout 60000
sleep 4
agent-browser eval "
(() => {
  const stage = document.querySelector('.mag-frame');
  if (stage) stage.scrollIntoView({ block: 'center' });
  const vw = document.documentElement.clientWidth;
  return JSON.stringify({ scrollW: document.documentElement.scrollWidth, vw });
})()
"
sleep 1
agent-browser screenshot download/dergi-kontrol/13-mobil-kapak.png
agent-browser eval "document.querySelector('button[aria-label=\"Sonraki sayfaya çevir\"]').click(); 'ok'"
sleep 1.4
agent-browser screenshot download/dergi-kontrol/14-mobil-icindekiler.png

echo "=== TAMAM ==="
