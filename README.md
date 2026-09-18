# Myšlenkové mapy

Volné myšlenkové mapy v prohlížeči – buňka má název a volitelný obsah (malý dokument
v Markdownu), vazby mohou vést odkudkoli kamkoli. Celá aplikace je jeden soubor
`index.html`, žádný server, žádná databáze. Mapy se ukládají jako čitelné soubory
`*.mapa.json` – buď do složky v počítači, nebo do složky na Google Disku.

---

## 1. Nahrání na GitHub (bez příkazové řádky)

1. Přihlas se na <https://github.com> (případně si zdarma založ účet).
2. Vpravo nahoře **+** → **New repository**.
   - **Repository name:** `myslenkove-mapy`
   - **Public** (GitHub Pages zdarma potřebuje veřejný repozitář)
   - **Add a README file** nech **vypnuté** – README máme vlastní
   - **Create repository**
3. Na stránce repozitáře klikni **Add file** → **Upload files**.
4. Přetáhni do okna tyhle tři soubory: `index.html`, `config.js`, `README.md`.
5. Dole **Commit changes**.

## 2. Zapnutí GitHub Pages

1. V repozitáři nahoře **Settings** → v levém sloupci **Pages**.
2. **Source:** `Deploy from a branch`
3. **Branch:** `main` a složka `/ (root)` → **Save**.
4. Počkej pár minut (může to trvat i 10) a nahoře se objeví adresa:

   ```
   https://TVOJE-JMENO.github.io/myslenkove-mapy/
   ```

Tuhle adresu si ulož do záložek – na telefonu i v počítači. Aplikace na ní funguje
i bez Disku (mapy si můžeš ukládat do složky v počítači jako dřív).

> Aplikace na GitHubu je veřejná (je to jen program), ale **tvoje mapy tam nejsou** –
> ty jsou na tvém Disku nebo v tvém počítači.

---

## 3. Napojení na Google Disk

Google dovolí přihlášení jen ze stránky na `https://` (proto ten GitHub Pages).
Jednorázově si musíš vyrobit vlastní „ID klienta“ – trvá to asi deset minut.

### 3.1 Projekt a zapnutí Drive API

1. Otevři <https://console.cloud.google.com/> a přihlas se stejným Google účtem.
2. Nahoře vedle loga klikni na výběr projektu → **New project** → název třeba
   `Myslenkove mapy` → **Create**. Počkej, až se projekt vytvoří, a přepni se do něj.
3. Vlevo **APIs & Services** → **Library** → vyhledej **Google Drive API** → **Enable**.

### 3.2 Souhlasná obrazovka

1. **APIs & Services** → **OAuth consent screen** (v novější konzoli se sekce jmenuje
   **Google Auth Platform**).
2. **User type / Audience: External** → **Create**.
3. Vyplň jen povinné:
   - **App name:** `Myšlenkové mapy`
   - **User support email:** tvůj e-mail
   - **Developer contact information:** tvůj e-mail
   → **Save and continue**
4. **Scopes** – nic nepřidávej (aplikace si o oprávnění řekne sama) → **Save and continue**.
5. **!!! Nepřeskakuj !!!** **Test users** → **Add users** → napiš **svůj vlastní Gmail**
   (a případně kolegy, kteří to mají používat, max. 100) → **Save** / **Save and continue**.

   V novější konzoli je to **Google Auth Platform → Audience → Test users → + Add users**.
   Bez tohohle kroku tě Google k vlastní aplikaci nepustí – ani jako majitele projektu.

### 3.3 ID klienta

1. **APIs & Services** → **Credentials** → **Create credentials** → **OAuth client ID**.
2. **Application type:** `Web application`, název třeba `Mapy web`.
3. **Authorized JavaScript origins** → **ADD URI** a vlož **přesně**:

   ```
   https://TVOJE-JMENO.github.io
   ```

   Bez lomítka na konci a **bez** názvu repozitáře – Google tu chce jen adresu serveru.
   (Pokud si aplikaci pouštíš i lokálně přes `http://localhost:8000`, přidej i tuhle adresu.)
4. **Redirect URIs** nech prázdné – nejsou potřeba.
5. **Create** → zkopíruj **Client ID** (končí na `.apps.googleusercontent.com`).

### 3.4 Vložení ID do aplikace

Buď rychle v aplikaci: otevři svoji stránku → **ozubené kolečko** → vlož ID → **Hotovo**.
ID se uloží do prohlížeče (na každém zařízení jednou).

Nebo natrvalo pro všechna zařízení: v repozitáři klikni na `config.js` → tužka
(**Edit this file**) → vlož ID mezi apostrofy → **Commit changes**.

### 3.5 Hotovo

Na stránce klikni **Google Disk** → přihlas se → povol přístup.
Aplikace si na Disku založí složku **Myšlenkové mapy** a od té chvíle do ní ukládá.
Složku můžeš v Disku přesunout kamkoli nebo přejmenovat – aplikace ji pozná podle ID.

Při prvním přihlášení se může objevit hláška, že aplikaci Google neověřil
(**Google hasn't verified this app**). Je to tvoje vlastní aplikace, takže klikni
**Advanced / Rozšířená nastavení** → **Go to … (unsafe)** → a povol přístup.

---

## 4. Když to nejede

### „Přístup zablokován: aplikace … neprošla procesem ověření Googlem“ (chyba 403: access_denied)

Nejčastější případ. Aplikace je v režimu **Testing** a tvůj účet není mezi testery.
Majitel projektu se tam **nepřidá sám od sebe**, musíš se tam napsat ručně:

**Google Cloud console → APIs & Services → OAuth consent screen** (nebo
**Google Auth Platform**) **→ Audience → Test users → + Add users** → vlož
svůj Gmail → **Save**. Pak zavři okno s chybou a v aplikaci klikni na **Google Disk**
znovu. Funguje to okamžitě, nic se nečeká.

Pozor na dvě věci:
- e-mail musí sedět přesně s účtem, kterým se přihlašuješ,
- projekt v Google Cloud musí patřit **témuž účtu** (zkontroluj si v konzoli vpravo
  nahoře, pod kým jsi přihlášený).

Druhá možnost, když to má používat víc lidí nebo nechceš seznam testerů řešit:
ve stejné sekci **Audience** klikni na **Publish app** a potvrď. Naše aplikace si říká
jen o oprávnění `drive.file`, což je u Googlu **non-sensitive** rozsah – ten ověřování
nevyžaduje, takže aplikace v režimu Production funguje běžně dál. Ověření (a bezpečnostní
audit) by Google chtěl, jen kdyby aplikace sahala na celý Disk nebo na Gmail.

### „Nebyl nalezen klient OAuth“ / invalid_client

Vložené **ID klienta** nesouhlasí. Zkopíruj ho v konzoli znovu (Credentials → tvůj
klient) i s koncovkou `.apps.googleusercontent.com`.

### Okno s přihlášením vůbec nevyskočí

Prohlížeč zablokoval vyskakovací okno – povol ho pro svoji adresu a klikni znovu.

### „origin is not allowed“ / přihlášení hned spadne

V **Credentials → tvůj klient → Authorized JavaScript origins** musí být přesně
`https://TVOJE-JMENO.github.io` – tedy **bez** lomítka na konci a **bez** názvu
repozitáře. Změna se občas projeví až za pár minut.

---

## 5. Bezpečnost

- Aplikace si říká o jediné oprávnění **`drive.file`**. To znamená, že vidí **výhradně
  soubory, které sama vytvořila** – ke zbytku tvého Disku se nedostane ani omylem.
- Přihlašovací token žije jen v paměti otevřené záložky. Nikam se neukládá a po
  zavření zmizí. Veškerá komunikace jde přes HTTPS.
- **Client ID není heslo.** Je veřejné z principu a nikomu nedovolí dostat se k tvým
  souborům – přihlásit se musí vždy živý člověk svým Google účtem. Klidně ho nech
  v `config.js` na GitHubu.
- Největší ochranou tvých map je tedy **tvůj Google účet**: zapni si dvoufázové
  ověření a nepřihlašuj se na cizích počítačích.
- Navíc si můžeš v **Nastavení** zapnout **šifrování heslem**. Mapy se pak před
  odesláním zašifrují přímo v prohlížeči (AES-GCM 256, klíč se počítá z hesla přes
  PBKDF2, 210 000 iterací) a na Disku leží jen nečitelná data. Heslo se nikam
  neukládá – **když ho zapomeneš, mapy už nikdo neotevře, ani ty.**

---

## 6. Formát souboru

`*.mapa.json` je obyčejný čitelný JSON. Vedle textu drží i kompletní rozmístění:
souřadnice, šířku a výšku každé buňky, stav rozbalení obsahu, pořadí vykreslení
a přesný posun i přiblížení plátna. Po znovuotevření tedy mapa vypadá naprosto stejně.
Jsou v něm i výchozí vzhledy nových buněk a vazeb pro danou mapu.

Zašifrovaný soubor má stejnou příponu, uvnitř je obálka
`{ "enc":"AES-GCM", "salt":…, "iv":…, "data":… }`.
