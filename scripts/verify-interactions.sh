#!/bin/bash
# İzleme diyaloğu + zaman çizelgesi etkileşim testi
cd /home/z/my-project
# GÜVENLİK: pkill kaldırıldı — platformun kalıcı Next.js sunucusu asla öldürülmez
nohup bun run dev > /dev/null 2>&1 &
for i in $(seq 1 30); do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 --max-time 3)
  [ "$CODE" = "200" ] && break; sleep 2
done
echo "Sunucu hazır: HTTP $CODE"

agent-browser set viewport 1440 900
agent-browser open http://localhost:3000
agent-browser wait --load networkidle --timeout 30000
sleep 2

echo "=== Header snapshot (İzleme butonu ref'i bul) ==="
agent-browser snapshot -i -c 2>/dev/null | grep -iE "izleme|bell" | head -3

echo "=== İzleme diyaloğu aç ==="
agent-browser eval "document.querySelectorAll('header button')[0]?.click(); 'clicked'"
sleep 2
agent-browser screenshot scripts/verify-watchlist-dialog.png
echo "Dialog içerik kontrolü:"
agent-browser get text "body" 2>/dev/null | grep -oE "Anahtar Kelime İzleme Listesi|yapay zekâ" | sort -u

echo "=== Dialog kapat, zaman çizelgesine geç ==="
agent-browser press Escape
sleep 1
agent-browser eval "const btns=[...document.querySelectorAll('button')]; btns.find(b=>b.textContent.includes('Zaman Çizelgesi'))?.click(); 'ok'"
sleep 2
agent-browser screenshot scripts/verify-timeline.png
agent-browser scroll down 600
sleep 1
agent-browser screenshot scripts/verify-timeline-2.png

echo "=== Konsol hata kontrolü ==="
agent-browser errors | head -5

agent-browser close
# GÜVENLİK: pkill kaldırıldı — platformun kalıcı Next.js sunucusu asla öldürülmez
echo "=== TEST BİTTİ ==="
