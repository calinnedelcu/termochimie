/* =========================================================
   chapters-3.js — lecțiile 9–12
   ========================================================= */
(function (g) {
  'use strict';
  var T = g.T, K = T.callout, W = T.W, MQ = T.mq;

  /* ---------------------------------------------------------
     9. Principiul I la reacții chimice: Q_V, Q_P, entalpia
     --------------------------------------------------------- */
  T.chapters.push({
    id: 'entalpie',
    title: 'Principiul I la reacții chimice și entalpia',
    short: 'La volum constant $Q_V = ΔU$; la presiune constantă $Q_P = ΔH$',
    lead: 'Căldura unei reacții depinde de condițiile în care o măsori: la volum constant este ΔU, la presiune constantă este ΔH — mărimea pe care o folosim cel mai des.',
    sections: [
      {
        id: 'de-la', h: 'De la Q = ΔU + L la reacții chimice',
        html: function () {
          return '<p>Primul principiu se aplică și reacțiilor chimice. El poate fi exprimat simplu printr-o relație care corelează <b>trei mărimi termodinamice</b>:</p>' +
            '<div class="formula">$Q = ΔU + L$ &nbsp;&nbsp;⟹&nbsp;&nbsp; $Q = ΔU + pΔV$</div>' +
            '<p class="muted">(În caiet, lucrul mecanic apare și ca $ΔL$: este același lucru mecanic efectuat de sistem.)</p>' +
            '<p>La o reacție chimică, singurul lucru mecanic important este cel al <b>variației de volum</b>: dacă reacția produce mai mult gaz decât consumă, sistemul se dilată și „împinge” atmosfera ($pΔV > 0$).</p>' +
            K('tip', 'Rezultă două situații, după ce <b>rămâne constant</b>: volumul sau presiunea. Fiecare dă un rezultat simplu.');
        }
      },
      {
        id: 'v', h: 'Cazul I: volum constant',
        html: function () {
          return '<p>Reacția are loc într-un vas <b>închis și rigid</b>: $V = ct.$ ⟹ $ΔV = 0$ ⟹ $pΔV = 0$.</p>' +
            '<div class="formula">$Q_V = ΔU$</div>' +
            K('key', 'La <b>volum constant</b>, căldura de reacție este egală cu <b>variația energiei interne</b>. (Este expresia principiului I la $V = ct.$)') +
            '<p>Așa se măsoară în practică într-o „bombă calorimetrică”: un vas metalic închis, în care are loc arderea.</p>';
        }
      },
      {
        id: 'p', h: 'Cazul II: presiune constantă — apare entalpia',
        html: function () {
          return '<p>Reacția are loc într-un vas <b>deschis</b>, la presiunea atmosferică: $p = ct.$ Atunci:</p>' +
            '<div class="formula">$Q_P = ΔU + pΔV = Δ(U + pV)$</div>' +
            '<p>Mărimea $U + pV$ are un nume: <b>entalpia</b>, notată $H$. Rezultă:</p>' +
            '<div class="formula">$H = U + pV$ &nbsp;&nbsp;⟹&nbsp;&nbsp; $Q_P = ΔH$</div>' +
            K('key', 'La <b>presiune constantă</b>, căldura de reacție este egală cu <b>variația de entalpie</b>: $Q_P = ΔH$. (Expresia principiului I la $p = ct.$)') +
            W('firstLaw', { mode: 'compare' }) +
            K('tip', 'Multe reacții din laborator au loc în vase deschise, la presiune atmosferică (constantă). De aceea, când spunem „căldura de reacție”, ne referim de obicei la $ΔH$.');
        }
      },
      {
        id: 'ent', h: 'Entalpia',
        html: function () {
          return K('key', '<b>Entalpia</b> este suma dintre energia internă și lucrul mecanic efectuat de sistem pentru a-și ocupa volumul propriu: $H = U + pV$.', 'Definiție') +
            '<ul><li>$H$ <b>nu poate fi măsurată experimental</b> direct, pentru că nici $U$ nu poate fi măsurată.</li>' +
            '<li>Termenul $pV$ este „locul” pe care sistemul trebuie să-l facă în atmosferă pentru a exista; nu îl confunda cu lucrul de dilatare $pΔV$ din reacție.</li>' +
            '<li>$ΔH$ <b>se poate determina</b> experimental, <b>indirect</b>, prin măsurarea / calcularea <b>căldurii de reacție</b>.</li></ul>' +
            '<div class="formula">$Q_P = ΔH$ &nbsp;·&nbsp; căldura de reacție = variația de entalpie</div>' +
            K('warn', '<b>Atenție la semn:</b> în <b>ecuația termochimică</b> scriem cantitatea de căldură (un număr pozitiv, ex. „+ 393,5 kJ”); în formula $Q_P = ΔH$ valoarea are <b>semnul față de sistem</b> (pentru o reacție exotermă, $ΔH = −393,5$ kJ).') +
            '<div class="formula">$ΔH = H_P − H_R$ &nbsp;(produși − reactanți)</div>' +
            '<div class="grid-2"><div class="callout exo"><div class="ct">exotermă</div><div class="cb">$H_P < H_R$ ⟹ $ΔH < 0$</div></div><div class="callout endo"><div class="ct">endotermă</div><div class="cb">$H_P > H_R$ ⟹ $ΔH > 0$</div></div></div>' +
            MQ('Care relație exprimă corect principiul I la presiune constantă?', ['$Q_P = ΔH$', '$Q_P = ΔU$', '$Q_P = pΔV$', '$Q_P = ΔH − ΔU$'], 0,
              '$Q_P = ΔU + pΔV = Δ(U + pV) = ΔH$. La volum constant ar fi $Q_V = ΔU$.');
        }
      }
    ]
  });

  /* ---------------------------------------------------------
     10. Diagrame de entalpie și teoria complexului activat
     --------------------------------------------------------- */
  T.chapters.push({
    id: 'diagrame',
    title: 'Diagrame de entalpie și teoria complexului activat',
    short: 'Cum se citește un grafic de entalpie; $E_a$ și complexul activat',
    lead: 'Graficul entalpiei în funcție de coordonata de reacție arată dintr-o privire dacă reacția e exotermă sau endotermă și cât de înalt este „dealul” peste care trebuie trecut.',
    tone: 'endo',
    sections: [
      {
        id: 'citire', h: 'Cum se citește o diagramă de entalpie',
        html: function () {
          var endo = T.svgs.energy({ HR: 22, HP: 58, HCA: 80 }), exo = T.svgs.energy({ HR: 62, HP: 24, HCA: 86 });
          return '<p>Pe axa verticală este <b>entalpia $H$</b>, pe cea orizontală <b>coordonata de reacție</b> (drumul de la reactanți $R$ la produși $P$). Curba urcă într-un „deal”, apoi coboară la nivelul produșilor.</p>' +
            '<div class="grid-2">' + T.fig(endo, '<b class="tag-endo">Reacție endotermă</b>: $H_P > H_R$ ⟹ $ΔH > 0$') + T.fig(exo, '<b class="tag-exo">Reacție exotermă</b>: $H_P < H_R$ ⟹ $ΔH < 0$') + '</div>' +
            '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Element</th><th>Ce este</th></tr></thead><tbody>' +
            '<tr><td>$H_R$</td><td>entalpia reactanților (nivelul de pornire)</td></tr>' +
            '<tr><td>$H_P$</td><td>entalpia produșilor (nivelul de sosire)</td></tr>' +
            '<tr><td>$H_{CA}^*$</td><td>entalpia <b>complexului activat</b> (vârful „dealului”)</td></tr>' +
            '<tr><td>$E_a$</td><td><b>energia de activare</b>: $E_a = H_{CA}^* − H_R$</td></tr>' +
            '<tr><td>$ΔH$</td><td>variația de entalpie: $ΔH = H_P − H_R$</td></tr></tbody></table></div>' +
            W('energyDiagram') +
            K('warn', '$E_a$ este <b>întotdeauna pozitivă</b> (trebuie urcat „dealul”), indiferent dacă reacția e exotermă sau endotermă. Nu o confunda cu $ΔH$: $ΔH$ spune dacă produșii sunt mai sus sau mai jos decât reactanții, $E_a$ spune cât de înalt este dealul de trecut.');
        }
      },
      {
        id: 'ciocniri', h: 'Teoria ciocnirilor și complexul activat',
        html: function () {
          return '<p>Reacțiile chimice se produc în urma <b>ciocnirilor eficiente</b> ale moleculelor. O ciocnire este <b>eficientă</b> dacă decurge cu <b>ruperea de legături</b>. Pentru aceasta trebuie îndeplinite <b>două condiții</b>:</p>' +
            '<div class="grid-2"><div class="callout key"><div class="ct">1 · condiția energetică</div><div class="cb">Moleculele care se ciocnesc trebuie să aibă o energie cel puțin egală cu un minim numit <b>energie de prag</b> sau <b>energie de activare ($E_a$)</b>.</div></div>' +
            '<div class="callout tip"><div class="ct">2 · condiția geometrică</div><div class="cb">Moleculele trebuie să se ciocnească cu o <b>orientare favorabilă</b>, adică prin zonele care participă la reacție.</div></div></div>' +
            T.fig(T.svgs.orient(), 'Aceeași energie, dar orientări diferite: doar prima ciocnire poate fi eficientă.') +
            '<p><b>Complexul activat</b> ($CA^*$) este starea intermediară, instabilă, cu entalpie maximă pe drumul de reacție: legăturile vechi sunt pe cale să se rupă, iar cele noi încep să se formeze. Din el se poate ajunge fie la produși, fie înapoi la reactanți.</p>' +
            K('tip', 'Imaginează-ți o minge care trebuie să treacă peste un deal ca să ajungă în vale. Dacă n-are destulă energie ($< E_a$), se întoarce. Dacă are destulă ($≥ E_a$), trece — chiar dacă valea de pe cealaltă parte e mai jos (exotermă) sau mai sus (endotermă) decât punctul de pornire.') +
            W('collisionDist') +
            K('key', 'Dacă <b>temperatura crește</b>, mai multe molecule au energia $≥ E_a$ ⟹ mai multe ciocniri eficiente. Chiar și reacțiile <b>exoterme</b> au nevoie de energie de activare (de aceea un chibrit trebuie frecat înainte să ardă).');
        }
      },
      {
        id: 'exersare', h: 'Exersează cu diagrame',
        html: function () {
          return W('diagramQuiz') +
            MQ('Într-o diagramă, nivelul produșilor este mai sus decât nivelul reactanților. Ce știm?', ['Reacția e endotermă, $ΔH > 0$', 'Reacția e exotermă, $ΔH < 0$', 'Reacția are $E_a = 0$', 'Reacția este instantanee'], 0,
              '$ΔH = H_P − H_R > 0$ ⟹ endotermă. Valoarea lui $E_a$ nu depinde de asta.');
        }
      },
      {
        id: 'inversa', h: 'Mai departe: reacția inversă',
        html: function () {
          return T.details('Cum arată diagrama pentru reacția inversă (P → R)?',
            '<p>Același „deal”, parcurs în sens opus. Dacă reacția directă e endotermă, cea inversă e <b>exotermă</b> (aceeași valoare a lui $ΔH$, semn opus). Energia de activare a reacției inverse este înălțimea dealului măsurată de la <b>produși</b>:</p>' +
            '<div class="formula">$E_{a,inversă} = H_{CA}^* − H_P = E_a − ΔH$</div>' +
            '<p>Exemplu: $H_R = 60$, $H_{CA}^* = 150$, $H_P = 100$ kJ/mol ⟹ $E_a = 90$, $ΔH = +40$ (endotermă), $E_{a,inversă} = 150 − 100 = 50$ kJ/mol.</p>');
        }
      }
    ]
  });

  /* ---------------------------------------------------------
     11. Căldura de formare și stabilitatea substanțelor
     --------------------------------------------------------- */
  T.chapters.push({
    id: 'formare',
    title: 'Căldura de formare și stabilitatea substanțelor',
    short: '$ΔH_f$, stabilitate, $ΔH_R = ΣΔH_f(P) − ΣΔH_f(R)$',
    lead: 'Căldura de formare este „cartea de identitate energetică” a unei substanțe. Din ea afli cât de stabilă e substanța și poți calcula căldura oricărei reacții.',
    sections: [
      {
        id: 'def', h: 'Căldura de formare',
        html: function () {
          return K('key', '<b>Căldura de formare</b> ($ΔH_f$) reprezintă cantitatea de căldură schimbată cu exteriorul pentru o reacție de <b>formare a unui mol de substanță din elemente</b> aflate în <b>stare standard</b>.', 'Definiție') +
            '<div class="eqn">[[C(s) + O2(g) -> CO2(g)]] &nbsp; $ΔH_f^{298} = −393,5 kJ/mol$</div>' +
            '<div class="eqn">[[H2(g) + S(s) + 2O2(g) -> H2SO4(l)]] &nbsp; $ΔH_f$</div>' +
            '<p>Se măsoară în <b>J/mol</b> sau <b>kJ/mol</b>, în condiții standard ($298 K$, $1 atm$).</p>' +
            K('warn', 'Nu orice reacție care „formează” ceva este de formare. Trebuie să pornești din <b>elemente</b> și să obții <b>un singur mol dintr-o singură substanță</b>. De exemplu, [[CaCO3 -> CaO + CO2]] <b>nu</b> este o reacție de formare (pleacă dintr-un compus și dă doi produși) — ΔH-ul ei este doar o căldură de reacție.') +
            K('key', '<b>Elementele în stare standard au $ΔH_f = 0$</b> (ex.: [[O2(g)]], [[H2(g)]], [[N2(g)]], [[C(s)]] grafit, [[Fe(s)]]). Pentru ele nu „formezi” nimic.');
        }
      },
      {
        id: 'stab', h: 'Stabilitatea substanțelor',
        html: function () {
          return K('key', 'Cu cât căldura de formare este <b>mai mică</b> (mai negativă), cu atât substanța este <b>mai stabilă</b>.', 'Regulă') +
            '<p>Dacă $ΔH_f < 0$, formarea din elemente este <b>exotermă</b>: substanța are entalpie mai mică decât elementele din care provine și e „mulțumită” unde e. Ca s-o descompui trebuie să-i dai înapoi aceeași căldură.</p>' +
            W('stabilityChart') +
            K('tip', 'Substanțele cu $ΔH_f > 0$ (precum [[C2H2]] sau [[NO]]) au mai multă energie decât elementele din care s-au format: se formează cu absorbție de căldură și <b>tind</b> să se descompună. Cât de repede se descompun depinde de energia de activare: acetilena poate exploda sub presiune, dar NO se descompune foarte lent.');
        }
      },
      {
        id: 'calc', h: 'Căldura de reacție din căldurile de formare',
        html: function () {
          return '<p>Pentru o reacție $aA + bB → cC + dD$:</p>' +
            '<div class="formula">$ΔH_R = Σ ν_P·ΔH_f(produși) − Σ ν_R·ΔH_f(reactanți)$</div>' +
            '<p>Adică: <b>(suma pentru produși) − (suma pentru reactanți)</b>, fiecare termen înmulțit cu <b>coeficientul</b> substanței. Pentru reacția de mai sus: $ΔH_R = [c·ΔH_f(C) + d·ΔH_f(D)] − [a·ΔH_f(A) + b·ΔH_f(B)]$.</p>' +
            K('ex', '<b>Arderea metanului</b> (problema din caiet): $ΔH_f(CO_2) = −393,5$; $ΔH_f(H_2O, g) = −241,8$; $ΔH_f(CH_4) = −74,8$ kJ/mol; $ΔH_f(O_2) = 0$.<div class="formula">$ΔH = [−393,5 + 2·(−241,8)] − [−74,8 + 2·0] = −877,1 + 74,8 = −802,3 kJ$</div>Pentru <b>5 mol</b> de metan: $|Q| = 5 · 802,3 = 4011,5$ kJ degajați.') +
            W('formationCalc') +
            K('why', 'De ce merge formula? Poți imagina reacția în doi pași: reactanții se „desfac” în elemente (ceea ce costă $−ΣΔH_f(R)$) și apoi din elemente se „construiesc” produșii ($+ΣΔH_f(P)$). Căldura nu depinde de drum — este legea lui Hess (lecția 12).') +
            K('tip', 'Verificare surpriză: pentru reacția aluminotermică, $ΔH = ΔH_f(Al_2O_3) − ΔH_f(Fe_2O_3) = −1675,7 − (−824,2) ≈ −851,5$ kJ — adică tocmai cei <b>852 kJ</b> din ecuație! (Elementele [[Al]] și [[Fe]] au $ΔH_f = 0$.)') +
            K('warn', 'Greșeli frecvente: (1) uiți <b>coeficientul</b> ($2H_2O$ ⟹ $2·ΔH_f$); (2) scazi invers (reactanți − produși); (3) uiți că elementele au $ΔH_f = 0$; (4) amesteci starea de agregare (apă lichidă vs gazoasă).');
        }
      }
    ]
  });

  /* ---------------------------------------------------------
     12. Legea lui Hess
     --------------------------------------------------------- */
  T.chapters.push({
    id: 'hess',
    title: 'Legea lui Hess',
    short: 'Căldura de reacție nu depinde de drum; combinarea ecuațiilor',
    lead: 'Dacă nu poți măsura direct căldura unei reacții, o calculezi din alte reacții ale căror călduri le cunoști. Legea lui Hess spune că această combinare este permisă.',
    sections: [
      {
        id: 'enunt', h: 'Enunțul legii',
        html: function () {
          return K('key', 'Căldura de reacție <b>nu depinde de stările intermediare</b> ale procesului, ci <b>doar de starea inițială și de cea finală</b>, dar poate fi calculată ținând cont de etapele intermediare ale procesului.', 'Legea lui Hess') +
            '<div class="formula">$ΔH = ΔH_1 + ΔH_2 + ΔH_3$</div>' +
            W('hessCycle') +
            K('tip', 'Gândește-te la <b>altitudine</b>: diferența dintre baza și vârful unui munte este aceeași, indiferent pe ce potecă urci. Entalpia se comportă la fel: contează de unde pleci și unde ajungi.') +
            K('why', 'De ce ne trebuie? Multe reacții (de exemplu din <b>sinteza organică</b>) nu pot fi măsurate direct. Le „spargem” în etape (reacții mai simple) ale căror călduri se pot măsura experimental, apoi combinăm rezultatele.');
        }
      },
      {
        id: 'reguli', h: 'Regulile de lucru cu ecuațiile',
        html: function () {
          return '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Operația</th><th>Ce se întâmplă cu ecuația</th><th>Ce se întâmplă cu $ΔH$</th></tr></thead><tbody>' +
            '<tr><td><b>Inversare</b></td><td>reactanții și produșii își schimbă locul</td><td>își schimbă <b>semnul</b> ($ΔH → −ΔH$)</td></tr>' +
            '<tr><td><b>Înmulțire cu $k$</b></td><td>toți coeficienții se înmulțesc cu $k$</td><td>se înmulțește cu $k$</td></tr>' +
            '<tr><td><b>Adunare</b></td><td>se adună membru cu membru; ce apare pe ambele părți se simplifică</td><td>se <b>adună</b></td></tr></tbody></table></div>' +
            '<h3>Algoritm</h3><ol>' +
            '<li>Alege din ținta ta câte o substanță care apare <b>într-o singură</b> ecuație dată.</li>' +
            '<li>Compară <b>partea</b> în care e (reactanți / produși): dacă e opusă în țintă ⟹ <b>inversezi</b>.</li>' +
            '<li>Potrivește <b>coeficientul</b> înmulțind ecuația.</li>' +
            '<li>Adună ecuațiile, simplifică și <b>verifică</b> că ai obținut exact ținta.</li>' +
            '<li>Adună (cu aceiași multiplicatori) valorile $ΔH$.</li></ol>';
        }
      },
      {
        id: 'exercitiu', h: 'Exercițiul din caiet (important)',
        html: function () {
          return K('imp', 'Exercițiul marcat „important” în caiet — îl vei întâlni în variații la test.', 'Marcat în caiet · ‼ important') +
            '<div class="prob-card" style="box-shadow:none;margin:12px 0">' +
            '<p>Se dau ecuațiile:</p>' +
            '<p>(1) [[CO(g) + 1/2 O2(g) -> CO2(g)]] &nbsp; $ΔH_1 = −283 kJ$</p>' +
            '<p>(2) [[CH3OH(l) + 3/2 O2(g) -> CO2(g) + 2H2O(l)]] &nbsp; $ΔH_2 = −726,5 kJ$</p>' +
            '<p>(3) [[H2(g) + 1/2 O2(g) -> H2O(l)]] &nbsp; $ΔH_3 = −285,8 kJ$</p>' +
            '<p><b>a)</b> Calculează $ΔH$ pentru reacția [[CO(g) + 2H2(g) -> CH3OH(l)]].</p><p><b>b)</b> Ce masă de metanol ($M = 32$ g/mol) se obține, în această reacție, când se degajă 1281 kJ?</p></div>' +
            T.details('Rezolvare pas cu pas',
              '<div class="step"><span class="sn">1</span><div class="sb-t"><b>CO</b> este în țintă la reactanți și în (1) tot la reactanți ⟹ (1) rămâne <b>așa cum e</b> (×1).</div></div>' +
              '<div class="step"><span class="sn">2</span><div class="sb-t"><b>CH₃OH</b> este în țintă la produși, dar în (2) la reactanți ⟹ <b>inversăm (2)</b>: înmulțim cu (−1).</div></div>' +
              '<div class="step"><span class="sn">3</span><div class="sb-t"><b>H₂</b>: în țintă sunt 2 mol la reactanți, în (3) este 1 mol la reactanți ⟹ <b>înmulțim (3) cu 2</b>.</div></div>' +
              '<div class="step"><span class="sn">4</span><div class="sb-t">Adunăm: $(1) + 2·(3) + (−1)·(2)$:<div class="eqn" style="text-align:left">[[CO + 1/2 O2 + 2H2 + O2 + CO2 + 2H2O -> CO2 + 2H2O + CH3OH + 3/2 O2]]</div>Simplificăm: $CO_2$, $2H_2O$ și $3/2 O_2$ apar pe ambele părți ⟹ rămâne <b>CO + 2H₂ → CH₃OH</b> ✓ (exact ținta).</div></div>' +
              '<div class="step"><span class="sn">5</span><div class="sb-t">$ΔH = ΔH_1 + 2ΔH_3 − ΔH_2 = −283 + 2·(−285,8) − (−726,5) = −283 − 571,6 + 726,5 = <b>−128,1 kJ</b>$. Fiind negativ, reacția este <b>exotermă</b>.</div></div>' +
              '<div class="step final"><span class="sn">6</span><div class="sb-t"><b>b)</b> Pentru 1 mol CH₃OH (32 g) se degajă 128,1 kJ. Pentru $x$ g se degajă 1281 kJ: $x = (32 · 1281)//(128,1) = <b>320 g</b>$.</div></div>', false) +
            W('hessCombiner');
        }
      },
      {
        id: 'formare', h: 'Hess și căldurile de formare',
        html: function () {
          return '<p>Formula $ΔH_R = ΣΔH_f(P) − ΣΔH_f(R)$ din lecția 11 este <b>legea lui Hess</b> aplicată pe un drum special: reactanții se desfac în elemente, apoi din elemente se construiesc produșii. Alegi tu drumul care îți convine; rezultatul e același.</p>' +
            MQ('Pentru $A → B$ avem $ΔH = +80$ kJ. Cât este $ΔH$ pentru $B → A$?', ['−80 kJ', '+80 kJ', '0 kJ', '+160 kJ'], 0, 'Inversarea ecuației schimbă semnul lui $ΔH$: $ΔH(B → A) = −80$ kJ.');
        }
      }
    ]
  });
})(window);
