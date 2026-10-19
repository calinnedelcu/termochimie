/* =========================================================
   data-quiz.js — întrebări pe capitole
   t: 'mc' | 'multi' | 'num' | 'match'  ·  a = indexul (indecșii) corect(e)
   ========================================================= */
(function (g) {
  'use strict';
  var Q = g.T.quizData;

  /* ---------- 1. Termochimia și noțiunile de bază ---------- */
  Q.intro = [
    {
      t: 'mc', q: 'La reacția dintre două soluții într-un pahar, care afirmație despre <b>sistem</b> este corectă, conform definiției de la curs?',
      opts: ['Sistemul este doar amestecul de soluții; paharul face parte din mediul exterior.', 'Sistemul este amestecul de substanțe <b>împreună cu paharul</b>; aerul din laborator este mediul exterior.', 'Sistemul este întreg laboratorul, împreună cu tot ce se află în el.', 'Sistemul este paharul, iar soluțiile din el sunt considerate mediul exterior.'],
      a: 1, why: 'La o reacție, sistemul = substanțele participante <b>+ recipientul</b> în care are loc; mediul exterior = tot ce e în afara lui.'
    },
    {
      t: 'mc', q: 'Efectul termic al unei reacții chimice constă în…',
      opts: ['numai încălzirea mediului', 'degajarea sau absorbția de căldură', 'doar schimbarea culorii amestecului', 'variația masei substanțelor'],
      a: 1, why: 'Efectul termic = <b>degajare sau absorbție</b> de căldură. Deci mediul se poate încălzi (reacție care degajă) sau răci (reacție care absoarbe).'
    },
    {
      t: 'multi', q: 'Care dintre mărimile de mai jos sunt <b>parametri de stare</b> ai unui sistem?',
      opts: ['temperatura', 'presiunea', 'volumul', 'căldura primită în timpul unei transformări'],
      a: [0, 1, 2], why: 'T, p, V descriu starea sistemului <b>la un moment dat</b>. Parametrii de stare sunt temperatura, presiunea, volumul etc.'
    },
    {
      t: 'mc', q: 'Un gaz închis într-un cilindru este încălzit și trece de la (20 °C; 1 atm) la (80 °C; 1 atm). Cum se numește trecerea de la o stare la alta?',
      opts: ['stare termodinamică', 'proces termodinamic', 'parametru de stare', 'sistem izolat'],
      a: 1, why: 'Modificarea stării unui sistem ca urmare a interacțiunii cu mediul exterior este un <b>proces termodinamic</b>.'
    },
    {
      t: 'mc', q: 'Un elev scrie: „Dacă o reacție are efect termic, atunci mediul se încălzește.” Ce este greșit?',
      opts: ['Nimic — efectul termic înseamnă întotdeauna încălzirea mediului exterior.', 'Efectul termic poate însemna și <b>absorbție</b> de căldură, nu doar degajare.', 'Efectul termic apare doar în cazul reacțiilor în care participă gaze.', 'Efectul termic al unei reacții nu poate fi măsurat experimental.'],
      a: 1, why: 'Efectul termic constă în degajarea <b>sau</b> absorbția de căldură.'
    },
    {
      t: 'mc', q: 'Apa dintr-un pahar se încălzește pe o plită. Ce reprezintă plita în raport cu sistemul „apa din pahar”?',
      opts: ['Parte din sistem', 'Mediul exterior', 'Parametru de stare', 'Proces termodinamic'],
      a: 1, why: 'Plita nu participă la reacție/proces și nu e recipientul: se află în afara sistemului ⟹ <b>mediu exterior</b>. Prin ea sistemul primește căldură.'
    },
    {
      t: 'match', q: 'Potrivește fiecare element cu locul lui, conform definiției de la curs, pentru o reacție care are loc într-un pahar:',
      pairs: [['substanțele care reacționează', 'sistem'], ['paharul în care are loc reacția', 'sistem'], ['aerul din cameră', 'mediu exterior'], ['mâna care ține paharul', 'mediu exterior']],
      why: 'Sistem = substanțele participante + recipientul. Restul (aer, mâna, masa) = mediu exterior.'
    }
  ];

  /* ---------- 2. Căldura ---------- */
  Q.caldura = [
    {
      t: 'mc', q: 'În timpul topirii gheții la 0 °C, aceasta primește căldură. Care afirmație este corectă?',
      opts: ['$Q > 0$, iar toată căldura primită ridică temperatura gheții peste 0 °C.', '$Q > 0$, iar căldura schimbă starea de agregare, fără ca temperatura să crească.', '$Q < 0$, pentru că gheața se răcește în timp ce se topește la 0 °C.', '$Q = 0$, pentru că temperatura nu se schimbă în timpul topirii.'],
      a: 1, why: 'Gheața <b>primește</b> căldură ($Q > 0$). Căldura primită poate produce și o schimbare de stare, caz în care temperatura rămâne constantă în timpul transformării.'
    },
    { t: 'num', q: 'Convertește $2 kcal$ în kJ (1 cal = 4,186 J).', a: 8.372, unit: 'kJ', tol: 0.01, dec: 3, why: '$2 kcal = 2000 cal$; $2000 · 4,186 = 8372 J = 8,372 kJ$.' },
    {
      t: 'mc', q: 'Care afirmație despre căldură este corectă?',
      opts: ['Este o formă de energie transferată între corpuri aflate la temperaturi diferite.', 'Este temperatura unui corp, măsurată în grade Celsius sau în kelvini.', 'Trece spontan de la corpul rece la cel cald, până se egalează temperaturile.', 'Este o proprietate pe care corpul o „conține”, ca masa sau volumul.'],
      a: 0, why: 'Căldura este o formă de energie <b>transferată între corpuri aflate la temperaturi diferite</b> (nu este temperatura corpului).'
    },
    {
      t: 'multi', q: 'Căldura primită de un corp poate produce:',
      opts: ['creșterea temperaturii', 'efectuarea unui lucru mecanic', 'schimbarea stării de agregare', 'scăderea masei corpului'],
      a: [0, 1, 2], why: 'Cele trei efecte sunt: creșterea temperaturii, lucrul mecanic și schimbarea stării de agregare. Masa nu scade.'
    },
    {
      t: 'mc', q: 'O reacție are loc într-un pahar, iar paharul devine <b>rece</b> la atingere. Pentru sistemul în care are loc reacția, $Q$ este…',
      opts: ['pozitiv: sistemul absoarbe căldură din mediu (din mâna ta)', 'negativ: paharul se răcește, deci cedează căldură', 'zero: mâna nu își schimbă temperatura, deci nu se schimbă căldură', 'nu poate fi stabilit fără a cunoaște reacția exactă care are loc'],
      a: 0, why: 'Paharul se simte rece pentru că <b>îți ia căldură din mână</b>: sistemul primește căldură, deci $Q > 0$ (reacție endotermă). Semnul se judecă mereu pentru sistem.'
    },
    { t: 'num', q: 'Un sistem cedează 450 cal mediului. Cât este $Q$ în J? (1 cal = 4,186 J)', a: -1883.7, unit: 'J', tol: 0.005, dec: 1, why: 'Sistemul <b>cedează</b>, deci $Q < 0$: $Q = −450 · 4,186 = −1883,7 J$.' },
    {
      t: 'mc', q: 'Care dintre egalități este corectă (folosind 1 cal = 4,186 J)?',
      opts: ['1 kcal = 4186 J', '1 kJ = 100 J', '1 cal = 1000 J', '1 J = 4,186 cal'],
      a: 0, why: '$1 kcal = 1000 cal = 1000 · 4,186 J = 4186 J$. Celelalte confundă puterile lui 10 sau sensul conversiei.'
    }
  ];

  /* ---------- 3. Mărimi calorimetrice ---------- */
  Q.marimi = [
    {
      t: 'match', q: 'Potrivește fiecare mărime cu unitatea ei:',
      pairs: [['capacitatea calorică $C$', 'J/K'], ['căldura specifică $c$', 'J/(g·K)'], ['căldura specifică molară $c_m$', 'J/(mol·K)'], ['căldura latentă specifică $λ$', 'J/g']],
      why: '$C = Q/ΔT$ (J/K); $c = Q/(m·ΔT)$ (J/(g·K)); $c_m = Q/(ν·ΔT)$ (J/(mol·K)); $λ = Q/m$ (J/g).'
    },
    { t: 'num', q: 'Câți kJ sunt necesari pentru a încălzi 500 g de apă de la 18 °C la 58 °C? ($c = 4,184 J/(g·K)$)', a: 83.68, unit: 'kJ', tol: 0.01, dec: 2, why: '$ΔT = 58 − 18 = 40 K$; $Q = m·c·ΔT = 500 · 4,184 · 40 = 83 680 J = 83,68 kJ$.' },
    {
      t: 'mc', q: 'În timpul topirii unui metal, la temperatura de topire, căldura primită…',
      opts: ['ridică temperatura metalului, la fel ca înainte de topire', 'schimbă starea de agregare, iar temperatura rămâne constantă', 'se transformă integral în lucru mecanic efectuat de metal', 'este nulă, deoarece metalul nu mai primește căldură'],
      a: 1, why: 'Cât timp are loc topirea, căldura se consumă pentru schimbarea stării ($Q = m·λ$), iar temperatura <b>rămâne constantă</b>.'
    },
    {
      t: 'mc', q: 'Care este definiția <b>capacității calorice</b> $C$?',
      opts: ['Căldura necesară pentru a crește cu un grad temperatura unui <b>corp</b>', 'Căldura necesară pentru a crește cu un grad temperatura <b>unității de masă</b> dintr-o substanță', 'Căldura necesară transformării de stare a unității de masă, fără modificarea temperaturii', 'Căldura necesară pentru a crește cu un grad temperatura unui <b>mol</b> de substanță'],
      a: 0, why: '$C = (Q)//(ΔT)$, în J/K, pentru un corp. Căldura specifică $c$ se referă la unitatea de masă, $c_m$ la un mol, iar $λ$ la transformarea de stare.'
    },
    { t: 'num', q: 'Un corp primește 3 kJ și temperatura lui crește cu 20 K. Care este capacitatea lui calorică?', a: 150, unit: 'J/K', tol: 0.01, dec: 0, why: '$C = (Q)//(ΔT) = (3000 J)//(20 K) = 150 J/K$. Atenție: 3 kJ = 3000 J.' },
    { t: 'num', q: 'Pentru topirea a 25 g de gheață se cunoaște $λ = 334 J/g$. Ce căldură este necesară?', a: 8.35, unit: 'kJ', tol: 0.01, dec: 2, why: '$Q = m·λ = 25 · 334 = 8350 J = 8,35 kJ$.' },
    {
      t: 'num', q: 'Pentru sodiu, căldura latentă de topire molară este $2,6 kJ/mol$ ($M = 23 g/mol$). Ce căldură (kJ) este necesară pentru a topi 46 g de sodiu aflat deja la temperatura de topire?',
      a: 5.2, unit: 'kJ', tol: 0.01, dec: 1, why: 'Căldura latentă este dată <b>pe mol</b>, deci $ν = (46)//(23) = 2$ mol și $Q = ν·λ = 2 · 2,6 = 5,2 kJ$. (Greșeala frecventă: $46 · 2,6$.)'
    },
    {
      t: 'mc', q: 'Încălzești 100 g de aluminiu ($c = 0,90 J/(g·K)$) și 100 g de apă ($c = 4,184 J/(g·K)$) cu aceeași cantitate de căldură. Care își crește mai mult temperatura?',
      opts: ['Aluminiul', 'Apa', 'Se încălzesc la fel, pentru că au aceeași masă', 'Nu se poate spune'],
      a: 0, why: '$ΔT = (Q)//(m·c)$. La același $Q$ și aceeași masă, cel cu $c$ mai mic (aluminiul) se încălzește mai mult.'
    },
    {
      t: 'mc', q: 'Cât este $ΔT$ pentru o încălzire de la 25 °C la 75 °C?',
      opts: ['50 K', '348 K', '−50 K', '100 K'],
      a: 0, why: '$ΔT = T_f − T_i = 75 − 25 = 50$. O diferență de temperatură are aceeași valoare în °C și în K.'
    }
  ];

  /* ---------- 4. Principiile calorimetriei ---------- */
  Q.principii = [
    { t: 'num', q: '200 g de apă la 80 °C se amestecă cu 300 g de apă la 20 °C, într-un sistem izolat. Care este temperatura finală?', a: 44, unit: '°C', tol: 0.01, dec: 1, why: 'Apa caldă cedează, apa rece primește: $Q_1 + Q_2 = 0$, iar $c$ se simplifică: $200·(80 − T_f) = 300·(T_f − 20)$ ⟹ $500·T_f = 22000$ ⟹ $T_f = 44$ °C.' },
    {
      t: 'mc', q: 'Ce exprimă relația $Q_1 + Q_2 = 0$ într-un sistem izolat?',
      opts: ['Căldura cedată (negativă) de un corp este compensată de cea primită (pozitivă) de celălalt.', 'Ambele corpuri își măresc temperatura în timpul schimbului de căldură.', 'Cele două corpuri au întotdeauna aceeași masă și aceeași căldură specifică.', 'Temperatura finală este media aritmetică a celor inițiale, oricare ar fi corpurile.'],
      a: 0, why: 'Cel care cedează are $Q < 0$, cel care primește are $Q > 0$; suma lor este zero.'
    },
    {
      t: 'mc', q: 'Aceeași masă de apă și de fier, ambele la 20 °C, primesc aceeași căldură. Care se încălzește mai mult? ($c_{apă} > c_{fier}$)',
      opts: ['Fierul', 'Apa', 'La fel', 'Depinde de recipient'], a: 0, why: '$ΔT = (Q)//(m·c)$: la $Q$ și $m$ egale, $c$ mai mic ⟹ $ΔT$ mai mare. Fierul se încălzește mai mult.'
    },
    {
      t: 'mc', q: 'Solidificarea unui mol de apă lichidă degajă 6 kJ. Ce căldură absoarbe topirea unui mol de gheață, în aceleași condiții?',
      opts: ['6 kJ', '3 kJ', '12 kJ', 'Nicio căldură'], a: 0, why: 'Procese inverse: cantitatea de căldură absorbită într-o transformare este egală, ca valoare, cu cea degajată în transformarea inversă.'
    },
    {
      t: 'num', q: 'Un vas cu capacitatea calorică $C = 100 J/K$ conține 200 g de apă la 20 °C ($c = 4,18 J/(g·K)$). Se introduce un corp metalic de 100 g aflat la 100 °C și se atinge echilibrul la 25 °C. Care este căldura specifică a metalului?',
      a: 0.624, unit: 'J/(g·K)', tol: 0.02, dec: 3,
      why: 'Primesc căldură apa și vasul: $(m·c + C)·ΔT = (200·4,18 + 100)·5 = 4680 J$. Metalul cedează $100 · c_x · 75$. Egalând: $c_x = (4680)//(7500) = 0,624 J/(g·K)$.'
    },
    {
      t: 'mc', q: 'Vaporizarea unei cantități de apă absoarbe 90 kJ. Ce se întâmplă la condensarea aceleiași cantități de vapori, în aceleași condiții?',
      opts: ['se degajă 90 kJ', 'se absorb 90 kJ', 'se degajă 45 kJ', 'nu are efect termic'], a: 0, why: 'Procese inverse ⟹ aceeași valoare a căldurii: ce se absoarbe într-un sens se degajă în celălalt.'
    }
  ];
  /* ---------- 5. Primul principiu ---------- */
  Q.principiul1 = [
    { t: 'num', q: 'Un gaz primește 800 J sub formă de căldură și efectuează un lucru mecanic de 300 J. Cât este $ΔU$?', a: 500, unit: 'J', tol: 0.01, dec: 0, why: '$ΔU = Q − L = 800 − 300 = 500$ J.' },
    { t: 'num', q: 'Un gaz primește 600 J sub formă de căldură, iar energia lui internă crește cu 450 J. Ce lucru mecanic efectuează gazul?', a: 150, unit: 'J', tol: 0.01, dec: 0, why: '$Q = ΔU + L$ ⟹ $L = Q − ΔU = 600 − 450 = 150$ J.' },
    {
      t: 'mc', q: 'Ce reprezintă $L$ în relația $Q = ΔU + L$?',
      opts: ['lucrul mecanic efectuat', 'variația energiei interne', 'căldura primită de sistem', 'temperatura sistemului'],
      a: 0, why: 'În $Q = ΔU + L$: $Q$ = căldura primită de sistem, $ΔU$ = variația energiei interne, $L$ = lucrul mecanic efectuat.'
    },
    {
      t: 'mc', q: 'Un gaz este încălzit într-un vas rigid, închis ($V = ct.$). Ce afirmație este corectă?',
      opts: ['Căldura primită crește doar energia internă: $Q = ΔU$', 'Gazul efectuează un lucru mecanic mare', 'Energia internă nu se schimbă', 'Căldura primită este egală cu lucrul mecanic'],
      a: 0, why: 'La volum constant nu se efectuează lucru mecanic ($L = 0$), deci toată căldura primită ajunge în energia internă: $Q_V = ΔU$.'
    },
    {
      t: 'mc', q: 'Un gaz primește căldura $Q > 0$, iar energia lui internă nu se modifică ($ΔU = 0$). Ce se întâmplă cu căldura primită?',
      opts: ['Se transformă integral în lucru mecanic ($Q = L$)', 'Se pierde în mediu, fără să afecteze sistemul', 'Crește temperatura gazului, pentru că $ΔU > 0$', 'Se transformă în masă suplimentară a gazului'],
      a: 0, why: 'Din $Q = ΔU + L$ cu $ΔU = 0$ rezultă $Q = L$: toată căldura primită devine lucru mecanic.'
    },
    {
      t: 'mc', q: 'Care afirmație despre energia internă $U$ este corectă?',
      opts: ['Nu poate fi măsurată experimental', 'Se măsoară direct, cu ajutorul unui termometru foarte precis', 'Este întotdeauna egală cu căldura primită de sistem', 'Este întotdeauna egală cu lucrul mecanic efectuat de sistem'],
      a: 0, why: 'În caiet: „U” nu poate fi măsurată experimental (de aceea nici entalpia nu poate fi măsurată direct).'
    }
  ];

  /* ---------- 6. Reacții exoterme și endoterme ---------- */
  Q['exo-endo'] = [
    {
      t: 'mc', q: 'Care dintre ecuații reprezintă o reacție <b>exotermă</b>?',
      opts: ['[[A + B -> C + D + Q]]', '[[A + B + Q -> C + D]]', '[[A + Q -> B]]', '[[2A + Q -> 2B]]'],
      a: 0, why: 'La exoterme căldura este <b>degajată</b> și se scrie în dreapta, lângă produși: $R → P + Q$.'
    },
    {
      t: 'mc', q: 'Într-un pahar se amestecă două soluții, iar temperatura crește de la 20 °C la 27 °C. Reacția este…',
      opts: ['exotermă ($T_f > T_i$)', 'endotermă', 'fără efect termic', 'nu se poate preciza'], a: 0, why: 'Temperatura amestecului crește ⟹ reacția degajă căldură ⟹ exotermă.'
    },
    {
      t: 'mc', q: 'Pentru o reacție exotermă, care afirmație este corectă?',
      opts: ['$Q < 0$ pentru sistem și $ΔH < 0$', '$Q > 0$ pentru sistem și $ΔH < 0$', '$Q < 0$ pentru sistem și $ΔH > 0$', '$Q > 0$ pentru sistem și $ΔH > 0$'],
      a: 0, why: 'Sistemul <b>cedează</b> căldură ⟹ $Q < 0$; iar $Q_P = ΔH$, deci și $ΔH < 0$.'
    },
    {
      t: 'mc', q: 'Reacția $2KClO_3(s) + Q → 2KCl(s) + 3O_2(g)$, dată ca exemplu la curs, este…',
      opts: ['endotermă', 'exotermă', 'o reacție de ardere', 'o reacție de neutralizare'], a: 0, why: '$Q$ apare în stânga (la reactanți): căldura este <b>absorbită</b> ⟹ endotermă.'
    },
    {
      t: 'multi', q: 'Alege procesele <b>endoterme</b>:',
      opts: ['descompunerea cloratului de potasiu (ca în caiet)', 'arderea metanului', 'descompunerea etanului în etenă și hidrogen (Tema 5)', 'neutralizarea NaOH cu H₂SO₄'],
      a: [0, 2], why: 'Reacțiile cu $Q$ la reactanți (care absorb căldură) sunt endoterme: descompunerea cloratului (ca în caiet) și descompunerea etanului. Arderea și neutralizarea degajă căldură (exoterme).'
    },
    {
      t: 'mc', q: 'Reacția $A + B → C + D$ degajă 50 kJ. Reacția inversă $C + D → A + B$…',
      opts: ['absoarbe 50 kJ', 'degajă 50 kJ', 'degajă 100 kJ', 'nu are efect termic'], a: 0, why: 'Procese inverse: aceeași valoare a căldurii, dar sens opus: ce se degajă într-un sens se absoarbe în celălalt.'
    },
    {
      t: 'mc', q: 'Ce descrie corect ecuația $2A + Q → B + C$?',
      opts: ['O reacție endotermă: căldura este absorbită', 'O reacție exotermă: căldura este degajată', 'O reacție fără efect termic', 'O reacție de neutralizare'], a: 0, why: '$Q$ este în stânga ⟹ se absoarbe căldură ⟹ endotermă.'
    }
  ];

  /* ---------- 7. Ecuația termochimică ---------- */
  Q['ec-termo'] = [
    {
      t: 'mc', q: 'Ecuația $C(s) + O_2(g) → CO_2(g) + 393,5 kJ$ arată că…',
      opts: ['la arderea a 1 mol de carbon se degajă 393,5 kJ', 'la arderea unui gram de carbon se degajă 393,5 kJ', 'reacția absoarbe 393,5 kJ', 'se formează 393,5 g de CO₂'],
      a: 0, why: 'Coeficienții înseamnă moli: 1 mol C (12 g) ⟹ 393,5 kJ degajați.'
    },
    { t: 'num', q: 'Ce căldură se degajă la arderea a 36 g de carbon? ($C + O_2 → CO_2 + 393,5 kJ$; $M_C = 12$ g/mol)', a: 1180.5, unit: 'kJ', tol: 0.01, dec: 1, why: '$ν = 36/12 = 3$ mol ⟹ $Q = 3 · 393,5 = 1180,5$ kJ. Sau proporție: 12 g ... 393,5 kJ; 36 g ... x.' },
    { t: 'num', q: '$2Al + Fe_2O_3 → 2Fe + Al_2O_3 + 852 kJ$. Câte grame de aluminiu reacționează când se degajă 213 kJ? ($M_{Al} = 27$ g/mol)', a: 13.5, unit: 'g', tol: 0.01, dec: 1, why: 'Pe ecuație: $2 · 27 = 54$ g Al ... 852 kJ. Pe date: $x$ ... 213 kJ. $x = (54 · 213)//(852) = 13,5$ g.' },
    {
      t: 'match', q: 'Potrivește fiecare notație din ecuația termochimică cu starea de agregare:',
      pairs: [['(s)', 'solid'], ['(l)', 'lichid'], ['(g)', 'gaz'], ['(aq)', 'soluție apoasă']],
      why: 'Stările de agregare trebuie precizate: (s) = solid, (l) = lichid, (g) = gaz, (aq) = soluție apoasă.'
    },
    {
      t: 'mc', q: 'Dacă ecuația termochimică $A + B → C + 80 kJ$ se înmulțește cu 2, căldura din ecuație devine…',
      opts: ['160 kJ', '40 kJ', '80 kJ', '−80 kJ'], a: 0, why: 'Dublezi cantitățile de substanță ⟹ dublezi și căldura: $2A + 2B → 2C + 160$ kJ.'
    },
    { t: 'num', q: '$C_2H_6(g) + 137 kJ → C_2H_4(g) + H_2(g)$. Ce căldură se absoarbe la descompunerea a 112 L de etan, măsurați la c.n.?', a: 685, unit: 'kJ', tol: 0.01, dec: 0, why: '$ν = 112/22,4 = 5$ mol ⟹ $Q = 5 · 137 = 685$ kJ.' },
    {
      t: 'mc', q: 'Reacția inversă reacției $A + B → C + D + 80 kJ$ este…',
      opts: ['$C + D + 80 kJ → A + B$ (endotermă)', '$C + D → A + B + 80 kJ$ (exotermă)', '$C + D → A + B + 40 kJ$', 'imposibilă'], a: 0, why: 'Procese inverse: aceeași căldură ca valoare, dar absorbită în loc de degajată.'
    },
    { t: 'num', q: 'Câtă căldură se degajă la arderea a 3,2 g de metan? ($CH_4 + 2O_2 → CO_2 + 2H_2O(g) + 802$ kJ; $M_{CH_4} = 16$ g/mol)', a: 160.4, unit: 'kJ', tol: 0.01, dec: 1, why: '$ν = 3,2/16 = 0,2$ mol ⟹ $Q = 0,2 · 802 = 160,4$ kJ.' }
  ];

  /* ---------- 8. Legături, schimbări de stare, condiții standard ---------- */
  Q['legaturi-stari'] = [
    {
      t: 'mc', q: 'Care afirmație despre legăturile chimice este corectă?',
      opts: ['Ruperea absoarbe energie, formarea degajă energie', 'Ruperea degajă energie, formarea absoarbe energie', 'Atât ruperea, cât și formarea degajă energie', 'Atât ruperea, cât și formarea absorb energie'],
      a: 0, why: 'Ca să rupi o legătură trebuie să-i dai energie; când se formează o legătură, energia se eliberează.'
    },
    {
      t: 'match', q: 'Potrivește fiecare schimbare de stare cu sensul ei:',
      pairs: [['topire', 'solid → lichid'], ['condensare', 'gaz → lichid'], ['sublimare', 'solid → gaz'], ['desublimare', 'gaz → solid']], why: 'Topire: solid→lichid; vaporizare: lichid→gaz; sublimare: solid→gaz; solidificare: lichid→solid; condensare: gaz→lichid; desublimare: gaz→solid.'
    },
    {
      t: 'multi', q: 'Alege procesele <b>exoterme</b>:',
      opts: ['topirea', 'solidificarea', 'condensarea', 'sublimarea', 'desublimarea'], a: [1, 2, 4], why: 'Topirea, vaporizarea și sublimarea absorb căldură (endoterme). Inversele lor — solidificarea, condensarea, desublimarea — o degajă.'
    },
    {
      t: 'mc', q: 'Condițiile standard sunt…',
      opts: ['$T = 298$ K (25 °C) și $p = 1$ atm', '$T = 298$ K și $p = 0$ atm', '$T = 25$ K și $p = 1$ atm', '$T = 298$ °C și $p = 1$ atm'], a: 0, why: 'Condiții standard (marcate în caiet): 298 K = 25 °C și 1 atm.'
    },
    { t: 'num', q: 'Exprimă temperatura de 37 °C în kelvini.', a: 310, unit: 'K', tol: 0.005, dec: 0, why: '$T(K) = t(°C) + 273 = 37 + 273 = 310$ K.' },
    {
      t: 'mc', q: 'La c.n. (condiții normale: 0 °C și 1 atm), un mol de gaz ocupă (volumul molar $V_m$)…',
      opts: ['22,4 L', '24,5 L', '1 L', '100 L'], a: 0, why: 'În caiet (Tema 5): la c.n. $V_m = 22,4$ L/mol.'
    },
    {
      t: 'mc', q: 'Dăm căldură unei substanțe, dar temperatura ei nu crește. Care este explicația cea mai probabilă?',
      opts: ['Substanța își schimbă starea de agregare (de ex. se topește)', 'Substanța a cedat căldură mediului în timpul procesului', 'Căldura primită s-a transformat în masă suplimentară', 'Căldura nu a ajuns de fapt la substanța respectivă'], a: 0, why: 'În timpul topirii, vaporizării sau sublimării, căldura primită ($Q = m·λ$) schimbă starea, iar temperatura rămâne constantă.'
    }
  ];

  /* ---------- 9. Principiul I la reacții chimice, entalpia ---------- */
  Q.entalpie = [
    { t: 'mc', q: 'La <b>volum constant</b>, căldura schimbată într-o reacție este egală cu…', opts: ['$ΔU$', '$ΔH$', '$pΔV$', '$ΔH − ΔU$'], a: 0, why: 'Dacă $V = ct.$, atunci $pΔV = 0$ și $Q_V = ΔU$.' },
    { t: 'mc', q: 'Entalpia $H$ este definită prin relația…', opts: ['$H = U + pV$', '$H = U − pV$', '$H = Q + L$', '$H = (U)//(pV)$'], a: 0, why: 'Entalpia este suma dintre energia internă și lucrul mecanic pentru ocuparea volumului propriu: $H = U + pV$.' },
    { t: 'mc', q: 'La <b>presiune constantă</b>, căldura de reacție este egală cu…', opts: ['variația de entalpie $ΔH$', 'variația energiei interne $ΔU$', 'lucrul mecanic $pΔV$', 'zero'], a: 0, why: '$Q_P = ΔU + pΔV = Δ(U + pV) = ΔH$.' },
    { t: 'num', q: 'O reacție are, la presiune constantă, $ΔU = −890$ kJ și $pΔV = +2,5$ kJ. Cât este $ΔH$?', a: -887.5, unit: 'kJ', tol: 0.002, dec: 1, why: '$ΔH = ΔU + pΔV = −890 + 2,5 = −887,5$ kJ.' },
    {
      t: 'mc', q: 'De ce se spune că $ΔH$ se determină experimental „indirect”?',
      opts: ['Pentru că nici $H$, nici $U$ nu se pot măsura direct; $ΔH$ se află din căldura de reacție la $p = ct.$', 'Pentru că se calculează doar cu formule, fără ca vreun experiment să fie vreodată necesar', 'Pentru că experimentul trebuie făcut într-un vas închis, unde volumul rămâne constant', 'Pentru că valoarea lui depinde de culoarea și de aspectul substanțelor din amestec'],
      a: 0, why: '$U$ nu poate fi măsurată experimental, deci nici $H = U + pV$. Dar $ΔH = Q_P$ se obține măsurând căldura de reacție.'
    },
    {
      t: 'mc', q: 'O reacție la $p = ct.$ are $ΔH = −120$ kJ și $pΔV > 0$. Valoarea lui $ΔU$ este…',
      opts: ['mai mică decât −120 kJ (mai negativă)', 'mai mare decât −120 kJ (mai puțin negativă)', 'egală cu −120 kJ, pentru că $ΔU = ΔH$', 'pozitivă, pentru că gazele se dilată'], a: 0, why: '$ΔU = ΔH − pΔV$. Dacă $pΔV > 0$, scazi un număr pozitiv din −120 ⟹ $ΔU < −120$ kJ.'
    },
    { t: 'mc', q: 'Relația $Q_V = ΔU$ rezultă din $Q = ΔU + pΔV$ deoarece…', opts: ['la volum constant $ΔV = 0$, deci $pΔV = 0$', 'la volum constant $p = 0$', 'la volum constant $ΔU = 0$', 'la volum constant nu există căldură'], a: 0, why: 'Volumul nu se schimbă ⟹ $ΔV = 0$ ⟹ nu se efectuează lucru de dilatare.' }
  ];

  /* ---------- 10. Diagrame de entalpie ---------- */
  (function () {
    var R = g.T.rng(20240117);
    Q.diagrame = [
      g.T.energyQuestion(R, 'class'),
      g.T.energyQuestion(R, 'segment'),
      g.T.energyQuestion(R, 'dH'),
      g.T.energyQuestion(R, 'Ea'),
      { t: 'mc', q: 'Care dintre relații este corectă pentru o diagramă de entalpie?', opts: ['$ΔH = H_P − H_R$', '$ΔH = H_R − H_P$', '$ΔH = H_{CA}^* − H_R$', '$ΔH = E_a$'], a: 0, why: 'În caiet: $ΔH = H_P − H_R$ (produși − reactanți). Diferența $H_{CA}^* − H_R$ este $E_a$.' },
      { t: 'mc', q: 'Cum se notează diferența dintre entalpia complexului activat și entalpia reactanților, $H_{CA}^* − H_R$?', opts: ['$E_a$, energia de activare', '$ΔH$', '$H_P$', '$Q_P$'], a: 0, why: '$E_a = H_{CA}^* − H_R$: de la nivelul reactanților până la vârful curbei ($CA^*$).' },
      { t: 'mc', q: 'Care este condiția energetică pentru o ciocnire eficientă?', opts: ['Energia ciocnirii să fie cel puțin egală cu energia de prag (de activare), $E_a$', 'Energia ciocnirii să fie mai mică decât $E_a$', 'Energia ciocnirii să fie egală cu $|ΔH|$', 'Moleculele să aibă aceeași masă'], a: 0, why: 'În caiet: ciocnirea trebuie să aibă o valoare cel puțin egală cu „energia de prag” sau „energia de activare” ($E_a$).' },
      { t: 'num', q: 'Pentru o reacție: $H_R = 150$, $H_{CA}^* = 230$, $H_P = 90$ kJ/mol. Cât este $ΔH$?', a: -60, unit: 'kJ/mol', tol: 0.005, dec: 0, why: '$ΔH = H_P − H_R = 90 − 150 = −60$ kJ/mol ⟹ $ΔH < 0$, reacție exotermă. (Iar $E_a = 230 − 150 = 80$ kJ/mol.)' }
    ];
  })();

  /* ---------- 11. Căldura de formare ---------- */
  Q.formare = [
    { t: 'mc', q: 'Căldura de formare $ΔH_f$ se referă la…', opts: ['formarea unui mol de substanță din elemente aflate în stare standard', 'arderea completă a unui mol de substanță în oxigen, în condiții standard', 'descompunerea unui mol de substanță compusă în elementele ei componente', 'formarea oricărei cantități de substanță din orice reactanți'], a: 0, why: 'Definiție: căldura schimbată pentru <b>un mol</b> de substanță formată <b>din elemente</b> în stare standard.' },
    { t: 'mc', q: 'Care dintre substanțe are $ΔH_f = 0$ în starea standard?', opts: ['[[O2(g)]]', '[[CO2(g)]]', '[[H2O(l)]]', '[[CH4(g)]]'], a: 0, why: 'Elementele au $ΔH_f = 0$ (în caiet: $ΔH_f$ elem. = 0, ex. $O_2$).' },
    { t: 'mc', q: 'Substanța A are $ΔH_f = −100$ kJ/mol, iar B are $ΔH_f = −300$ kJ/mol. Care este mai stabilă?', opts: ['Substanța B', 'Substanța A', 'Sunt la fel de stabile', 'Nu se poate spune'], a: 0, why: 'Cu cât $ΔH_f$ este mai mică (mai negativă), cu atât substanța e mai stabilă: −300 < −100.' },
    { t: 'num', q: 'Se dau: $ΔH_f(CH_4) = −74,8$; $ΔH_f(CO_2) = −393,5$; $ΔH_f(H_2O, g) = −241,8$ kJ/mol. Calculează $ΔH$ pentru $CH_4 + 2O_2 → CO_2 + 2H_2O(g)$.', a: -802.3, unit: 'kJ', tol: 0.003, dec: 1, why: '$ΔH = [−393,5 + 2·(−241,8)] − [−74,8 + 2·0] = −877,1 + 74,8 = −802,3$ kJ.' },
    { t: 'num', q: 'Arderea metanului (apă gazoasă) degajă 802,3 kJ/mol. Câtă căldură (în kJ) se degajă la arderea a 5 mol de metan?', a: 4011.5, unit: 'kJ', tol: 0.003, dec: 1, why: '$|Q| = 5 · 802,3 = 4011,5$ kJ.' },
    { t: 'num', q: 'Se dau $ΔH_f(Al_2O_3) = −1676$ și $ΔH_f(Fe_2O_3) = −824$ kJ/mol. Calculează $ΔH$ pentru $2Al + Fe_2O_3 → Al_2O_3 + 2Fe$.', a: -852, unit: 'kJ', tol: 0.003, dec: 0, why: '$ΔH = ΔH_f(Al_2O_3) − ΔH_f(Fe_2O_3) = −1676 − (−824) = −852$ kJ (elementele au $ΔH_f = 0$).' },
    { t: 'mc', q: 'Este $CaCO_3(s) → CaO(s) + CO_2(g)$ o reacție de formare?', opts: ['Nu: pornește dintr-un compus și dă doi produși', 'Da, pentru că în urma reacției se formează oxidul de calciu', 'Da, pentru că în urma reacției se formează dioxid de carbon', 'Da, dar numai dacă reacția are loc la încălzire'], a: 0, why: 'La formare se pornește din <b>elemente</b> și se obține <b>un mol dintr-o singură</b> substanță.' },
    { t: 'num', q: 'Reacția $N_2 + O_2 → 2NO$ are $ΔH = +180,6$ kJ. Cât este $ΔH_f(NO)$?', a: 90.3, unit: 'kJ/mol', tol: 0.005, dec: 1, why: '$ΔH = 2·ΔH_f(NO) − (0 + 0)$ ⟹ $ΔH_f(NO) = 180,6/2 = 90,3$ kJ/mol.' }
  ];

  /* ---------- 12. Legea lui Hess ---------- */
  Q.hess = [
    { t: 'mc', q: 'Legea lui Hess afirmă că…', opts: ['căldura de reacție depinde doar de starea inițială și de cea finală, nu de stările intermediare', 'căldura de reacție depinde de numărul și de tipul etapelor intermediare parcurse', 'căldura de reacție depinde de viteza cu care se desfășoară reacția chimică', 'căldura de reacție este întotdeauna negativă, indiferent de substanțele implicate'], a: 0, why: 'Entalpia e ca o altitudine: contează punctul de plecare și cel de sosire, nu drumul.' },
    { t: 'num', q: '$A → B$ are $ΔH = −50$ kJ, iar $B → C$ are $ΔH = +120$ kJ. Cât este $ΔH$ pentru $A → C$?', a: 70, unit: 'kJ', tol: 0.01, dec: 0, why: '$ΔH = ΔH_1 + ΔH_2 = −50 + 120 = +70$ kJ.' },
    { t: 'num', q: 'Dacă $ΔH(A → B) = +80$ kJ, cât este $ΔH(B → A)$?', a: -80, unit: 'kJ', tol: 0.01, dec: 0, why: 'Ecuația inversată ⟹ $ΔH$ își schimbă semnul: −80 kJ.' },
    { t: 'num', q: 'Pentru $A → B$, $ΔH = −30$ kJ. Cât este $ΔH$ pentru $2A → 2B$?', a: -60, unit: 'kJ', tol: 0.01, dec: 0, why: 'Ecuația înmulțită cu 2 ⟹ $ΔH$ înmulțit cu 2: −60 kJ.' },
    { t: 'num', q: 'Se dau: $C + O_2 → CO_2$, $ΔH = −393,5$ kJ și $CO + 1/2 O_2 → CO_2$, $ΔH = −283$ kJ. Calculează $ΔH$ pentru $C + 1/2 O_2 → CO$.', a: -110.5, unit: 'kJ', tol: 0.005, dec: 1, why: 'Prima ecuație ×1, a doua <b>inversată</b>: $ΔH = −393,5 − (−283) = −110,5$ kJ.' },
    { t: 'mc', q: 'O substanță apare în ecuația țintă la reactanți, dar într-o ecuație dată apare la produși. Ce faci cu ecuația dată?', opts: ['O inversezi (și îi schimbi semnul lui $ΔH$)', 'O lași neschimbată', 'O elimini', 'Îi dublezi $ΔH$-ul fără să schimbi ecuația'], a: 0, why: 'Dacă partea (reactanți/produși) e opusă, inversezi ecuația, iar $ΔH → −ΔH$.' },
    { t: 'num', q: 'Pentru $CO + 2H_2 → CH_3OH(l)$ s-a obținut $ΔH = −128,1$ kJ. Cât este $ΔH$ pentru $2CO + 4H_2 → 2CH_3OH(l)$?', a: -256.2, unit: 'kJ', tol: 0.005, dec: 1, why: 'Ecuația se dublează ⟹ $ΔH = 2 · (−128,1) = −256,2$ kJ.' },
    { t: 'num', q: 'În reacția $CO + 2H_2 → CH_3OH(l)$ ($ΔH = −128,1$ kJ), ce masă de metanol se obține când se degajă 640,5 kJ? ($M = 32$ g/mol)', a: 160, unit: 'g', tol: 0.01, dec: 0, why: '640,5 / 128,1 = 5 mol ⟹ $m = 5 · 32 = 160$ g.' },
    { t: 'mc', q: 'Când adunăm două ecuații termochimice, valorile $ΔH$…', opts: ['se adună', 'se înmulțesc', 'se scad mereu', 'se fac media'], a: 0, why: 'Ecuațiile se adună, iar $ΔH$-urile (cu multiplicatorii aplicați) se adună.' }
  ];

})(window);
