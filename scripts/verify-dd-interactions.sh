#!/bin/bash
# KrimiScan — derin analiz görsel galerisi + lightbox etkileşim doğrulaması
cd /home/z/my-project

pkill -f "next dev" 2>/dev/null; sleep 1
setsid nohup bun run dev > /tmp/next-dev.log 2>&1 < /dev/null &
for i in $(seq 1 30); do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 --max-time 3)
  [ "$CODE" = "200" ] && break
  sleep 2
done
echo "Sunucu hazır: HTTP $CODE"

agent-browser set viewport 1440 900
agent-browser open http://localhost:3000
agent-browser wait --load networkidle --timeout 30000
sleep 2

# Kartlardaki ilk "Derin Analiz" butonuna JS ile tıkla (görselli bir kart bulun)
agent-browser eval "
(() => {
  const btns = [...document.querySelectorAll('button')].filter(b => b.textContent.includes('Derin Analiz'));
  if (!btns.length) return 'BULUNAMADI';
  btns[0].scrollIntoView({block:'center'});
  btns[0].click();
  return 'TIKLANDI: ' + btns[0].textContent.trim().slice(0,30);
})()
"
sleep 14
agent-browser screenshot scripts/verify-dd-galeri.png
cp scripts/verify-dd-galeri.png download/gorsel-kontrol/02-derin-analiz-galeri.png

# Sayfa içinde galeri bölümü var mı kontrol et
agent-browser eval "
(() => {
  const h = [...document.querySelectorAll('h3')].find(x => x.textContent.includes('Makale Görselleri'));
  if (!h) return 'GALERİ YOK';
  const imgs = h.parentElement.querySelectorAll('figure img');
  return 'GALERİ VAR — ' + imgs.length + ' görsel | ilk görsel yükledi mi: ' + (imgs[0]?.complete ?? '?') + ' | boyut: ' + (imgs[0]?.naturalWidth ?? 0) + 'x' + (imgs[0]?.naturalHeight ?? 0);
})()
"

# Lightbox: ilk galeri görseline tıkla
agent-browser eval "
(() => {
  const h = [...document.querySelectorAll('h3')].find(x => x.textContent.includes('Makale Görselleri'));
  const btn = h?.parentElement?.querySelector('figure button');
  if (!btn) return 'GALERİ BUTONU YOK';
  btn.click();
  return 'LIGHTBOX AÇILDI';
})()
"
sleep 2.5
agent-browser screenshot scripts/verify-dd-lightbox.png
cp scripts/verify-dd-lightbox.png download/gorsel-kontrol/03-lightbox.png

# Lightbox içeriği kontrol
agent-browser eval "
(() => {
  const dlg = document.querySelector('[data-slot=\"dialog-content\"], [role=\"dialog\"]');
  if (!dlg) return 'DİYALOG YOK';
  const img = dlg.querySelector('img');
  return 'DİYALOG AÇIK | görsel: ' + (img ? img.naturalWidth + 'x' + img.naturalHeight : 'yok') + ' | başlık: ' + (dlg.querySelector('h2')?.textContent ?? '').slice(0,60);
})()
"

echo "--- Konsol hataları:"
agent-browser errors | head -5

# Mobilde kart görseli
agent-browser press Escape 2>/dev/null; sleep 1
agent-browser eval "document.body.click()" >/dev/null 2>&1
agent-browser set viewport 390 844
sleep 1.5
agent-browser eval "window.scrollTo(0, 900)" >/dev/null 2>&1
sleep 1
agent-browser screenshot scripts/verify-dd-mobil.png
cp scripts/verify-dd-mobil.png download/gorsel-kontrol/04-mobil-kart.png

agent-browser close
pkill -f "next dev" 2>/dev/null
echo "=== ETKİLEŞİM DOĞRULAMASI TAMAM ==="
