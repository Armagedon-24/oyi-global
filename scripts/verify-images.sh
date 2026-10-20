#!/bin/bash
# KrimiScan Global — makale görselleri özelliği doğrulama
cd /home/z/my-project

echo "=== [1] Eski süreçleri temizle ==="
# GÜVENLİK: pkill kaldırıldı — platformun kalıcı Next.js sunucusu asla öldürülmez

echo "=== [2] Dev sunucuyu başlat ==="
setsid nohup bun run dev > /tmp/next-dev.log 2>&1 < /dev/null &
for i in $(seq 1 30); do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 --max-time 3)
  [ "$CODE" = "200" ] && break
  sleep 2
done
echo "Sunucu hazır: HTTP $CODE"

echo "=== [3] /api/findings görsel alanı kontrolü ==="
curl -s "http://localhost:3000/api/findings?limit=100" --max-time 60 | python3 -c "
import json,sys
d=json.load(sys.stdin)
fs=d['findings']
withImg=[f for f in fs if f['images'] not in ('[]','none') and f['images']]
print(f'dönen: {len(fs)} | görselli: {len(withImg)}')
if withImg:
    f=withImg[0]
    import json as j
    imgs=j.loads(f['images'])
    print('örnek:', f['trTitle'][:60])
    print('  ilk görsel:', imgs[0]['url'][:100])
    print('  alt:', (imgs[0]['alt'] or '(yok)')[:80])
    print('  toplam görsel:', len(imgs))
    # proxy testi için sakla
    open('/tmp/proxy-test-url.txt','w').write(imgs[0]['url'])
"

echo "=== [4] /api/image-proxy testi ==="
TESTURL=$(cat /tmp/proxy-test-url.txt 2>/dev/null)
if [ -n "$TESTURL" ]; then
  curl -s -o /tmp/proxy-test.jpg -w "proxy HTTP %{http_code} | tür: %{content_type} | boyut: %{size_download}B\n" \
    "http://localhost:3000/api/image-proxy?url=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1],safe=''))" "$TESTURL")" --max-time 30
  file /tmp/proxy-test.jpg | head -1
else
  echo "Test URL yok!"
fi

echo "=== [5] /api/deep-dive görsel dönüşü testi ==="
FID=$(curl -s "http://localhost:3000/api/findings?limit=100" --max-time 60 | python3 -c "
import json,sys
d=json.load(sys.stdin)
for f in d['findings']:
    if f['images'] not in ('[]','none'):
        print(f['id']); break
")
curl -s -X POST http://localhost:3000/api/deep-dive -H "Content-Type: application/json" -d "{\"id\":\"$FID\"}" --max-time 115 | python3 -c "
import json,sys
d=json.load(sys.stdin)
print('success:', d.get('success'), '| cached:', d.get('cached'), '| görsel sayısı:', len(d.get('images',[])), '| analiz uzunluğu:', len(d.get('analysis','')))"

echo "=== [6] Tarayıcı doğrulaması ==="
agent-browser set viewport 1440 900
agent-browser open http://localhost:3000
agent-browser wait --load networkidle --timeout 30000
sleep 3
agent-browser screenshot scripts/verify-images-home.png
echo "--- Ana sayfa konsol hataları:"
agent-browser errors | head -5

mkdir -p download/gorsel-kontrol
cp scripts/verify-images-home.png download/gorsel-kontrol/01-kart-gorselleri.png

echo "=== [7] Derin analiz galerisi aç ==="
# Görselli ilk kartın Derin Analiz butonuna tıkla
agent-browser find text "Derin Analiz" click --timeout 15000 || echo "buton bulunamadı"
sleep 12
agent-browser screenshot scripts/verify-images-deepdive.png
cp scripts/verify-images-deepdive.png download/gorsel-kontrol/02-derin-analiz-galeri.png

echo "--- Derin analizi açıkken konsol hataları:"
agent-browser errors | head -5

echo "=== [8] Lightbox (büyüteç) testi ==="
# Galerideki ilk görsele tıkla
agent-browser eval "document.querySelector('[data-slot=\"sheet-content\"] figure button, .grid button img')?.closest('button')?.click()"
sleep 2
agent-browser screenshot scripts/verify-images-lightbox.png
cp scripts/verify-images-lightbox.png download/gorsel-kontrol/03-lightbox.png
agent-browser errors | head -3

echo "=== [9] Mobil görünüm ==="
agent-browser eval "document.querySelector('[data-slot=\"sheet-content\"] button[data-slot=\"dialog-close\"], [data-slot=\"sheet-content\"]')?.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))"
sleep 1
agent-browser press Escape 2>/dev/null
sleep 1
agent-browser set viewport 390 844
sleep 1
agent-browser screenshot scripts/verify-images-mobile.png
cp scripts/verify-images-mobile.png download/gorsel-kontrol/04-mobil.png

agent-browser close

echo "=== [10] Rapor/analitik sayfaları hâlâ sağlam mı ==="
for p in "/analytics" "/report" "/briefing"; do
  C=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$p" --max-time 60)
  echo "$p -> HTTP $C"
done

# GÜVENLİK: pkill kaldırıldı — platformun kalıcı Next.js sunucusu asla öldürülmez
echo "=== DOĞRULAMA TAMAMLANDI ==="
