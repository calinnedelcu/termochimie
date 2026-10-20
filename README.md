# Termochimie interactivă

Material de studiu interactiv pentru **reacții exoterme și endoterme** (termochimie), făcut din caietul de notițe: lecții cu grafice care pot fi mișcate, probleme cu variații nelimitate, cartonașe, teste generate aleatoriu și o fișă de formule. Teoria din lecții, cartonașe și formule este strict cea din caiet; variațiile și exercițiile folosesc doar noțiunile din caiet (datele noi se dau în enunț).

## Cum îl deschizi

Dublu-clic pe `index.html` (merge direct din fișier, fără server și fără internet).

Dacă vrei un server local:

```bash
python3 -m http.server 8000
# apoi deschide http://localhost:8000
```

## Ce conține

| Secțiune | Ce găsești |
| --- | --- |
| **Lecții (12)** | explicații scurte, ilustrații animate și simulări interactive, mini-verificări, „Reține din lecție” și un quiz la fiecare lecție |
| **Probleme (12 tipuri)** | tipurile 1–7: problemele din caiet, cu enunțul ca în manual, rezolvate pas cu pas + variații la 4 niveluri (ușor / mediu / dificil / foarte greu: amestecuri, reacții cuplate, mărimi cerute „invers”, lanțuri Hess → ΔH_f, identificarea unei hidrocarburi, dehidrogenarea avansată); tipurile 8–12: exerciții pe noțiunile din caiet (model rezolvat + variații), cu numere noi la fiecare apăsare |
| **Cartonașe** | definiții și reguli din caiet, cu repetiție (cele nestăpânite revin mai des) |
| **Test** | întrebări + probleme generate aleatoriu, cronometru opțional, scor și rezolvări |
| **Formule** | toate formulele și regulile pe o pagină (se poate printa) |

Progresul (lecții parcurse, scoruri, cartonașe) se salvează în browser (`localStorage`).

## Structura fișierelor

```
index.html
assets/css/        base.css (teme, layout) · components.css · widgets.css · viz.css (ilustrații și animații)
assets/js/
  core.js          utilitare: numere, notații ($math$ și [[chimie]]), stocare, masă molară
  ui.js            controale, motorul de întrebări, quiz-uri
  svgs.js          diagrama de entalpie (SVG) și alte desene
  viz.js           „trusa” de ilustrații: pahar, termometru, flacără, gheață, atomi, cilindru cu piston, săgeți de căldură
  widgets-*.js     părțile interactive (calorimetrie, reacții, energie, Hess)
  widgets-viz-*.js scenele ilustrate și animate, pe lecții (1–2, 3–4, 5–8, 9–10, 7 + problemele)
  banners.js       câte o ilustrație pentru fiecare lecție și imaginea de pe pagina de start
  recaps.js        „Reține din lecție” (doar ce scrie în caiet)
  chapters-*.js    textul lecțiilor
  data-quiz.js     întrebările de la finalul lecțiilor
  data-cards.js    cartonașele
  problems*.js     generatoarele de probleme (originalul din caiet + variații); problems-hard-1..3.js = nivelul 4, „Foarte greu”. Enunțurile sunt scrise ca în manual (Calculați…, Determinați…, Precizați…, „Alegeți și subliniați varianta corectă”)
  pages.js, app.js pagini, rutare, temă
```

### Notații folosite în texte

- `$ΔH_f = 0$` → formulă matematică (indici cu `_`, exponenți cu `^`, fracții cu `(a)//(b)`)
- `[[2H2 + O2 -> 2H2O(l)]]` → formulă chimică (cifrele devin indici automat; `->` devine →)

### Cum adaugi o lecție, o întrebare sau o problemă

- **Întrebare nouă:** adaugă un obiect în lista capitolului din `assets/js/data-quiz.js` (`t: 'mc' | 'multi' | 'num' | 'match'`).
- **Cartonaș nou:** o linie `C('id-capitol', 'întrebare', 'răspuns');` în `data-cards.js`.
- **Reacție nouă pentru variații:** intrare în `T.RXN` (în `widgets-react.js`) sau în `T.HESS` / `T.HF` (în `widgets-hess.js`).

## Verificare automată

```bash
node tools/verifica-probleme.js
```

Generează mii de variații de probleme și verifică: structura, că toate numerele sunt finite, că nu apar `NaN`/`undefined`, că valorile problemelor din caiet ies exact (67,97 g; 2740 kJ; −128,1 kJ ...) că exercițiile Hess se adună corect la ecuația-țintă, că fiecare instanță de nivel 4 trece o verificare independentă (`check()`), că enunțurile sunt în stilul manualului (fără întrebări informale) și că rezultatele sunt plauzibile (procente sub 100%, apă lichidă sub 100 °C, variante de răspuns diferite).

## Publicare (GitHub Pages)

Site-ul este static: copiază tot conținutul folderului într-un repository și activează *Settings → Pages → Deploy from a branch → main / root*.
