#!/bin/bash
# Task 10 doğrulaması: Derin Analiz butonu kaldırıldı, şık scrollbar + kurdele,
# iki panelli katlamalı profesyonel çevirme
cd /home/z/my-project
OUT=download/profesyonel-flip-kontrol
mkdir -p "$OUT"

agent-browser set viewport 1440 900
agent-browser open http://localhost:3000
agent-browser wait --load networkidle --timeout 60000
sleep 4

echo "=== 1) Makale sayfasında Derin Analiz butonu YOK olmalı ==="
agent-browser eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.getAttribute('aria-label')==='Sonraki sayfa'); b.click(); return 1; })()"
sleep 1.7
agent-browser eval "(() => { const t=[...document.querySelectorAll('button')].find(x => x.className.includes('border-dotted')); t.click(); return 1; })()"
sleep 1.8
agent-browser eval "(() => JSON.stringify({ derinAnalizButonu: [...document.querySelectorAll('button')].some(x => (x.textContent||'').includes('Derin Analiz') || (x.textContent||'').includes('Analiz')), tamOkuVar: [...document.querySelectorAll('button')].some(x => (x.textContent||'').trim().startsWith('Tam Oku')) }))()"
agent-browser screenshot "$OUT/01-makale-butonsuz.png"

echo "=== 2) Tam Oku aç — diyalogda Derin Analiz YOK, kurdele + scrollbar var ==="
agent-browser eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim().startsWith('Tam Oku')); b.click(); return 1; })()"
sleep 1.2
agent-browser eval "(() => { const d=document.querySelector('[role=dialog]'); return JSON.stringify({ dialog: !!d, derinAnalizYok: !d || ![...d.querySelectorAll('button')].some(x => (x.textContent||'').includes('Derin Analiz')), kurdele: !!d?.querySelector('.mag-ribbon'), kurdeleYukseklik: d?.querySelector('.pointer-events-none')?.style?.height || null, scrollSinifi: !!d?.querySelector('.mag-scroll'), isaretleVar: [...(d?.querySelectorAll('button')||[])].some(x => (x.textContent||'').includes('işaretli') || (x.textContent||'').includes('İşaretle')), kaynakVar: [...(d?.querySelectorAll('a')||[])].some(x => (x.textContent||'').includes('Orijinal Kaynak')) }); })()"

echo "=== 3) Tam metni bekle ve kurdeleyi kaydırmayla test et ==="
for i in $(seq 1 50); do
  R=$(agent-browser eval "(() => { const s=[...document.querySelectorAll('[role=dialog] span')].map(x=>x.textContent).find(t=>t&&t.includes('Tam Metin ·')); return s||null; })()" 2>/dev/null)
  if [ -n "$R" ] && [ "$R" != "null" ]; then echo "Durum: $R"; break; fi
  sleep 2
done
agent-browser eval "(() => { const c=document.querySelector('[role=dialog] .mag-scroll'); if(!c) return 'kapsayıcı yok'; c.scrollTop = c.scrollHeight; c.dispatchEvent(new Event('scroll', {bubbles:true})); return 'en alta kaydırıldı'; })()"
sleep 0.8
agent-browser eval "(() => { const d=document.querySelector('[role=dialog]'); const r=d?.querySelector('.pointer-events-none'); return JSON.stringify({ kurdeleYukseklikSon: r?.style?.height || null, thumbRengi: getComputedStyle(d.querySelector('.mag-scroll'), '::-webkit-scrollbar-thumb').backgroundColor || 'webkit-ikonsuz' }); })()"
agent-browser screenshot "$OUT/02-tamoku-kurdele.png"
agent-browser eval "(() => { const b=document.querySelector('[aria-label=\"Okuma penceresini kapat\"]'); b?.click(); return 1; })()"
sleep 1

echo "=== 4) Çevirme ortasında KATLAMA elemanı (dış yarı) görünmeli ==="
agent-browser eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.getAttribute('aria-label')==='Sonraki sayfa'); b.click(); return 1; })()"
sleep 0.45
agent-browser eval "(() => { const f=document.querySelector('.mag-leaf .mag-fold'); const leaf=document.querySelector('.mag-leaf'); const sweep=document.querySelector('.mag-under-sweep'); if(!leaf) return JSON.stringify({yaprak:false}); const st=getComputedStyle(f); return JSON.stringify({ katlamaVar: !!f, katlamaAnim: st.animationName, transform: st.transform.slice(0,60), yonSekli: sweep?.className || null }); })()"
agent-browser screenshot "$OUT/03-flip-ortasi-katlama.png"
sleep 1.2

echo "=== 5) Geri çevirme de katlamalı ==="
agent-browser eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.getAttribute('aria-label')==='Önceki sayfa'); b.click(); return 1; })()"
sleep 0.5
agent-browser eval "(() => { const f=document.querySelector('.mag-leaf .mag-fold'); return JSON.stringify({ katlamaVar: !!f, anim: f ? getComputedStyle(f).animationName : null }); })()"
agent-browser screenshot "$OUT/04-flip-geri.png"
sleep 1.2

echo "=== 6) Sağ kulaktan sürükleme hâlâ çalışıyor (katlamalı) ==="
agent-browser eval "
(() => {
  const ear = document.querySelector('.mag-ear-right');
  const r = ear.getBoundingClientRect();
  const sx = r.right - 12, sy = r.bottom - 12;
  const mk = (t, x, y) => new PointerEvent(t, { bubbles: true, pointerId: 7, clientX: x, clientY: y, isPrimary: true });
  ear.dispatchEvent(mk('pointerdown', sx, sy));
  document.dispatchEvent(mk('pointermove', sx - 120, sy - 30));
  document.dispatchEvent(mk('pointermove', sx - 260, sy - 60));
  return 'sürüklendi';
})()
"
sleep 0.35
agent-browser eval "(() => { const f=document.querySelector('.mag-leaf .mag-fold'); return JSON.stringify({ suruklemedeKat: !!f, transform: f ? getComputedStyle(f).transform.slice(0,60) : null }); })()"
agent-browser screenshot "$OUT/05-surukle-katlama.png"
agent-browser eval "
(() => {
  const mk = (t, x, y) => new PointerEvent(t, { bubbles: true, pointerId: 7, clientX: x, clientY: y, isPrimary: true });
  document.dispatchEvent(mk('pointerup', 300, 400));
  return 'bırakıldı';
})()
"
sleep 1.6
agent-browser eval "(() => { const l=document.querySelector('.mag-serif.min-w-\\\\[86px\\\\]'); return JSON.stringify({ sayfaEtiketi: l ? l.textContent : null }); })()"

echo "=== 7) Kapak tıklaması artık Tam Oku açıyor ==="
agent-browser eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.getAttribute('aria-label')==='Önceki sayfa'); b.click(); return 1; })()"
sleep 1.5
agent-browser eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.getAttribute('aria-label')==='Önceki sayfa'); b.click(); return 1; })()"
sleep 1.5
agent-browser eval "(() => { const kapak=document.querySelector('.mag-frame button[title*=\"Tam Oku\"]'); if(!kapak) return 'kapak butonu yok'; kapak.click(); return 'kapak tıklandı'; })()"
sleep 1.5
agent-browser eval "(() => { const d=document.querySelector('[role=dialog]'); return JSON.stringify({ tamOkuAcildi: !!d, kapakBasligi: d?.querySelector('h2')?.textContent?.slice(0,50) || null }); })()"
agent-browser eval "(() => { document.querySelector('[aria-label=\"Okuma penceresini kapat\"]')?.click(); return 1; })()"
sleep 1
agent-browser errors

echo "=== 8) MOBİL 390px genel kontrol ==="
agent-browser set viewport 390 844
agent-browser open http://localhost:3000
agent-browser wait --load networkidle --timeout 60000
sleep 3
agent-browser eval "(() => JSON.stringify({ scrollW: document.documentElement.scrollWidth, vw: innerWidth }))()"
agent-browser screenshot "$OUT/06-mobil-kapak.png"
agent-browser errors
echo "=== BİTTİ ==="
