#!/bin/bash
# Dev server'ı temiz yeniden başlat (CSS önbelleğini tazele)
# Not: PID 1 zinciri otomatik yeniden başlatmadığı için setsid ile bağımsız başlatılır
cd /home/z/my-project

PID=$(ss -tlnp 2>/dev/null | grep ":3000" | grep -oE "pid=[0-9]+" | head -1 | cut -d= -f2)
if [ -n "$PID" ]; then
  echo "Eski sunucu kapatılıyor (pid=$PID)..."
  kill "$PID" 2>/dev/null
  sleep 3
  kill -9 "$PID" 2>/dev/null
fi
sleep 1

echo "Sunucu setsid ile başlatılıyor..."
setsid -f nohup bun run dev > /tmp/next-dev.log 2>&1 < /dev/null

for i in $(seq 1 45); do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 --max-time 3)
  [ "$CODE" = "200" ] && break
  sleep 2
done
echo "Sunucu durumu: HTTP $CODE"

echo "=== CSS derleme kontrolü ==="
CSS_URL=$(curl -s http://localhost:3000/ --max-time 60 | grep -oE '/_next/static/[^"]*\.css[^"]*' | head -1 | sed 's/\\$//')
echo "CSS chunk: $CSS_URL"
C=$(curl -s "http://localhost:3000$CSS_URL" --max-time 30)
echo "mag-page kural sayısı: $(echo "$C" | grep -c 'mag-page')"
echo "mag-serif kural sayısı: $(echo "$C" | grep -c 'mag-serif')"
echo "mag-leaf kural sayısı: $(echo "$C" | grep -c 'mag-leaf')"
echo "magFlipNext keyframes: $(echo "$C" | grep -c 'magFlipNext')"

echo "=== Dev log son satırları ==="
tail -5 /tmp/next-dev.log
