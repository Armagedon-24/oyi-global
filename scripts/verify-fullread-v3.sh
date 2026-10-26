#!/bin/bash
# Yükleme durumu görsel testi — önbelleksiz Hollandaca makale (çeviri yolu)
cd /home/z/my-project
OUT=download/tamoku-v2-kontrol

agent-browser set viewport 1440 900
agent-browser open http://localhost:3000
agent-browser wait --load networkidle --timeout 60000
sleep 4
agent-browser eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.getAttribute('aria-label')==='Sonraki sayfa'); b.click(); return 'ileri'; })()"
sleep 1.7

echo "=== 'Yeni Teknikler' makalesine git (TOC satır 7) ==="
agent-browser eval "
(() => {
  const rows = [...document.querySelectorAll('button')].filter(x => x.className.includes('border-dotted'));
  const target = rows.find(x => (x.textContent||'').includes('Yeni Teknikler'));
  if (!target) return 'bulunamadı, satır sayısı: ' + rows.length;
  target.click();
  return 'atlandı';
})()
"
sleep 1.8
agent-browser screenshot "$OUT/06-nl-makale.png"

echo "=== Tam Oku tıkla ve YÜKLENİYOR durumunu hemen yakala ==="
agent-browser eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim().startsWith('Tam Oku')); if(!b) return 'buton yok'; b.click(); return 'tıklandı'; })()"
sleep 1.2
agent-browser eval "(() => JSON.stringify({ faz: [...document.querySelectorAll('[role=dialog] p')].map(p=>p.textContent).find(t=>t&&t.includes('…')) || null, dizgiSatirlari: document.querySelectorAll('[role=dialog] .animate-pulse').length, dönerIkon: !!document.querySelector('[role=dialog] .animate-spin') }))()"
agent-browser screenshot "$OUT/07-nl-yukleniyor.png"

echo "=== Tam metin bekle (en fazla 130sn) ==="
for i in $(seq 1 65); do
  R=$(agent-browser eval "(() => { const s=[...document.querySelectorAll('[role=dialog] span')].map(x=>x.textContent).find(t=>t&&t.includes('Tam Metin ·')); const e=[...document.querySelectorAll('[role=dialog] span')].map(x=>x.textContent).find(t=>t&&t.includes('okunamadı')); return s||e||null; })()" 2>/dev/null)
  if [ -n "$R" ] && [ "$R" != "null" ]; then echo "Durum: $R"; break; fi
  sleep 2
done

echo "=== İçerik doğrulama ==="
agent-browser eval "
(() => {
  const d = document.querySelector('[role=dialog]');
  if (!d) return JSON.stringify({ dialog: false });
  const ps = [...d.querySelectorAll('article p')];
  const badge = [...d.querySelectorAll('span')].map(x=>x.textContent).find(t=>t&&t.includes('Tam Metin ·')) || null;
  return JSON.stringify({
    badge,
    paragraf: ps.length,
    ilkParagraf: (ps[0]?.textContent || '').slice(0, 160),
    toplamKarakter: ps.reduce((a,p)=>a+p.textContent.length,0)
  });
})()
"
agent-browser screenshot "$OUT/08-nl-tam-metin.png"
agent-browser eval "(() => { const b=document.querySelector('[aria-label=\"Okuma penceresini kapat\"]'); if(b) b.click(); return 'kapandı'; })()"
sleep 1
agent-browser errors
echo "=== BİTTİ ==="
