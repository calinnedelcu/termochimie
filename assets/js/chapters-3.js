/* =========================================================
   chapters-3.js — lecțiile 9–12 (doar materia din caiet)
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
    lead: 'Principiul I aplicat reacțiilor chimice: două cazuri (volum constant și presiune constantă) și apariția entalpiei.',
    sections: [
      {
        id: 'de-la', h: 'Principiul I al termodinamicii aplicat la reacții chimice',
        html: function () {
          return '<p>Poate fi exprimat simplu printr-o relație care corelează <b>3 mărimi termodinamice</b>:</p>' +
            '<div class="formula">$Q = ΔU + L$ &nbsp;&nbsp;⟹&nbsp;&nbsp; $Q = ΔU + pΔV$</div>' +
            K('tip', 'Lucrul mecanic al reacției se scrie $L = pΔV$. Rezultă două cazuri, după ce rămâne constant: <b>volumul</b> ($V = ct.$) sau <b>presiunea</b> ($p = ct.$).');
        }
      },
      {
        id: 'v', h: 'Cazul I: volum constant',
        html: function () {
          return '<p>$V = ct.$ (reacția are loc la volum constant) ⟹ $pΔV = 0$.</p>' +
            '<div class="formula">$Q_V = ΔU$</div>' +
            K('key', 'La <b>volum constant</b>, căldura de reacție este egală cu variația energiei interne: $Q_V = ΔU$ (expresia principiului I la $V = ct.$).');
        }
      },
      {
        id: 'p', h: 'Cazul II: presiune constantă — apare entalpia',
        html: function () {
          return '<p>$p = ct.$ Atunci:</p>' +
            '<div class="formula">$Q = ΔU + Δ(pV)$ &nbsp;&nbsp;⟹&nbsp;&nbsp; $Q_P = Δ(U + pV)$ &nbsp;(<b>entalpie</b>)</div>' +
            '<div class="formula">$Q_P = ΔH$</div>' +
            K('key', 'La <b>presiune constantă</b>, căldura de reacție este egală cu variația de entalpie: $Q_P = ΔH$ (expresia principiului I la $p = ct.$).') +
            W('firstLaw', { mode: 'compare' });
        }
      },
      {
        id: 'ent', h: 'Entalpia',
        html: function () {
          return K('key', '<b>Entalpia</b> este suma dintre energia internă și lucrul mecanic efectuat de sistem pentru a-și ocupa volumul propriu: $H = U + pV$.', 'Definiție') +
            '<ul><li>Entalpia <b>nu poate fi măsurată experimental</b>, deoarece $U$ nu poate fi măsurată experimental.</li>' +
            '<li>$ΔH$ <b>se poate determina</b> experimental, <b>indirect</b>, prin calcularea <b>căldurii de reacție</b>.</li></ul>' +
            '<div class="formula">$Q_P = ΔH$ &nbsp;·&nbsp; căldura de reacție = variația de entalpie</div>' +
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
    lead: 'Graficul entalpiei în funcție de coordonata de reacție (de la reactanți la produși), pentru reacții endoterme și exoterme, cu energia de activare și complexul activat.',
    tone: 'endo',
    sections: [
      {
        id: 'citire', h: 'Cum se citește o diagramă de entalpie',
        html: function () {
          var endo = T.svgs.energy({ HR: 22, HP: 58, HCA: 80 }), exo = T.svgs.energy({ HR: 62, HP: 24, HCA: 86 });
          return '<p>Pe axa verticală este <b>entalpia $H$</b>, pe cea orizontală <b>coordonata de reacție</b> ($R → P$).</p>' +
            '<div class="grid-2">' + T.fig(endo, '<b class="tag-endo">Reacție endotermă</b>: $H_P > H_R$ ⟹ $ΔH > 0$') + T.fig(exo, '<b class="tag-exo">Reacție exotermă</b>: $H_P < H_R$ ⟹ $ΔH < 0$') + '</div>' +
            '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Element</th><th>Ce este</th></tr></thead><tbody>' +
            '<tr><td>$H_R$</td><td>entalpia reactanților</td></tr>' +
            '<tr><td>$H_P$</td><td>entalpia produșilor</td></tr>' +
            '<tr><td>$H_{CA}^*$</td><td>entalpia complexului activat ($CA^*$, vârful curbei)</td></tr>' +
            '<tr><td>$E_a$</td><td>energia de activare: de la $H_R$ până la vârf, $E_a = H_{CA}^* − H_R$</td></tr>' +
            '<tr><td>$ΔH$</td><td>$ΔH = H_P − H_R$</td></tr></tbody></table></div>' +
            '<div class="grid-2"><div class="callout endo"><div class="ct">endotermă</div><div class="cb">$H_P > H_R$ ⟹ $ΔH > 0$</div></div><div class="callout exo"><div class="ct">exotermă</div><div class="cb">$H_P < H_R$ ⟹ $ΔH < 0$</div></div></div>' +
            W('energyDiagram');
        }
      },
      {
        id: 'ciocniri', h: 'Teoria ciocnirilor (teoria complexului activat, $CA^*$)',
        html: function () {
          return K('key', '<b>Energia de activare</b> = minimul necesar pentru ca reacția să aibă loc (<b>prag</b>).') +
            '<p>Reacțiile chimice se produc în urma <b>ciocnirilor eficiente</b> ale moleculelor. O ciocnire este <b>eficientă</b> dacă duce la <b>ruperea de legături</b>, iar pentru aceasta trebuie îndeplinite <b>două condiții</b>:</p>' +
            '<div class="callout key"><div class="ct">1 · condiția energetică</div><div class="cb">Moleculele dau ciocniri eficiente dacă ciocnirea lor are o valoare cel puțin egală cu un minim numit <b>„energie de prag”</b> sau <b>„energie de activare”</b> ($E_a$).</div></div>' +
            K('note', 'Caietul anunță „două condiții”, dar o scrie doar pe prima. Dacă ai notat-o și pe a doua la oră, completeaz-o în caiet — aici nu am pus-o, ca să nu adaug nimic care nu e în caiet.') +
            MQ('Două molecule se ciocnesc cu o energie mai mică decât $E_a$. Condiția energetică este îndeplinită?', ['Da', 'Nu: energia trebuie să fie cel puțin egală cu $E_a$', 'Depinde de $ΔH$', 'Nu se poate stabili'], 1,
              'Ciocnirea este eficientă (energetic) dacă energia ei este cel puțin egală cu energia de prag (de activare), $E_a$.');
        }
      },
      {
        id: 'exersare', h: 'Exersează cu diagrame',
        html: function () {
          return W('diagramQuiz') +
            MQ('Într-o diagramă, nivelul produșilor este mai sus decât nivelul reactanților. Ce știm?', ['Reacția e endotermă, $ΔH > 0$', 'Reacția e exotermă, $ΔH < 0$', 'Reacția are $E_a = 0$', 'Reacția este instantanee'], 0,
              '$ΔH = H_P − H_R > 0$ ⟹ endotermă.');
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
    short: '$ΔH_f$, stabilitate, $ΔH_r = ΣΔH_f(P) − ΣΔH_f(R)$',
    lead: 'Căldura de formare, legătura ei cu stabilitatea substanței și formula prin care se calculează căldura unei reacții.',
    sections: [
      {
        id: 'def', h: 'Căldura de formare',
        html: function () {
          return K('key', '<b>Căldura de formare</b> ($ΔH_f$) reprezintă cantitatea de căldură schimbată cu exteriorul pentru o reacție de <b>formare a unui mol de substanță din elemente</b> aflate în <b>stare standard</b>.', 'Definiție') +
            '<div class="eqn">[[C(s) + O2(g) -> CO2(g)]] &nbsp; $ΔH_f^{298}$ &nbsp;(J/mol)</div>' +
            '<div class="eqn">[[H2(g) + S(s) + 2O2(g) -> H2SO4]] &nbsp; $ΔH_f$</div>' +
            K('note', 'În caiet, la a doua ecuație $O_2$ este scris fără coeficient; pentru $H_2SO_4$ (4 atomi de oxigen) ecuația echilibrată are $2O_2$.', 'Corectură') +
            '<p>Pentru prima reacție, din lecția 7 știm că se degajă 393,5 kJ la 1 mol de $CO_2$ (reacție exotermă, $ΔH < 0$).</p>' +
            K('note', 'Pe pagina din caiet, în margine, apare scris „1 atm, 25 °C” — condițiile standard (lecția 8).') +
            K('note', 'Alături de aceste exemple, în caiet apare și [[CaCO3 -> CaO + CO2]] cu $ΔH$ (nu $ΔH_f$): ea nu pornește din elemente.') +
            K('key', '<b>$ΔH_f$ al elementelor = 0</b> (exemplu din caiet: [[O2]]).');
        }
      },
      {
        id: 'stab', h: 'Stabilitatea substanțelor',
        html: function () {
          return K('key', 'Cu cât căldura de formare este <b>mai mică</b> (sau mai negativă), cu atât substanța este <b>mai stabilă</b>.', 'Regulă') +
            '<p>Caietul adaugă: $ΔH < 0$ ⟹ reacție exotermă.</p>' +
            MQ('Substanța A are $ΔH_f = −300$ kJ/mol, iar substanța B are $ΔH_f = −100$ kJ/mol. Care este mai stabilă?', ['A', 'B', 'Sunt la fel de stabile', 'Nu se poate stabili'], 0,
              'Cu cât $ΔH_f$ este mai mică (mai negativă), cu atât substanța e mai stabilă: −300 < −100 ⟹ A.');
        }
      },
      {
        id: 'calc', h: 'Căldura de reacție din căldurile de formare',
        html: function () {
          return '<p>Pentru o reacție $aA + bB → cC + dD$:</p>' +
            '<div class="formula">$ΔH_r = Σ ν_P·ΔH_f(produși) − Σ ν_R·ΔH_f(reactanți)$</div>' +
            '<p>Suma pentru <b>produși</b> ($C$, $D$) minus suma pentru <b>reactanți</b> ($A$, $B$), fiecare termen înmulțit cu <b>coeficientul</b> ($ν_P$, $ν_R$) substanței.</p>' +
            K('ex', '<b>Problema 8 (ultima pagină din caiet) — arderea a 5 mol de metan:</b> [[CH4(g) + 2O2(g) -> CO2(g) + 2H2O(g)]]<div class="formula">$ΔH = [ΔH_f(CO_2) + 2·ΔH_f(H_2O)] − ΔH_f(CH_4)$</div>($ΔH_f(O_2) = 0$, element.) Apoi $|Q| = 5 · ΔH$.<br>Exemplu numeric (valorile $ΔH_f$ se dau în enunț): $ΔH_f(CO_2) = −393,5$; $ΔH_f(H_2O, g) = −241,8$; $ΔH_f(CH_4) = −74,8$ kJ/mol ⟹ $ΔH = [−393,5 + 2·(−241,8)] − (−74,8) = −802,3$ kJ; pentru 5 mol: $|Q| = 4011,5$ kJ.') +
            W('formationCalc') +
            K('warn', 'Atenție: (1) înmulțește fiecare $ΔH_f$ cu <b>coeficientul</b> din ecuație; (2) <b>produși − reactanți</b> (nu invers); (3) elementele au $ΔH_f = 0$.');
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
    lead: 'Dacă nu poți afla direct căldura unei reacții, o calculezi din alte reacții ale căror călduri le cunoști.',
    sections: [
      {
        id: 'enunt', h: 'Enunțul legii',
        html: function () {
          return K('key', 'Căldura de reacție <b>nu depinde de stările intermediare</b> ale procesului, ci <b>doar de starea finală și de cea inițială</b>, dar poate fi calculată ținând cont de etapele intermediare ale procesului.', 'Legea lui Hess') +
            '<div class="formula">$ΔH = ΔH_1 + ΔH_2 + ΔH_3$</div>' +
            W('hessCycle') +
            K('tip', 'Gândește-te la <b>altitudine</b>: diferența dintre baza și vârful unui munte este aceeași, indiferent pe ce potecă urci. Contează doar de unde pleci și unde ajungi.') +
            K('note', 'În marginea paginii din caiet este o notă greu de citit, de forma: „sinteză organică, reacții …, etape posibil de măsurat experimental”. Verific-o în caiet.');
        }
      },
      {
        id: 'reguli', h: 'Cum combini ecuațiile (ca în exercițiul din caiet)',
        html: function () {
          return '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Operația</th><th>Ce se întâmplă cu ecuația</th><th>Ce se întâmplă cu $ΔH$</th></tr></thead><tbody>' +
            '<tr><td><b>Inversare</b> (înmulțire cu −1)</td><td>reactanții și produșii își schimbă locul</td><td>își schimbă <b>semnul</b></td></tr>' +
            '<tr><td><b>Înmulțire cu $k$</b></td><td>toți coeficienții se înmulțesc cu $k$</td><td>se înmulțește cu $k$</td></tr>' +
            '<tr><td><b>Adunare</b></td><td>se adună ecuațiile; ce apare de ambele părți se simplifică</td><td>se <b>adună</b></td></tr></tbody></table></div>' +
            '<h3>Pașii (dedusi din exercițiul din caiet)</h3><ol>' +
            '<li>Pentru fiecare substanță din reacția cerută, alege o ecuație dată în care apare.</li>' +
            '<li>Dacă e în <b>partea opusă</b> față de reacția cerută, <b>inversezi</b> ecuația.</li>' +
            '<li>Potrivești <b>coeficientul</b> înmulțind ecuația.</li>' +
            '<li>Aduni ecuațiile și simplifici; <b>rescrii reacția</b> la care ai ajuns și verifici că e cea cerută.</li>' +
            '<li>Faci aceleași operații cu valorile $ΔH$: de ex. $ΔH = ΔH_1 + 2ΔH_3 − ΔH_2$.</li>' +
            '<li>Semnul rezultatului: $ΔH > 0$ ⟹ endotermă; $ΔH < 0$ ⟹ exotermă.</li></ol>' +
            MQ('Pentru $A → B$ avem $ΔH = +80$ kJ. Cât este $ΔH$ pentru $B → A$?', ['−80 kJ', '+80 kJ', '0 kJ', '+160 kJ'], 0, 'Inversarea ecuației schimbă semnul lui $ΔH$: $ΔH(B → A) = −80$ kJ.');
        }
      },
      {
        id: 'exercitiu', h: 'Exercițiul din caiet (important)',
        html: function () {
          return K('imp', 'Exercițiul marcat „important” în caiet.', 'Marcat în caiet · ‼ important') +
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
      }
    ]
  });
})(window);
