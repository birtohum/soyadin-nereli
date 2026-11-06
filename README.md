# Soyadın nereli?

**Canlı:** https://birtohum.github.io/soyadin-nereli/

Soyadını yaz. Sayfa o soyadının hangi illerde en çok kullanılan 30 soyadı arasında olduğunu, kaçıncı sırada olduğunu ve nüfusa oranla nerede en yoğun olduğunu gösterir. İlk ekrandaki haritada her ilin üzerinde o ile özgü soyadı yazar: ilin ilk 30'unda olup en az sayıda başka ilin ilk 30'unda görünen soyadı.

## Veri

TÜİK, Adrese Dayalı Nüfus Kayıt Sistemi, en çok kullanılan soyadları, 2025. Kaynak Nüfus İstatistikleri Portalı. Veri, `araclar/topla.py` ile Türkiye ve 81 il için bir kez çekildi (82 istek, aralarında 2 saniye beklendi).

## Sonuçlar

- 81 ilin listelerinde toplam 268 farklı soyadı var. Bunların 134'ü yalnız bir ilin listesinde geçiyor.
- Yılmaz, Kaya ve Demir 81 ilin hepsinde ilk 30'da.
- Yazıcı yalnız 3 ilin listesinde var. Rize'de 2. sırada; Rize'de her 1.000 kişiden yaklaşık 12'si bu soyadını taşıyor.
- Bazı illerin kendine özgü soyadları: Rize'de Kopuz, Hatay'da Şanverdi, Artvin'de Ustabaş, Trabzon'da Birinci.

## Sınırlar

- TÜİK yalnız her ilin ilk 30 soyadını yayımlıyor. Bir soyadının bir ilde görünmemesi, o soyadının orada hiç olmadığı anlamına gelmez.
- İl, kişinin bugün kayıtlı olduğu yeri gösterir; soyadının köken aldığı yeri göstermez.

## Lisans

Kod Apache-2.0. Harita il sınırları geoBoundaries'ten (CC BY-SA 2.0).
