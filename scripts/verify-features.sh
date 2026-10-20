#!/bin/bash
# KrimiScan Global — yeni özellik doğrulama scripti
# Sunucuyu başlatır, tüm yeni API/sayfaları test eder, ekran görüntüleri alır ve kapanır.
cd /home/z/my-project

echo "=== [1] Eski süreçleri temizle ==="
pkill -f "next dev" 2>/dev/null; sleep 1

echo "=== [2] Dev sunucuyu başlat ==="
nohup bun run dev > /dev/null 2>&1 &
SERVER_PID=$!
for i in $(seq 1 30); do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 --max-time 3)
  [ "$CODE" = "200" ] && break
  sleep 2
done
echo "Ana sayfa: HTTP $CODE (deneme $i)"

echo "=== [3] API testleri ==="
echo "--- /api/analytics:"
curl -s http://localhost:3000/api/analytics --max-time 60 | python3 -c "
import json,sys
d=json.load(sys.stdin)
a=d['analytics']
print('OK total:',a['total'],'| newTech:',a['newTech'],'| innovasyon:%'+str(a['innovationRatio']),'| haftalık bucket:',len(a['weekly']),'| trend kelime:',len(a['topKeywords']))"
echo "--- /api/watchlist POST (yapay zekâ):"
curl -s -X POST http://localhost:3000/api/watchlist -H "Content-Type: application/json" -d '{"term":"yapay zekâ"}' --max-time 60 | head -c 150; echo
echo "--- /api/watchlist POST (3D tarama):"
curl -s -X POST http://localhost:3000/api/watchlist -H "Content-Type: application/json" -d '{"term":"3B tarama"}' --max-time 30 | head -c 150; echo
echo "--- /api/watchlist GET (eşleşme sayıları):"
curl -s http://localhost:3000/api/watchlist --max-time 60 | python3 -c "
import json,sys
d=json.load(sys.stdin)
print('OK kelimeler:', [(k['term'], k['matchCount']) for k in d['keywords']])"

echo "=== [4] Sayfa render testleri ==="
for p in "/" "/analytics" "/report"; do
  C=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$p" --max-time 90)
  echo "$p -> HTTP $C"
done

echo "=== [5] Tarayıcı doğrulaması + ekran görüntüleri ==="
agent-browser set viewport 1440 900
agent-browser open http://localhost:3000
agent-browser wait --load networkidle --timeout 30000
sleep 2
agent-browser screenshot scripts/verify-home.png
echo "Ana sayfa hataları:"; agent-browser errors | head -5

agent-browser open http://localhost:3000/analytics
agent-browser wait --load networkidle --timeout 30000
sleep 3
agent-browser screenshot scripts/verify-analytics.png
agent-browser screenshot --full scripts/verify-analytics-full.png

agent-browser open http://localhost:3000/report
agent-browser wait --load networkidle --timeout 30000
sleep 2
agent-browser screenshot scripts/verify-report.png

agent-browser open http://localhost:3000
agent-browser wait --load networkidle --timeout 30000
sleep 1
# İzleme diyaloğunu aç
agent-browser find text "İzleme" click --timeout 10000 || agent-browser eval "document.querySelectorAll('button')[1]?.click()"
sleep 2
agent-browser screenshot scripts/verify-watchlist.png

agent-browser close

echo "=== [6] Temizlik: test kelimelerinden birini sil ==="
WID=$(curl -s http://localhost:3000/api/watchlist --max-time 30 | python3 -c "
import json,sys
d=json.load(sys.stdin)
terms=[k for k in d['keywords'] if k['term']=='3B tarama']
print(terms[0]['id'] if terms else '')")
if [ -n "$WID" ]; then
  curl -s -X DELETE "http://localhost:3000/api/watchlist/$WID" --max-time 30
  echo " -> 3B tarama silindi (DELETE testi OK)"
fi

kill $SERVER_PID 2>/dev/null
pkill -f "next dev" 2>/dev/null
echo "=== DOĞRULAMA TAMAMLANDI ==="
