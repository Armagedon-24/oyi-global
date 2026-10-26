#!/bin/bash
# Tam Oku v2 — tam makale getirme akışının uçtan uca doğrulaması
# (Derin analiz gibi canlı getirme + dergi üslubu yükleniyor + tam metin)
cd /home/z/my-project
OUT=download/tamoku-v2-kontrol
mkdir -p "$OUT"

echo "=== 1) Ana sayfa (dergi görünümü) ==="
agent-browser set viewport 1440 900
agent-browser open http://localhost:3000
agent-browser wait --load networkidle --timeout 60000
sleep 4

echo "=== 2) Kapak -> İçindekiler -> Makale sayfası ==="
agent-browser eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.getAttribute('aria-label')==='Sonraki sayfa'); b.click(); return 'ileri'; })()"
sleep 1.7
agent-browser eval "(() => { const b=[...document.querySelectorAll('button')].find(x => x.className.includes('border-dotted')); if (!b) return 'toc satırı bulunamadı'; b.click(); return 'makaleye atlandı: ' + (b.textContent || '').slice(0, 60); })()"
sleep 1.8
agent-browser screenshot "$OUT/01-makale-sayfasi.png"

echo "=== 3) Tam Oku tıkla — YÜKLENİYOR durumu ==="
agent-browser eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim().startsWith('Tam Oku')); if(!b) return 'buton yok'; b.click(); return 'tıklandı'; })()"
sleep 1.5
agent-browser eval "(() => JSON.stringify({ faz: [...document.querySelectorAll('[role=dialog] p')].map(p=>p.textContent).find(t=>t&&t.includes('…')) || null, dizgiSatirlari: document.querySelectorAll('[role=dialog] .animate-pulse').length }))()"
agent-browser screenshot "$OUT/02-yukleniyor.png"

echo "=== 4) Tam metin yüklenmesini bekle (en fazla 110sn) ==="
for i in $(seq 1 55); do
  R=$(agent-browser eval "(() => { const s=[...document.querySelectorAll('[role=dialog] span')].map(x=>x.textContent).find(t=>t&&t.includes('Tam Metin ·')); return s||null; })()" 2>/dev/null)
  if [ -n "$R" ] && [ "$R" != "null" ]; then echo "Hazır: $R"; break; fi
  sleep 2
done

echo "=== 5) İçerik doğrulaması ==="
agent-browser eval "
(() => {
  const d = document.querySelector('[role=dialog]');
  if (!d) return JSON.stringify({ dialog: false });
  const ps = [...d.querySelectorAll('article p')].filter(p => p.textContent.length > 80);
  const imgs = [...d.querySelectorAll('article img, section img')];
  const badge = [...d.querySelectorAll('span')].map(x=>x.textContent).find(t=>t&&t.includes('Tam Metin ·')) || null;
  const rect = d.getBoundingClientRect();
  return JSON.stringify({
    dialog: true,
    badge,
    uzunParagraf: ps.length,
    toplamMetinKarakter: [...d.querySelectorAll('article p')].reduce((a,p)=>a+p.textContent.length,0),
    galeriGorsel: imgs.length,
    yuklenenGorsel: imgs.filter(i=>i.complete && i.naturalWidth>0).length,
    bildirim: [...d.querySelectorAll('div')].some(x=>x.textContent.includes('okunamadı') && x.className.includes('amber')),
    genislik: Math.round(rect.width),
    yukseklik: Math.round(rect.height),
    ortalamaMi: Math.abs((rect.left + rect.width/2) - innerWidth/2) < 30
  });
})()
"
agent-browser screenshot "$OUT/03-tam-metin.png"

echo "=== 6) Sayfa içinde kaydırma + görsel galerisi görüntüsü ==="
agent-browser eval "(() => { const c=document.querySelector('[role=dialog] .mag-page-content'); if(c) c.scrollTop = 400; return c ? 'kaydırıldı: '+c.scrollTop : 'kapsayıcı yok'; })()"
sleep 1
agent-browser screenshot "$OUT/04-kaydirma.png"

echo "=== 7) Pencereyi kapat, konsol hatası kontrolü ==="
agent-browser eval "(() => { const b=document.querySelector('[aria-label=\"Okuma penceresini kapat\"]'); if(!b) return 'kapat yok'; b.click(); return 'kapandı'; })()"
sleep 1
agent-browser errors

echo "=== 8) MOBİL 390px — Tam Oku penceresi sığıyor mu ==="
agent-browser set viewport 390 844
agent-browser open http://localhost:3000
agent-browser wait --load networkidle --timeout 60000
sleep 3
agent-browser eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.getAttribute('aria-label')==='Sonraki sayfa'); b.click(); return 'ileri'; })()"
sleep 1.7
agent-browser eval "(() => { const rows = [...document.querySelectorAll('button')].filter(x => x.className.includes('border-dotted')); if (!rows.length) return 'toc yok'; rows[0].click(); return 'makaleye atlandı'; })()"
sleep 1.8
agent-browser eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim().startsWith('Tam Oku')); if(!b) return 'buton yok'; b.click(); return 'tıklandı'; })()"
sleep 2
agent-browser eval "(() => JSON.stringify({ faz: [...document.querySelectorAll('[role=dialog] p')].map(p=>p.textContent).find(t=>t&&t.includes('…')) || null }))()"
agent-browser screenshot "$OUT/05-mobil-yukleniyor.png"
echo '--- mobil tam metin bekleme ---'
for i in $(seq 1 55); do
  R=$(agent-browser eval "(() => { const s=[...document.querySelectorAll('[role=dialog] span')].map(x=>x.textContent).find(t=>t&&t.includes('Tam Metin ·')); return s||null; })()" 2>/dev/null)
  if [ -n "$R" ] && [ "$R" != "null" ]; then echo "Hazır: $R"; break; fi
  sleep 2
done
agent-browser eval "(() => { const d=document.querySelector('[role=dialog]'); if(!d) return JSON.stringify({dialog:false}); const r=d.getBoundingClientRect(); return JSON.stringify({ dialog:true, genislik:Math.round(r.width), sagKenar:Math.round(innerWidth-r.right), scrollW:document.documentElement.scrollWidth, vw:innerWidth }); })()"
agent-browser screenshot "$OUT/05-mobil.png"
agent-browser errors
echo "=== BİTTİ ==="
