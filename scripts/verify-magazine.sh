#!/bin/bash
# KrimiScan — E-Dergi tasarımı doğrulama
# ÖNEMLİ: Sunucu çalışıyorsa DOKUNMAZ, kapalıysa setsid ile başlatır, ASLA kapatmaz!
cd /home/z/my-project
mkdir -p download/dergi-kontrol

CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 --max-time 5)
if [ "$CODE" != "200" ]; then
  echo "Sunucu kapalı — setsid ile başlatılıyor..."
  setsid -f nohup bun run dev > /tmp/next-dev.log 2>&1 < /dev/null
  for i in $(seq 1 40); do
    CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 --max-time 3)
    [ "$CODE" = "200" ] && break
    sleep 2
  done
fi
echo "Sunucu durumu: HTTP $CODE"

echo "=== [1] Ana sayfa derleme kontrolü ==="
C=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/" --max-time 120)
echo "/ -> HTTP $C"

echo "=== [2] Dergi DOM kontrolü (masaüstü) ==="
agent-browser set viewport 1440 900
agent-browser open http://localhost:3000
agent-browser wait --load networkidle --timeout 60000
sleep 4

agent-browser eval "
(() => {
  const stage = document.querySelector('.mag-frame');
  const masthead = [...document.querySelectorAll('h1')].some(h => h.textContent.includes('KRİMİSCAN'));
  const coverImg = [...document.querySelectorAll('.mag-page img')].filter(i => i.naturalWidth > 0).length;
  const tocBtn = document.body.innerText.includes('İçindekiler') || document.body.innerText.includes('Kapak');
  const progress = document.body.innerText.match(/1\s*\/\s*\d+/);
  return JSON.stringify({
    stageVar: !!stage,
    stageW: stage ? Math.round(stage.getBoundingClientRect().width) : 0,
    stageH: stage ? Math.round(stage.getBoundingClientRect().height) : 0,
    masthead, coverImg, tocBtn,
    progress: progress ? progress[0] : null
  });
})()
"

agent-browser screenshot download/dergi-kontrol/01-kapak.png
echo "--- Kapak ekran görüntüsü alındı"

echo "=== [3] Sayfa çevirme testi (sonraki → İçindekiler) ==="
agent-browser eval "
(() => {
  const btn = document.querySelector('button[aria-label=\"Sonraki sayfaya çevir\"]');
  if (!btn) return 'buton yok';
  btn.click();
  return 'tıklandı';
})()
"
sleep 0.4
# Animasyon ortasında yaprak var mı?
agent-browser eval "
(() => {
  const leaf = document.querySelector('.mag-leaf');
  return JSON.stringify({ leafActive: !!leaf, cls: leaf ? leaf.className : null });
})()
"
agent-browser screenshot download/dergi-kontrol/02-cevirme-ortasi.png
sleep 1.2
agent-browser eval "
(() => {
  const leaf = document.querySelector('.mag-leaf');
  const toc = document.body.innerText.includes('İçindekiler');
  const prog = document.body.innerText.match(/2\s*\/\s*\d+/);
  return JSON.stringify({ leafGone: !leaf, toc, progress: prog ? prog[0] : null });
})()
"
agent-browser screenshot download/dergi-kontrol/03-icindekiler.png

echo "=== [4] Klavye ile gezinme (→ makale sayfası) ==="
agent-browser eval "document.activeElement && document.activeElement.blur(); 'ok'"
agent-browser press ArrowRight
sleep 1.4
agent-browser eval "
(() => {
  const hasDeep = document.body.innerText.includes('Derin Analiz');
  const kicker = document.querySelector('.mag-kicker') ? document.querySelector('.mag-kicker').textContent : null;
  const dropcap = !!document.querySelector('.mag-dropcap');
  const cols = document.querySelector('.mag-cols');
  const colCount = cols ? getComputedStyle(cols).columnCount : null;
  return JSON.stringify({ hasDeep, kicker, dropcap, colCount });
})()
"
agent-browser screenshot download/dergi-kontrol/04-makale-sayfasi.png

echo "=== [5] İçindekilerden sayfa atlama ==="
agent-browser eval "
(() => {
  const rows = [...document.querySelectorAll('button')].filter(b => b.querySelector('.mag-serif.font-bold') && b.textContent.includes('02'));
  const tocRows = [...document.querySelectorAll('button')].filter(b => {
    const spans = b.querySelectorAll('span');
    return [...spans].some(s => /^0[2-9]$|^1[0-2]$/.test(s.textContent.trim()) && s.classList.contains('mag-serif'));
  });
  if (tocRows.length > 2) { tocRows[2].click(); return 'içindekiler satırına tıklandı: ' + tocRows[2].textContent.slice(0, 60); }
  return 'satır bulunamadı — şu an içindekiler sayfasında değiliz';
})()
"
sleep 1.3
agent-browser eval "
(() => {
  const leaf = document.querySelector('.mag-leaf');
  const stars = document.querySelectorAll('.mag-cols').length;
  return JSON.stringify({ flipDone: !leaf, articleCols: stars });
})()
"

echo "=== [6] Yer imi + derin analiz butonu tıklaması ==="
agent-browser eval "
(() => {
  const bm = [...document.querySelectorAll('button')].find(b => b.getAttribute('title') === 'Yer imine ekle');
  if (bm) { bm.click(); return 'yer imi tıklandı'; }
  const bm2 = [...document.querySelectorAll('button')].find(b => (b.getAttribute('title')||'').includes('Yer iminden'));
  return bm2 ? 'zaten işaretli' : 'yer imi butonu yok';
})()
"
sleep 1
agent-browser eval "
(() => {
  const dd = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Derin Analiz'));
  if (dd) { dd.click(); return 'derin analiz tıklandı'; }
  return 'derin analiz butonu yok';
})()
"
sleep 4
agent-browser eval "
(() => {
  const sheet = document.querySelector('[role=\"dialog\"]');
  return JSON.stringify({ deepDiveOpen: !!sheet, galleryImgs: sheet ? sheet.querySelectorAll('img').length : 0 });
})()
"
agent-browser screenshot download/dergi-kontrol/05-derin-analiz-dergi-ustunde.png
# Kapat
agent-browser press Escape
sleep 1

echo "=== [7] Konsol hataları ==="
agent-browser errors | head -8

echo "=== [8] Mobil kontrol (390px) ==="
agent-browser set viewport 390 844
agent-browser open http://localhost:3000
agent-browser wait --load networkidle --timeout 60000
sleep 4
agent-browser eval "
(() => {
  const stage = document.querySelector('.mag-frame');
  const r = stage ? stage.getBoundingClientRect() : null;
  const overflowX = document.documentElement.scrollWidth > document.documentElement.clientWidth + 2;
  return JSON.stringify({
    stageVar: !!stage,
    w: r ? Math.round(r.width) : 0,
    h: r ? Math.round(r.height) : 0,
    yatayTasma: overflowX
  });
})()
"
agent-browser screenshot download/dergi-kontrol/06-mobil-kapak.png
agent-browser eval "
(() => {
  const btn = document.querySelector('button[aria-label=\"Sonraki sayfaya çevir\"]');
  if (btn) btn.click();
  return 'mobil çevirme tıklandı';
})()
"
sleep 1.4
agent-browser screenshot download/dergi-kontrol/07-mobil-icindekiler.png
agent-browser errors | head -5

echo "=== TAMAM ==="
