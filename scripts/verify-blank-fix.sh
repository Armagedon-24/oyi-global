#!/bin/bash
# KrimiScan — boş ekran düzeltmesi sonrası tam doğrulama
# ÖNEMLİ: Bu script sunucuyu ASLA kapatmaz/öldürmez!
cd /home/z/my-project

CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 --max-time 5)
if [ "$CODE" != "200" ]; then
  echo "Sunucu kapalı — setsid ile başlatılıyor..."
  setsid -f nohup bun run dev > /tmp/next-dev.log 2>&1 < /dev/null
  for i in $(seq 1 30); do
    CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 --max-time 3)
    [ "$CODE" = "200" ] && break
    sleep 2
  done
fi
echo "Sunucu durumu: HTTP $CODE"

echo "=== [1] API sağlığı ==="
curl -s "http://localhost:3000/api/stats" --max-time 30 | python3 -c "
import json,sys
d=json.load(sys.stdin)
print(f\"stats OK — toplam: {d['total']}, yenilik: {d['newTech']}\")"
curl -s "http://localhost:3000/api/findings?limit=20" --max-time 30 | python3 -c "
import json,sys
d=json.load(sys.stdin)
fs=d['findings']
withImg=[f for f in fs if f.get('images') not in ('[]','none') and f.get('images')]
print(f\"findings OK — {len(fs)} kayıt, {len(withImg)} görselli\")"

echo "=== [2] Tüm sayfalar HTTP kontrolü ==="
for p in "/" "/analytics" "/report" "/assistant" "/briefing"; do
  C=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$p" --max-time 90)
  echo "$p -> HTTP $C"
done

echo "=== [3] Tarayıcı doğrulaması (boş ekran kontrolü) ==="
agent-browser set viewport 1440 900
agent-browser open http://localhost:3000
agent-browser wait --load networkidle --timeout 30000
sleep 3
agent-browser screenshot scripts/verify-blankfix-home.png
cp scripts/verify-blankfix-home.png download/gorsel-kontrol/05-bos-ekran-cozuldu-ana-sayfa.png

# Sayfada gerçek içerik var mı? (boş ekran değil)
agent-browser eval "
(() => {
  const cards = document.querySelectorAll('h3').length;
  const imgs = [...document.querySelectorAll('img')].filter(i => i.naturalWidth > 0).length;
  const bodyLen = document.body.innerText.length;
  return 'DOM kontrolü — başlık sayısı: ' + cards + ' | yüklenen görsel: ' + imgs + ' | metin uzunluğu: ' + bodyLen;
})()
"

echo "--- Konsol hataları:"
agent-browser errors | head -5

echo "=== [4] Derin analiz sayfası hızlı smoke testi ==="
agent-browser eval "
(() => {
  const btns = [...document.querySelectorAll('button')].filter(b => b.textContent.includes('Derin Analiz'));
  if (!btns.length) return 'buton yok';
  btns[0].scrollIntoView({block:'center'});
  btns[0].click();
  return 'derin analiz açıldı';
})()
"
sleep 8
agent-browser eval "
(() => {
  const sheet = document.querySelector('[data-slot=\"sheet-content\"], [role=\"dialog\"]');
  if (!sheet) return 'PANEL AÇILMADI';
  const gallery = [...document.querySelectorAll('h3')].find(x => x.textContent.includes('Makale Görselleri'));
  const imgs = sheet.querySelectorAll('img');
  return 'panel açık | görsel sayısı: ' + imgs.length + ' | galeri: ' + (gallery ? 'VAR' : 'yok');
})()
"
agent-browser screenshot scripts/verify-blankfix-deepdive.png
agent-browser errors | head -3
agent-browser close

echo "=== DOĞRULAMA TAMAM — sunucu çalışmaya devam ediyor ==="
