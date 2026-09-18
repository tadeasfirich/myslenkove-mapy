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

1. **APIs & Services** → **OAuth consent screen**.
2. **User type: External** → **Create**.
3. Vyplň jen povinné:
   - **App name:** `Myšlenkové mapy`
   - **User support email:** tvůj e-mail
   - **Developer contact information:** tvůj e-mail
   → **Save and continue**
4. **Scopes** – nic nepřidávej (aplikace si o oprávnění řekne sama) → **Save and continue**.
5. **Test users** → **Add users** → napiš svůj Gmail (a případně kolegy, kteří to mají
   používat, max. 100) → **Save and continue**.

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

## 4. Bezpečnost

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

## 5. Formát souboru

`*.mapa.json` je obyčejný čitelný JSON. Vedle textu drží i kompletní rozmístění:
souřadnice, šířku a výšku každé buňky, stav rozbalení obsahu, pořadí vykreslení
a přesný posun i přiblížení plátna. Po znovuotevření tedy mapa vypadá naprosto stejně.
Jsou v něm i výchozí vzhledy nových buněk a vazeb pro danou mapu.

Zašifrovaný soubor má stejnou příponu, uvnitř je obálka
`{ "enc":"AES-GCM", "salt":…, "iv":…, "data":… }`.
