/* Tam Oku düzeltmelerinin yerel birim testleri */
import {
  extractArticleParagraphs,
  isUnresolvableUrl,
  isGoodExtraction,
  filterJunkParagraphs,
} from "../src/lib/llm";

let fail = 0;
const check = (name: string, cond: boolean) => {
  console.log(`${cond ? "OK " : "FAIL"} ${name}`);
  if (!cond) fail++;
};

// 1) Junk: HTML yorum kalıntıları + düşük harf oranı (educamundo vakası)
const junkHtml = `
<html><body>
<p>Kriminalistik teknolojisi günlük yaşamda nasıl uygulanır | Educamundo Blog kampanya + kaynak) --> kampanya + kaynak) --> yönlendiren aracılığıyla kampanya + kaynak) --> 1 yakalama 22 Nis 2026 Mart APR 22 Mayıs 2025 2026 2027 başarı başarısız</p>
<!-- nav comments -->
<p>Adli bilimciler olay yerinde toplanan kanıtın güvenilirliğini artırmak için yeni dijital yöntemler geliştiriyor. Bu yöntemler arasında üç boyutlu tarama, genetik analiz ve yapay zeka destekli parmak izi eşleştirme öne çıkıyor. Uzmanlar bu teknolojilerin mahkemede kabul edilebilirliğini artırdığını vurguluyor.</p>
<p>Brazil federal polisi geçen ay yeni bir kriminal laboratuvar açtı. Laboratuvarda biyometrik tanımlama ve kimyasal madde analizleri için modern ekipmanlar bulunuyor. Yetkililer bu yatırımın olay yeri inceleme kapasitesini iki katına çıkaracağını bildirdi.</p>
<p>Uluslararası adli bilimler konferansında sunulan bir araştırma, dijital kanıt toplamanın klasik yöntemlere göre yüzde kırk daha az hata ürettiğini gösteriyor. Araştırmacılar sonuçların polis akademilerinin müfredatına eklenmesini öneriyor.</p>
</body></html>`;

const junkParas = extractArticleParagraphs(junkHtml);
console.log("Çıkarılan paragraf sayısı:", junkParas.length);
check("yorum kalıntısı paragraf elenmeli", !junkParas.some((p) => p.includes("-->")));
check("gerçek makale paragrafları kalmalı (>=3)", junkParas.length >= 3);
check("çıkarım iyi sayılmalı", isGoodExtraction(junkParas));

// 2) filterJunkParagraphs — önbellek kapısı simülasyonu
const cachedJunk = [
  "kampanya + kaynak) --> yönlendiren aracılığıyla kampanya + kaynak) --> 1 yakalama",
  "2026 2027 2025 %50 %70 SEPTEMBER OFFER *** +++ === ||| >>> [banner] (ads) ### $$$ %%% &&&",
];
const filtered = filterJunkParagraphs(cachedJunk);
check("önbellek junk'ları ayıklanmalı", filtered.length === 0);

// 3) isUnresolvableUrl
check("parametresiz apiclick çözülemez", isUnresolvableUrl("http://www.bing.com/news/apiclick.aspx"));
check(
  "parametreli apiclick çözülebilir",
  !isUnresolvableUrl("https://www.bing.com/news/apiclick.aspx?url=https%3a%2f%2fexample.com%2fx")
);
check("ana sayfa çözülemez", isUnresolvableUrl("https://cyberleninka.ru"));
check("gerçek makale adresi okunabilir", !isUnresolvableUrl("https://example.com/article/123"));

// 4) Jina düz metin yorum kalıntısı
const plainJunk = `Title: X
Markdown Content:
kampanya --> kaynak) --> banner 2026 2027
Bu gerçek paragraf adli bilimler alanındaki yeni gelişmeleri anlatan uzun bir metindir ve toplam seksen kelimeden fazla içeriğe sahiptir. Olay yeri inceleme ekipleri dijital tarama cihazlarıyla kanıt toplamanın doğruluğunu artırdığını bildiriyor ve bu yöntem artık birçok ülkede standart hale gelmiştir. Uzmanlar ayrıca genetik genealojinin soğuk vaka dosyalarında çığır açtığını vurgulamaktadır.`;
const plainParas = extractArticleParagraphs(`<p>${plainJunk.replace(/\n+/g, "</p><p>")}</p>`);
check("düz metin junk'ı elenmeli", !plainParas.some((p) => p.includes("-->")));

console.log(fail === 0 ? "\nTÜM TESTLER GEÇTİ" : `\n${fail} TEST BAŞARISIZ`);
process.exit(fail === 0 ? 0 : 1);
