"""TÜİK Nüfus İstatistikleri Portalı → Türkiye ve her il için en çok kullanılan 30 soyadı (2025)."""
import json, time, urllib.parse, urllib.request, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
KOK = Path(__file__).resolve().parent.parent
HAM = KOK / "ham"; HAM.mkdir(exist_ok=True)
UA = "soyadin-nereli (github.com/birtohum/soyadin-nereli)"
IL = json.load(open(KOK / "araclar/il_adlari.json", encoding="utf-8"))
def param(il):
    p = {"ilAdi": il, "yil": "2025", "draw": "1", "start": "0", "length": "300", "search[value]": "", "search[regex]": "false"}
    for i in range(5):
        for k, v in {"data": str(i), "name": "", "searchable": "true", "orderable": "true", "search][value": "", "search][regex": "false"}.items():
            p[f"columns[{i}][{k}]"] = v
    return p
for il in [""] + IL:
    f = HAM / f"soy-{il or 'TR'}.json"
    if f.exists(): continue
    for deneme in range(4):
        try:
            req = urllib.request.Request("https://nip.tuik.gov.tr/Home/IlYilToplamSoyIsimForTable?", data=urllib.parse.urlencode(param(il)).encode(), headers={"User-Agent": UA, "Content-Type": "application/x-www-form-urlencoded"})
            with urllib.request.urlopen(req, timeout=60) as r: d = json.loads(r.read().decode("utf-8"))
            break
        except Exception as e:
            print("hata", il, e, flush=True); time.sleep(10 * (deneme + 1))
    else:
        print("atlandı", il, flush=True); continue
    f.write_text(json.dumps(d, ensure_ascii=False), encoding="utf-8")
    print(il or "TR", d["recordsTotal"], flush=True)
    time.sleep(2)
print("bitti")
