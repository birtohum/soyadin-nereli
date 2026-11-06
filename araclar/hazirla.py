"""ham/soy-*.json → veri/soyadlari.json"""
import json
from collections import Counter
from pathlib import Path
KOK = Path(__file__).resolve().parent.parent
iller = json.load(open(KOK / "../goc-haritasi/veri/goc.json", encoding="utf-8"))["iller"]  # [[kod, AD]]
kod = {ad: k for k, ad in iller}
def oku(f):
    d = json.loads((KOK / "ham" / f).read_text(encoding="utf-8"))["data"]
    return [[r["SoyIsim"], r["Sayi"], r["Sira"]] for r in sorted(d, key=lambda r: (r["Sira"], -r["Sayi"]))]
tr = oku("soy-TR.json")
il = [None] * 81
for ad, k in kod.items():
    il[k - 1] = oku(f"soy-{ad}.json")
kac = Counter(s for l in il for s, _, _ in l)
ozel = []
for l in il:
    aday = sorted(l, key=lambda x: (kac[x[0]], -x[1]))[0]
    ozel.append([aday[0], aday[1], kac[aday[0]]])
json.dump({"tr": tr, "iller": il, "ozel": ozel}, open(KOK / "veri/soyadlari.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print("benzersiz soyadı", len(kac), "| yalnız 1 ilde:", sum(1 for v in kac.values() if v == 1))
print([(iller[i][1], o[0], o[2]) for i, o in enumerate(ozel)][:81])
