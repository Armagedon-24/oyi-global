#!/bin/bash
# Tam Oku penceresi — doğru navigasyonla doğrulama
cd /home/z/my-project
OUT=download/kose-cevirme-kontrol

agent-browser set viewport 1440 900
agent-browser open http://localhost:3000
agent-browser wait --load networkidle --timeout 60000
sleep 4
agent-browser eval "(() => { const s = document.querySelector('.mag-frame'); if (s) s.scrollIntoView({block:'center'}); return 'ok'; })()"
sleep 1

echo "=== Kapak -> İçindekiler -> Makale 01 ==="
agent-browser eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.getAttribute('aria-label')==='Sonraki sayfa'); b.click(); return 'ileri'; })()"
sleep 1.6
agent-browser eval "
(() => {
  const btn = [...document.querySelectorAll('button')].find(x => x.textContent.includes('PARMAK İZİ VE İZ İNCELEMESİ'));
  if (!btn) return 'toc satırı yok';
  btn.click();
  return 'makaleye atlandı';
})()
"
sleep 1.8
agent-browser eval "(() => { const l=document.querySelector('.mag-serif.min-w-\\\\[86px\\\\]'); return JSON.stringify({ label: l ? l.textContent : null }); })()"

echo "=== TAM OKU ==="
agent-browser eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim().startsWith('Tam Oku')); if(!b) return 'buton yok'; b.click(); return 'tıklandı'; })()"
sleep 1.8
agent-browser eval "
(() => {
  const dlg = document.querySelector('[data-slot=dialog-content]');
  if (!dlg) return JSON.stringify({ open: false });
  const r = dlg.getBoundingClientRect();
  const arts = dlg.querySelectorAll('article p');
  let len = 0; arts.forEach(p => len += (p.textContent || '').length);
  return JSON.stringify({
    open: true, w: Math.round(r.width), h: Math.round(r.height), vw: window.innerWidth,
    paragraf: arts.length, tamMetinUzunluk: len, figurler: dlg.querySelectorAll('figure').length
  });
})()
"
agent-browser screenshot $OUT/13-tam-oku-genis.png

echo "=== Lightbox ==="
agent-browser eval "(() => { const f=document.querySelector('[data-slot=dialog-content] figure'); if(!f) return 'figür yok'; f.click(); return 'açılıyor'; })()"
sleep 1.2
agent-browser eval "
(() => {
  const lb = [...document.querySelectorAll('div')].find(d => d.className && String(d.className).includes('bg-black/90'));
  return JSON.stringify({ lightboxAcik: !!lb });
})()
"
agent-browser screenshot $OUT/14-tam-oku-lightbox.png
agent-browser eval "(() => { const b=document.querySelector('[aria-label=\"Büyütücüyı kapat\"]'); if(b){b.click();return 'lb kapandı';} return 'yok'; })()"
sleep 0.5
agent-browser eval "(() => { const b=document.querySelector('[aria-label=\"Okuma penceresini kapat\"]'); if(b){b.click();return 'pencere kapandı';} return 'yok'; })()"
sleep 0.8
agent-browser eval "(() => JSON.stringify({ dialogKaldi: !!document.querySelector('[data-slot=dialog-content]') }))()"

echo "=== Klavye ok tuşu pencere açıkken çevirmemeli ==="
agent-browser eval "(() => { const l=document.querySelector('.mag-serif.min-w-\\\\[86px\\\\]'); return JSON.stringify({ once: l ? l.textContent : null }); })()"
agent-browser eval "(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })); return 'ok gönderildi'; })()"
sleep 0.5
agent-browser eval "(() => { const l=document.querySelector('.mag-serif.min-w-\\\\[86px\\\\]'); return JSON.stringify({ sonra: l ? l.textContent : null }); })()"

echo "=== Derin Analiz zinciri (pencereden) ==="
agent-browser eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim().startsWith('Tam Oku')); b.click(); return 'yeniden açıldı'; })()"
sleep 1.5
agent-browser eval "(() => { const b=[...document.querySelectorAll('[data-slot=dialog-content] button')].find(x=>x.textContent.includes('Derin Analiz')); if(!b) return 'buton yok'; b.click(); return 'derin analize geçti'; })()"
sleep 3
agent-browser eval "(() => JSON.stringify({ dialog: !!document.querySelector('[data-slot=dialog-content]'), sheet: !!document.querySelector('[data-slot=sheet-content]'), baslik: (document.querySelector('[data-slot=sheet-content] h2, [data-slot=sheet-content] [data-slot=dialog-title]')||{}).textContent?.slice(0,50) }))()"
agent-browser screenshot $OUT/15-tam-oku-derin-analiz.png
agent-browser eval "(() => { const b=document.querySelector('[data-slot=sheet-content] [aria-label*\\u003dKapat], [data-slot=sheet-content] button'); if(b){b.click();return 'sheet kapandı';} return 'yok'; })()"
sleep 0.8
echo "=== Konsol ==="
agent-browser errors
echo "BİTTİ"
