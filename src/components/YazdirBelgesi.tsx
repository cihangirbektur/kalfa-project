import type { Kazanim, Plan, PlanIcerik } from "@/lib/tipler";
import { ETKINLIK_TIP_ETIKET, SINIF_ROZET } from "@/lib/tipler";
import { adetGosterim, maliyetHesapla, paraBicimi } from "@/lib/hesap";

export const YAZDIR_KAPSAMLARI = [
  { deger: "tum", etiket: "Tüm plan" },
  { deger: "malzeme", etiket: "Yalnızca malzeme kontrol listesi" },
  { deger: "kartlar", etiket: "Yalnızca soru kartları" },
  { deger: "olcme", etiket: "Yalnızca ölçme araçları" },
] as const;

export type YazdirKapsami = (typeof YAZDIR_KAPSAMLARI)[number]["deger"];

const sayi = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : Number(v) || 0);

type Props = {
  plan: Plan;
  icerik: PlanIcerik;
  kazanim?: Kazanim | null;
  modelAdi: string;
  alanAdi?: string | null;
  kapsam: YazdirKapsami;
};

export function YazdirBelgesi({ plan, icerik, kazanim, modelAdi, alanAdi, kapsam }: Props) {
  const baslik = icerik.plan_basligi ?? "Adsız plan";
  const surum = `v${plan.versiyon ?? 1}`;
  const asamalar = icerik.asamalar ?? [];
  const etkinlikler = icerik.etkinlikler ?? [];
  const malzemeler = icerik.malzemeler ?? [];
  const kartlar = icerik.merak_tetikleyicileri?.soru_kartlari ?? [];
  const degerlendirme = icerik.degerlendirme;
  const toplamSure = icerik.toplam_sure_dk ?? plan.toplam_sure;
  const asamaToplam = asamalar.reduce((t, a) => t + sayi(a.sure_dk), 0) || toplamSure || 1;
  const maliyet = maliyetHesapla(malzemeler);
  const toplamHazirlik = malzemeler.reduce((t, m) => t + sayi(m.hazirlik_suresi_dk), 0);

  const kazanimKodu = kazanim?.kod ?? icerik.kazanim?.kod ?? "";
  const kazanimMetni = kazanim?.metin ?? icerik.kazanim?.metin ?? "—";
  const alan = alanAdi ?? kazanim?.atolye_alani ?? plan.konu_basligi ?? "—";

  let sayfaNo = 0;
  const Altbilgi = () => {
    sayfaNo += 1;
    return (
      <div className="y-altbilgi">
        {baslik} · {surum} · Sayfa {sayfaNo}
      </div>
    );
  };

  const goster = (b: YazdirKapsami) => kapsam === "tum" || kapsam === b;

  return (
    <div className="kalfa-yazdir">
      {kapsam === "tum" && (
        <section className="y-sayfa">
          <div className="y-ust">KALFA · Bilim Türkiye / DENEYAP atölye içeriği</div>
          <h1 className="y-baslik">{baslik}</h1>
          {kazanimKodu && <p className="y-kod">{kazanimKodu}</p>}
          <p className="y-kazanim">{kazanimMetni}</p>
          <p className="y-kunye">
            {alan} · {SINIF_ROZET[plan.yas_grubu] ?? plan.yas_grubu} · {toplamSure} dk ·{" "}
            {modelAdi} · {surum}
          </p>
          {plan.durum === "onayli" && (
            <div className="y-onay">
              <strong>Pedagojik uzman onayından geçmiştir.</strong>
              {plan.onay_tarihi
                ? ` Onay tarihi: ${new Date(plan.onay_tarihi).toLocaleDateString("tr-TR")}`
                : ""}
            </div>
          )}
          <h2 className="y-h2">Aşama dağılımı</h2>
          <table className="y-tablo">
            <thead>
              <tr>
                <th>Aşama</th>
                <th>Süre</th>
                <th>Yüzde</th>
              </tr>
            </thead>
            <tbody>
              {asamalar.map((a, i) => (
                <tr key={i}>
                  <td>{a.asama}</td>
                  <td>{sayi(a.sure_dk)} dk</td>
                  <td>%{Math.round((sayi(a.sure_dk) / asamaToplam) * 100)}</td>
                </tr>
              ))}
              <tr>
                <td>
                  <strong>Toplam</strong>
                </td>
                <td>
                  <strong>{asamalar.reduce((t, a) => t + sayi(a.sure_dk), 0)} dk</strong>
                </td>
                <td>%100</td>
              </tr>
            </tbody>
          </table>
          <Altbilgi />
        </section>
      )}

      {kapsam === "tum" && (
        <section className="y-sayfa">
          <h2 className="y-h2">Ders akışı</h2>
          {asamalar.map((a, i) => (
            <div key={i} className="y-blok">
              <h3 className="y-h3">
                {a.asama} — {sayi(a.sure_dk)} dk
              </h3>
              <p>
                <span className="y-etiket">Amaç:</span> {a.amac}
              </p>
              <p>
                <span className="y-etiket">Öğretmen eylemi:</span> {a.ogretmen_eylemi}
              </p>
              <p>
                <span className="y-etiket">Öğrenci eylemi:</span> {a.ogrenci_eylemi}
              </p>
              {(a.tetikleyici_sorular ?? []).length > 0 && (
                <>
                  <p className="y-etiket">Tetikleyici sorular</p>
                  <ul className="y-liste">
                    {(a.tetikleyici_sorular ?? []).map((s, j) => (
                      <li key={j}>{s}</li>
                    ))}
                  </ul>
                </>
              )}
              {(a.beklenen_kavram_yanilgilari ?? []).length > 0 && (
                <>
                  <p className="y-etiket">Beklenen kavram yanılgıları</p>
                  <ul className="y-liste">
                    {(a.beklenen_kavram_yanilgilari ?? []).map((k, j) => (
                      <li key={j}>
                        {k.yanilgi} → {k.ele_alinma_bicimi}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
          <Altbilgi />
        </section>
      )}

      {kapsam === "tum" && (
        <section className="y-sayfa">
          <h2 className="y-h2">Etkinlikler</h2>
          {etkinlikler.map((e, i) => (
            <div key={i} className="y-blok">
              <h3 className="y-h3">
                {ETKINLIK_TIP_ETIKET[e.tip] ?? e.tip} · {e.ad}
              </h3>
              <p className="y-kunye">
                Bağlı aşama: {e.bagli_asama} · {sayi(e.sure_dk)} dk
              </p>
              <ol className="y-liste">
                {(e.adimlar ?? []).map((a, j) => (
                  <li key={j}>{a}</li>
                ))}
              </ol>
              <p>
                <span className="y-etiket">Destek:</span> {e.farklilastirma?.destek}
              </p>
              <p>
                <span className="y-etiket">Zenginleştirme:</span> {e.farklilastirma?.zenginlestirme}
              </p>
              {e.oyun_yapisi && (
                <div className="y-kutu">
                  <p className="y-etiket">Oyun yapısı</p>
                  <p>Oyuncu sayısı: {e.oyun_yapisi.oyuncu_sayisi}</p>
                  <p>Bileşenler: {e.oyun_yapisi.bilesenler}</p>
                  {(e.oyun_yapisi.tur_akisi ?? []).length > 0 && (
                    <ol className="y-liste">
                      {e.oyun_yapisi.tur_akisi.map((t, j) => (
                        <li key={j}>{t}</li>
                      ))}
                    </ol>
                  )}
                  <p>Kazanma koşulu: {e.oyun_yapisi.kazanma_kosulu}</p>
                </div>
              )}
            </div>
          ))}
          <Altbilgi />
        </section>
      )}

      {goster("malzeme") && (
        <section className="y-sayfa">
          <h2 className="y-h2">Malzeme kontrol listesi</h2>
          <table className="y-tablo">
            <thead>
              <tr>
                <th className="y-kutucuk-sutun"> </th>
                <th>Malzeme</th>
                <th>Adet</th>
                <th>Birim maliyet</th>
                <th>Hazırlık</th>
                <th>Güvenlik notu</th>
                <th>Alternatif</th>
              </tr>
            </thead>
            <tbody>
              {malzemeler.map((m, i) => (
                <tr key={i} className={m.guvenlik_notu ? "y-riskli" : undefined}>
                  <td className="y-kutucuk-sutun">
                    <span className="y-kutucuk" />
                  </td>
                  <td>{m.ad}</td>
                  <td>{adetGosterim(m)}</td>
                  <td>{paraBicimi(sayi(m.tahmini_birim_maliyet_tl))} TL</td>
                  <td>{sayi(m.hazirlik_suresi_dk)} dk</td>
                  <td>{m.guvenlik_notu || "—"}</td>
                  <td>{m.alternatif || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="y-toplam">
            Toplam maliyet: {paraBicimi(maliyet.toplam)} TL · Toplam hazırlık süresi:{" "}
            {toplamHazirlik} dk
            {maliyet.hesaplanamayan > 0
              ? ` · ${maliyet.hesaplanamayan} satır hesaplanamadı`
              : ""}
          </p>
          <Altbilgi />
        </section>
      )}

      {goster("kartlar") && (
        <section className="y-sayfa">
          <h2 className="y-h2">Merak soru kartları</h2>
          <div className="y-kartlar">
            {kartlar.map((s, i) => (
              <div key={i} className="y-kart">
                <p>{s}</p>
              </div>
            ))}
          </div>
          {icerik.merak_tetikleyicileri?.merak_kutusu_notu && (
            <p className="y-not">{icerik.merak_tetikleyicileri.merak_kutusu_notu}</p>
          )}
          <Altbilgi />
        </section>
      )}

      {goster("olcme") && (
        <section className="y-sayfa">
          <h2 className="y-h2">Ölçme araçları</h2>
          <h3 className="y-h3">Biçimlendirici değerlendirme</h3>
          <table className="y-tablo">
            <thead>
              <tr>
                <th>Aşama</th>
                <th>Soru</th>
              </tr>
            </thead>
            <tbody>
              {(degerlendirme?.bicimlendirici ?? []).map((b, i) => (
                <tr key={i}>
                  <td>{b.asama}</td>
                  <td>{b.soru}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {(degerlendirme?.surec_odakli ?? []).length > 0 && (
            <>
              <h3 className="y-h3">Süreç odaklı değerlendirme</h3>
              <table className="y-tablo">
                <thead>
                  <tr>
                    <th>Ne gözlemlenecek</th>
                    <th>Yansıtıcı araç</th>
                  </tr>
                </thead>
                <tbody>
                  {(degerlendirme?.surec_odakli ?? []).map((s, i) => (
                    <tr key={i}>
                      <td>{s.ne_gozlemlenecek}</td>
                      <td>{s.yansitici_arac}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          <h3 className="y-h3">Performans görevi</h3>
          <p>{degerlendirme?.duzey_belirleyici?.gorev ?? "—"}</p>
          <table className="y-tablo">
            <thead>
              <tr>
                <th>Kriter</th>
                <th>3 puan</th>
                <th>2 puan</th>
                <th>1 puan</th>
              </tr>
            </thead>
            <tbody>
              {(degerlendirme?.duzey_belirleyici?.rubrik ?? []).map((r, i) => (
                <tr key={i}>
                  <td>{r.kriter}</td>
                  <td>{r["3_puan"]}</td>
                  <td>{r["2_puan"]}</td>
                  <td>{r["1_puan"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Altbilgi />
        </section>
      )}
    </div>
  );
}
