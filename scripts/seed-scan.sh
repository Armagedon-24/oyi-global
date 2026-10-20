#!/bin/bash
# KrimiScan Global — veritabanı ön doldurma (tüm diller)
set -u
BASE="http://localhost:3000"

SCAN=$(curl -s -X POST "$BASE/api/scan/start" -H "Content-Type: application/json" -d '{"scope":"all"}')
SCAN_ID=$(echo "$SCAN" | sed -n 's/.*"scanId":"\([^"]*\)".*/\1/p')
echo "Scan started: $SCAN_ID"

if [ -z "$SCAN_ID" ]; then
  echo "ERROR: scanId alınamadı"
  exit 1
fi

LANGS=$(echo "$SCAN" | python3 -c "import json,sys; d=json.load(sys.stdin); print(' '.join([l['code'] for l in d['languages']]))")
echo "Languages: $LANGS"

for LANG in $LANGS; do
  echo "--- Step: $LANG ---"
  RESULT=$(curl -s --max-time 170 -X POST "$BASE/api/scan/step" -H "Content-Type: application/json" -d "{\"scanId\":\"$SCAN_ID\",\"langCode\":\"$LANG\"}")
  echo "$RESULT" | python3 -c "
import json,sys
try:
    d=json.load(sys.stdin)
    if d.get('success'):
        print(f\"  {d['langName']}: searched={d['searched']} relevant={d['relevant']} added={d['added']}\")
    else:
        print('  FAIL:', d.get('error'))
except Exception as e:
    print('  PARSE ERROR:', e)
"
done

curl -s -X POST "$BASE/api/scan/complete" -H "Content-Type: application/json" -d "{\"scanId\":\"$SCAN_ID\"}" | head -c 200
echo ""
echo "=== SEED DONE ==="
