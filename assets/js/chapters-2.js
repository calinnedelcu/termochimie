/* =========================================================
   chapters-2.js — lecțiile 5–8 (doar materia din caiet)
   ========================================================= */
(function (g) {
  'use strict';
  var T = g.T, K = T.callout, W = T.W, MQ = T.mq;

  /* ---------------------------------------------------------
     5. Primul principiu al termodinamicii
     --------------------------------------------------------- */
  T.chapters.push({
    id: 'principiul1',
    title: 'Primul principiu al termodinamicii',
    short: '$Q = ΔU + L$ — unde se duce căldura primită',
    lead: 'Căldura primită de un sistem se împarte în două: o parte modifică energia internă (ΔU), iar cealaltă este lucrul mecanic efectuat de sistem (L).',
    sections: [
      {
        id: 'enunt', h: 'Enunțul',
        html: function () {
          return '<div class="formula">$Q = ΔU + L$</div>' +
            '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Mărime</th><th>Ce reprezintă</th></tr></thead><tbody>' +
            '<tr><td>$Q$</td><td>căldura <b>primită de sistem</b></td></tr>' +
            '<tr><td>$ΔU$</td><td><b>variația energiei interne</b></td></tr>' +
            '<tr><td>$L$</td><td><b>lucrul mecanic efectuat</b></td></tr></tbody></table></div>' +
            K('key', 'Căldura primită de sistem = variația energiei interne + lucrul mecanic efectuat.', 'Reține') +
            K('tip', 'Imaginează-ți un gaz într-un cilindru cu piston. Îi dai căldură: o parte rămâne în gaz (ΔU), iar o parte este folosită ca gazul să împingă pistonul (L).');
        }
      },
      {
        id: 'sim', h: 'Simulare',
        html: function () {
          return W('firstLaw') +
            MQ('Un gaz primește 500 J sub formă de căldură și efectuează un lucru mecanic de 200 J. Cât este $ΔU$?', ['300 J', '700 J', '−300 J', '100 J'], 0,
              '$ΔU = Q − L = 500 − 200 = 300$ J.') +
            K('note', 'Mai departe, în lecția 9, același principiu este aplicat reacțiilor chimice (la volum constant și la presiune constantă).');
        }
      }
    ]
  });

  /* ---------------------------------------------------------
     6. Reacții exoterme și endoterme
     --------------------------------------------------------- */
  T.chapters.push({
    id: 'exo-endo',
    title: 'Reacții exoterme și endoterme',
    short: 'Căldură degajată sau absorbită, ecuații, exemple',
    lead: 'O reacție fie degajă căldură în mediul exterior (exotermă), fie absoarbe căldură din el (endotermă). Cum le recunoști și unde apare $Q$ în ecuație.',
    tone: 'exo',
    sections: [
      {
        id: 'exo', h: 'Reacții exoterme',
        html: function () {
          return K('exo', 'Reacții la care are loc o <b>degajare de căldură</b>.', 'Definiție') +
            '<div class="eqn exo">[[reactanți -> produși + Q]] &nbsp;,&nbsp; $Q < 0$ (față de sistem)</div>' +
            K('ex', '<b>Neutralizarea</b> (exemplul din caiet):<div class="eqn">[[2NaOH(aq) + H2SO4(aq) -> Na2SO4(aq) + 2H2O(l) + Q]]</div>La amestecarea soluțiilor: <b>$T_f > T_i$</b>.') +
            '<p>Alte reacții exoterme din caiet, în exerciții: arderea metanului, reacția din exercițiul 4/14 (+ 852 kJ), transformarea glucozei în acid piruvic (+ 483 kJ).</p>';
        }
      },
      {
        id: 'endo', h: 'Reacții endoterme',
        html: function () {
          return K('endo', 'Reacții la care are loc o <b>absorbție de căldură din mediul exterior</b>.', 'Definiție') +
            '<div class="eqn endo">[[reactanți + Q -> produși]] &nbsp;,&nbsp; $Q > 0$ (față de sistem)</div>' +
            K('ex', '<b>Descompunerea cloratului de potasiu</b> (exemplul din caiet):<div class="eqn">[[2KClO3(s) + Q -> 2KCl(s) + 3O2(g)]]</div>$Q$ apare la reactanți: reacția <b>absoarbe</b> căldură.') +
            '<p>Altă reacție endotermă din caiet, în exerciții: descompunerea etanului în etenă și hidrogen ($+ 137$ kJ la 1 mol de etan).</p>';
        }
      },
      {
        id: 'semne', h: 'Semnele, pe scurt',
        html: function () {
          return '<div class="tbl-wrap"><table class="tbl"><thead><tr><th></th><th class="c"><span class="tag-exo">Exotermă</span></th><th class="c"><span class="tag-endo">Endotermă</span></th></tr></thead><tbody>' +
            '<tr><td>Ecuația</td><td class="c">$R -> P + Q$</td><td class="c">$R + Q -> P$</td></tr>' +
            '<tr><td>Căldura</td><td class="c">degajată</td><td class="c">absorbită din mediul exterior</td></tr>' +
            '<tr><td>$Q$</td><td class="c">$Q < 0$</td><td class="c">$Q > 0$</td></tr>' +
            '<tr><td>$ΔH$ (lecția 9)</td><td class="c">$ΔH < 0$</td><td class="c">$ΔH > 0$</td></tr></tbody></table></div>' +
            W('exoEndoLab') +
            K('warn', '<b>Capcana semnului.</b> În ecuația termochimică $Q$ apare ca o <b>cantitate</b> de căldură (un număr pozitiv, ex. „+ 393,5 kJ”): la exoterme în dreapta (degajată), la endoterme în stânga (absorbită). Semnul „−” al exotermelor apare când judeci <b>față de sistem</b>: $Q < 0$ și $ΔH < 0$. Nu amesteca cele două moduri de scriere.');
        }
      },
      {
        id: 'sort', h: 'Exersează: exotermă sau endotermă?',
        html: function () {
          return W('sortExoEndo') +
            MQ('Într-o reacție, căldura $Q$ este scrisă în partea stângă a ecuației (alături de reactanți). Ce fel de reacție este?', ['Exotermă', 'Endotermă', 'Nu se poate spune', 'Nu are efect termic'], 1,
              'Forma endotermă este <b>reactanți + Q → produși</b>: reacția absoarbe căldură.');
        }
      }
    ]
  });

  /* ---------------------------------------------------------
     7. Ecuația termochimică și căldura de reacție
     --------------------------------------------------------- */
  T.chapters.push({
    id: 'ec-termo',
    title: 'Ecuația termochimică și căldura de reacție',
    short: 'Cum se scrie, cum se citește, calcule pe ecuație',
    lead: 'O ecuație chimică în care se indică și efectul termic. Citită corect, îți dă proporția cu care rezolvi problemele din caiet.',
    sections: [
      {
        id: 'ce', h: 'Ce este ecuația termochimică?',
        html: function () {
          return K('key', 'În ecuația termochimică se indică și <b>efectul termic $Q$ al reacției</b>.', 'Definiție') +
            '<div class="grid-2"><div class="callout exo"><div class="ct">exotermă</div><div class="cb"><div class="eqn" style="margin:0">[[reactanți -> produși + Q]]</div></div></div>' +
            '<div class="callout endo"><div class="ct">endotermă</div><div class="cb"><div class="eqn" style="margin:0">[[reactanți + Q -> produși]]</div></div></div></div>' +
            '<p>Trebuie să <b>precizezi stările de agregare</b>:</p><div class="chips"><span class="chip">(s) = solid</span><span class="chip">(l) = lichid</span><span class="chip">(g) = gaz</span><span class="chip">(aq) = soluție apoasă</span></div>' +
            K('ex', 'Arderea metanului: <div class="eqn">[[CH4(g) + 2O2(g) -> CO2(g) + 2H2O(g) + Q]]</div>') +
            K('note', 'Căldura poate fi scrisă și de partea reactanților, cu semn schimbat: $A + B -> C + D + Q$ este același lucru cu $A + B − Q -> C + D$ (reacție exotermă, „căldură degajată”). Așa apare în exercițiul 4/14.', 'Două scrieri echivalente');
        }
      },
      {
        id: 'caldura', h: 'Căldura de reacție',
        html: function () {
          return '<p><b>Căldura de reacție</b> este cantitatea de căldură <b>cedată</b> sau <b>absorbită</b>. Se poate exprima în <b>J, kJ, cal, kcal</b>.</p>' +
            K('ex', '<div class="eqn">[[C(s) + O2(g) -> CO2(g) + 393,5 kJ]]</div>Se citește: <b>1 mol</b> de carbon arde cu 1 mol de oxigen și se degajă <b>393,5 kJ</b>.') +
            K('key', '<b>Coeficienții din ecuație înseamnă moli</b>, iar căldura din ecuație se referă exact la cantitățile din ecuație. Pentru alte cantități, căldura se află prin proporție.');
        }
      },
      {
        id: 'cum', h: 'Cum citești o ecuație (exemplul din caiet: exercițiul 4/14)',
        html: function () {
          return '<div class="eqn exo">[[2Al(s) + Fe2O3(s) -> 2Fe(s) + Al2O3(s) + 852 kJ]]</div>' +
            '<p>În caiet: <b>2 mol Al</b> ($2 · 27 = 54$ g Al) ⟷ $852 · 10^3$ J. Deci pentru <b>1 mol Al</b> se degajă $852 / 2 = 426$ kJ.</p>' +
            K('warn', 'Căldura din ecuație (852 kJ) este pentru <b>2 mol de Al</b>, nu pentru unul! Citește întotdeauna coeficienții.');
        }
      },
      {
        id: 'calc', h: 'Calcule pe ecuație (ca în caiet)',
        html: function () {
          return '<ol><li>Scrie <b>ecuația</b> cu căldura ei.</li>' +
            '<li>Pe ecuație: $ν$ mol ($= ν·M$ grame sau $ν·22,4$ L pentru un gaz la c.n.) ⟷ căldura din ecuație.</li>' +
            '<li>Pe date: cantitatea pe care o ai sau o cauți ⟷ $x$.</li>' +
            '<li>Rezolvă proporția.</li></ol>' +
            W('moleScale') +
            W('thermoEq') +
            K('ex', '<b>Ce căldură se degajă la arderea a 36 g de carbon?</b> ($M_C = 12$ g/mol)<br>$ν = (36)//(12) = 3$ mol ⟹ $Q = 3 · 393,5 = 1180,5$ kJ.') +
            K('warn', '<b>Verifică:</b> unitățile ($kJ$ / $J$ / $kcal$ și $g$ / $kg$) și că ai folosit coeficienții din ecuație. La gaze, în caiet: la c.n. $V_m = 22,4$ L/mol.');
        }
      }
    ]
  });

  /* ---------------------------------------------------------
     8. Energia legăturilor, schimbări de stare, condiții standard
     --------------------------------------------------------- */
  T.chapters.push({
    id: 'legaturi-stari',
    title: 'Legături chimice, schimbări de stare, condiții standard',
    short: 'Energia legăturilor; schimbări de stare; 298 K și 1 atm',
    lead: 'Energia legăturilor chimice, efectul termic al schimbărilor de stare și condițiile standard.',
    sections: [
      {
        id: 'leg', h: 'Energia legăturilor chimice',
        html: function () {
          return K('key', '<b>Ruperea</b> unei legături = <b>absorbție</b> de energie.<br><b>Formarea</b> unei legături = <b>degajare</b> de energie.', 'Reține') +
            W('bondsScene') +
            MQ('Ce se întâmplă cu energia când se formează o legătură chimică?', ['Se absoarbe energie', 'Se degajă energie', 'Nu se schimbă energie', 'Depinde de temperatură'], 1, 'Formarea unei legături = degajare de energie; ruperea = absorbție.');
        }
      },
      {
        id: 'stari', h: 'Schimbări de stare, efect termic',
        html: function () {
          return '<div class="grid-2">' +
            '<div class="callout endo"><div class="ct">necesită absorbție de căldură (endoterme)</div><div class="cb"><b>topire, vaporizare, sublimare</b></div></div>' +
            '<div class="callout exo"><div class="ct">degajă căldură (exoterme)</div><div class="cb"><b>solidificare, condensare, desublimare</b></div></div></div>' +
            W('stateWheel') +
            K('key', 'Procesele din coloana a doua sunt <b>inversele</b> celor din prima (topire ↔ solidificare, vaporizare ↔ condensare, sublimare ↔ desublimare), deci degajă exact căldura pe care cele directe o absorb (lecția 4: procese inverse).');
        }
      },
      {
        id: 'cond', h: 'Condiții standard',
        html: function () {
          return K('imp', 'Condiții standard: &nbsp;<b>$T = 298 K = 25 °C$</b> &nbsp;și&nbsp; <b>$p = 1 atm$</b>.', 'Marcat în caiet') +
            '<p>Notația $ΔH_f^{298}$ din lecția 11 se referă la aceste condiții. Legătura dintre scări: $T(K) = t(°C) + 273$.</p>' +
            K('note', 'La problemele cu volume de gaze, caietul folosește <b>c.n.</b>: $V_m = 22,4$ L/mol (Tema 5).') +
            MQ('Cât este $T = 298$ K în grade Celsius?', ['25 °C', '571 °C', '−25 °C', '0 °C'], 0, '$t(°C) = T(K) − 273 = 298 − 273 = 25$ °C (ca în caiet: $298 K = 25 °C$).');
        }
      }
    ]
  });
})(window);
