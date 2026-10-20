#!/bin/bash
# KrimiScan Global — mevcut arşivdeki bulgulara makale görselleri çıkarır
# Kullanım: bash scripts/enrich-images-run.sh [sure_butcesi_sn]
cd /home/z/my-project
BUDGET=${1:-440}

echo "=== [1] Eski süreçleri temizle ==="
pkill -f "next dev" 2>/dev/null; sleep 1

echo "=== [2] Dev sunucuyu başlat ==="
setsid nohup bun run dev > /tmp/next-dev.log 2>&1 < /dev/null &
for i in $(seq 1 30); do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 --max-time 3)
  [ "$CODE" = "200" ] && break
  sleep 2
done
echo "Sunucu hazır: HTTP $CODE"

echo "=== [3] Başlangıç durumu ==="
curl -s http://localhost:3000/api/enrich-images --max-time 30
echo

echo "=== [4] Zenginleştirme döngüsü (bütçe: ${BUDGET}s) ==="
START=$(date +%s)
while true; do
  ELAPSED=$(( $(date +%s) - START ))
  if [ $ELAPSED -gt $BUDGET ]; then
    echo "Süre bütçesi doldu — kalan kayıtlar için scripti tekrar çalıştırın."
    break
  fi
  RES=$(curl -s -X POST http://localhost:3000/api/enrich-images \
    -H "Content-Type: application/json" -d '{"limit":10}' --max-time 115)
  echo "[$(date +%H:%M:%S)] $RES"
  REMAINING=$(echo "$RES" | python3 -c "import json,sys; print(json.load(sys.stdin).get('remaining',0))" 2>/dev/null || echo "ERR")
  if [ "$REMAINING" = "ERR" ]; then
    sleep 3; continue
  fi
  if [ "$REMAINING" = "0" ]; then
    echo ">>> ZENGINLEŞTIRME TAMAMLANDI <<<"
    break
  fi
done

echo "=== [5] Final durum ==="
curl -s http://localhost:3000/api/enrich-images --max-time 30
echo

pkill -f "next dev" 2>/dev/null
echo "=== SCRIPT BİTTİ ==="
