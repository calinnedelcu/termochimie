/* =========================================================
   chapters-1.js — lecțiile 1–4 (doar materia din caiet)
   ========================================================= */
(function (g) {
  'use strict';
  var T = g.T, K = T.callout, W = T.W, MQ = T.mq;

  /* ---------------------------------------------------------
     1. Termochimia și noțiunile de bază
     --------------------------------------------------------- */
  T.chapters.push({
    id: 'intro',
    title: 'Termochimia și noțiunile de bază',
    short: 'Efect termic, sistem, mediu, stare, proces',
    lead: 'Reacțiile chimice sunt însoțite de obicei de o modificare a temperaturii sistemului. Termochimia studiază aceste efecte termice — dar mai întâi avem nevoie de câteva noțiuni de bază.',
    sections: [
      {
        id: 'ce', h: 'Ce studiază termochimia?',
        html: function () {
          return '<p>Reacțiile chimice sunt însoțite, de obicei, de o <b>modificare a temperaturii sistemului</b>. Aceste modificări se numesc <b>efecte termice</b>.</p>' +
            K('key', '<b>Termochimia</b> este ramura chimiei care studiază <b>efectele termice ale reacțiilor chimice</b>, pe baza principiilor termodinamicii.', 'Definiție') +
            '<p><b>Efectul termic</b> al unei reacții constă în <b>degajarea</b> sau <b>absorbția</b> de căldură.</p>' +
            MQ('Într-un pahar are loc o reacție și paharul devine cald la atingere. Ce înseamnă asta?',
              ['Reacția absoarbe căldură din mediu', 'Reacția degajă căldură în mediu', 'Reacția nu are efect termic', 'Reacția nu poate avea loc'], 1,
              'Paharul se încălzește pentru că reacția <b>degajă</b> căldură, iar căldura trece în mediu (inclusiv în mâna ta).');
        }
      },
      {
        id: 'sistem', h: 'Sistem și mediu exterior',
        html: function () {
          return K('key', '<b>Sistemul termodinamic</b> = un ansamblu de corpuri/substanțe care pot face schimb de energie între ele sau cu mediul exterior.', 'Definiție') +
            '<p>La o <b>reacție chimică</b>:</p><ul>' +
            '<li><b>sistemul</b> = substanțele participante la reacție <b>+ recipientul</b> în care are loc;</li>' +
            '<li><b>mediul exterior</b> = tot ceea ce se află în afara sistemului.</li></ul>' +
            W('systemEnv') +
            K('warn', 'Recipientul (paharul, eprubeta) <b>face parte din sistem</b>. Aerul din laborator, masa și mâna ta sunt <b>mediu exterior</b>.');
        }
      },
      {
        id: 'stare', h: 'Starea termodinamică și procesul termodinamic',
        html: function () {
          return '<p><b>Starea termodinamică</b> a unui sistem este determinată de proprietățile sale la un moment dat: <b>temperatura</b>, <b>presiunea</b>, <b>volumul</b> etc. Aceste mărimi se numesc <b>parametri de stare</b>.</p>' +
            K('imp', 'Modificarea stării unui sistem ca urmare a <b>interacțiunii cu mediul exterior</b> reprezintă un <b>proces termodinamic</b>.', 'Marcat în caiet') +
            '<p>Exemplu: încălzești apa din pahar de la 20 °C la 80 °C pe o plită. Starea inițială (20 °C) și cea finală (80 °C) diferă prin temperatură, iar trecerea de la una la alta, datorită plitei (mediul exterior), este un proces termodinamic.</p>' +
            MQ('Care dintre următoarele este un parametru de stare?', ['temperatura sistemului', 'numele substanței', 'durata experimentului', 'culoarea paharului'], 0,
              'Parametrii de stare sunt <b>temperatura, presiunea, volumul</b> etc. — proprietățile sistemului la un moment dat.');
        }
      }
    ]
  });

  /* ---------------------------------------------------------
     2. Căldura Q
     --------------------------------------------------------- */
  T.chapters.push({
    id: 'caldura',
    title: 'Căldura (Q)',
    short: 'Semnul lui Q, efectele căldurii, calorie și joule',
    lead: 'Căldura este o formă de energie transferată între corpuri. Semnul ei arată dacă sistemul primește sau cedează căldură — și acolo se greșește cel mai des.',
    sections: [
      {
        id: 'ce', h: 'Ce este căldura?',
        html: function () {
          return K('key', '<b>Căldura</b> ($Q$) este o formă de energie <b>transferată între corpuri aflate la temperaturi diferite</b>.', 'Definiție') +
            K('tip', 'Căldura este energia care <b>trece</b> dintr-un corp în altul — de aceea vorbim mereu de căldură <b>primită</b> sau <b>cedată</b>.');
        }
      },
      {
        id: 'semn', h: 'Semnul lui Q',
        html: function () {
          return '<p>Semnul se alege din punctul de vedere al <b>sistemului</b>:</p>' +
            '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Semn</th><th>Ce face sistemul</th></tr></thead><tbody>' +
            '<tr><td><b class="tag-endo">$Q > 0$</b></td><td>sistemul <b>primește / absoarbe</b> căldură</td></tr>' +
            '<tr><td><b class="tag-exo">$Q < 0$</b></td><td>sistemul <b>cedează</b> căldură mediului</td></tr></tbody></table></div>' +
            W('heatSign') +
            MQ('O ceașcă cu ceai fierbinte se răcește în aer. Ce semn are $Q$ pentru ceai?', ['$Q > 0$', '$Q < 0$', '$Q = 0$', 'Depinde de mărimea cănii'], 1,
              'Ceaiul cedează căldură mediului (aerului), deci $Q < 0$ pentru ceai (sistemul).');
        }
      },
      {
        id: 'efecte', h: 'Ce poate produce căldura primită',
        html: function () {
          return '<p>Căldura primită de un corp poate produce:</p>' +
            '<div class="grid-3">' +
            '<div class="callout tip"><div class="ct">1 · creșterea temperaturii</div><div class="cb">↑ t°</div></div>' +
            '<div class="callout tip"><div class="ct">2 · lucru mecanic</div><div class="cb">efectul unui lucru mecanic</div></div>' +
            '<div class="callout tip"><div class="ct">3 · schimbarea stării</div><div class="cb">schimbarea stării de agregare</div></div></div>' +
            '<p>În simularea de la secțiunea anterioară (Q = căldura schimbată) poți alege și cele trei efecte ale căldurii primite.</p>';
        }
      },
      {
        id: 'unitati', h: 'Unități: joule și calorie',
        html: function () {
          return K('key', '$1 cal ≈ 4,186 J$', 'Reține') +
            '<p>Exemplu de conversie, folosit chiar în problemele din caiet:</p>' +
            '<div class="formula">$256,57 kcal = 256,57 · 10^3 cal ≈ 256,57 · 10^3 · 4,18 J ≈ 1 072 463 J ≈ 1072,5 kJ$</div>' +
            W('calConv') +
            K('warn', 'În caiet, la teorie: $1 cal ≈ 4,186 J$, iar în exercițiul 4/14 se folosește $4,18$ J. Folosește <b>valoarea din enunț</b>.');
        }
      }
    ]
  });

  /* ---------------------------------------------------------
     3. Mărimi calorimetrice
     --------------------------------------------------------- */
  T.chapters.push({
    id: 'marimi',
    title: 'Mărimi calorimetrice',
    short: '$C$, $c$, $c_m$ și $λ$ — definiții, formule, unități',
    lead: 'Patru mărimi leagă căldura de temperatură și de schimbările de stare: capacitatea calorică, căldura specifică, căldura specifică molară și căldura latentă specifică.',
    sections: [
      {
        id: 'cap', h: 'Capacitatea calorică, C',
        html: function () {
          return K('key', 'Cantitatea de căldură necesară pentru a crește temperatura unui <b>corp</b> cu un grad.', 'Definiție') +
            '<div class="formula">$C = (Q)//(ΔT)$ &nbsp;&nbsp;&nbsp; $[C] = J/K$</div>' +
            '<div class="formula">$ΔT = T_f − T_i$</div>' +
            '<p>$T_f$ = temperatura finală, $T_i$ = temperatura inițială. De exemplu, în problema cu apa din caiet: $ΔT = 80 − 20 = 60$ °C.</p>';
        }
      },
      {
        id: 'spec', h: 'Căldura specifică, c',
        html: function () {
          return K('key', 'Cantitatea de căldură necesară pentru a crește temperatura <b>unității de masă</b> dintr-o substanță cu un grad.', 'Definiție') +
            '<div class="formula">$c = (Q)//(m·ΔT)$ &nbsp;&nbsp;⟹&nbsp;&nbsp; $Q = m·c·ΔT$ &nbsp;&nbsp;&nbsp; $[c] = J/(g·K)$</div>' +
            '<p>Exemplu din caiet: pentru apă, $c = 4,184 J/(g·K)$.</p>' +
            W('calcLab') +
            K('tip', '$C$ e pentru <b>un corp</b>, iar $c$ e pentru <b>unitatea de masă</b> dintr-o substanță.');
        }
      },
      {
        id: 'molar', h: 'Căldura specifică molară, $c_m$',
        html: function () {
          return K('key', 'Cantitatea de căldură necesară pentru a crește temperatura unui <b>mol</b> de substanță cu un grad.', 'Definiție') +
            '<div class="formula">$c_m = (Q)//(ν·ΔT)$ &nbsp;&nbsp;&nbsp; $[c_m] = J/(mol·K)$</div>' +
            '<p>Aici $ν$ este numărul de moli.</p>';
        }
      },
      {
        id: 'latenta', h: 'Căldura latentă specifică, λ',
        html: function () {
          return K('key', 'Cantitatea de căldură necesară <b>transformării de stare</b> a unității de masă dintr-o substanță, <b>fără modificarea temperaturii</b>.', 'Definiție') +
            '<div class="formula">$λ = (Q)//(m)$ &nbsp;&nbsp;&nbsp; $[λ] = J/g$</div>' +
            '<p>Se întâlnește la <b>topire</b>, <b>vaporizare</b> și <b>sublimare</b>.</p>' +
            K('warn', 'Uită-te mereu la <b>unitatea</b> lui $λ$: dacă e în <b>J/g</b>, înmulțești cu masa ($Q = m·λ$). În problema cu sodiul din caiet, $λ = 2,6$ <b>kJ/mol</b>, deci se înmulțește cu numărul de moli: $Q = ν·λ$.');
        }
      },
      {
        id: 'legaturi', h: 'Cum alegi formula potrivită',
        html: function () {
          return '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Mărime</th><th>Formulă</th><th>Unitate</th><th>Când o folosești</th></tr></thead><tbody>' +
            '<tr><td>$C$</td><td>$(Q)//(ΔT)$</td><td>J/K</td><td>pentru un corp dat</td></tr>' +
            '<tr><td>$c$</td><td>$(Q)//(m·ΔT)$</td><td>J/(g·K)</td><td>se dă masa; se încălzește / se răcește</td></tr>' +
            '<tr><td>$c_m$</td><td>$(Q)//(ν·ΔT)$</td><td>J/(mol·K)</td><td>se dă numărul de moli</td></tr>' +
            '<tr><td>$λ$</td><td>$(Q)//(m)$</td><td>J/g</td><td>se schimbă starea de agregare (temperatura nu se modifică)</td></tr></tbody></table></div>' +
            K('tip', 'Problema cu sodiul din caiet are două etape: întâi încălzirea sodiului solid, $Q_1 = m·c·ΔT$, apoi topirea lui, $Q_2 = ν·λ$. Căldura totală este $Q = Q_1 + Q_2$.') +
            W('heatingCurve');
        }
      }
    ]
  });

  /* ---------------------------------------------------------
     4. Principiile calorimetriei
     --------------------------------------------------------- */
  T.chapters.push({
    id: 'principii',
    title: 'Principiile calorimetriei',
    short: 'Echilibru termic, egalitatea schimburilor de căldură, procese inverse',
    lead: 'Principiul echilibrului termic, principiul egalității schimburilor de căldură și procesele inverse.',
    sections: [
      {
        id: 'echilibru', h: 'Principiul echilibrului termic',
        html: function () {
          return K('key', 'Dacă mai multe corpuri cu temperaturi diferite sunt puse în contact <b>într-un sistem izolat</b>, după un timp ele ajung la <b>aceeași temperatură</b>.', 'Enunț');
        }
      },
      {
        id: 'egalitate', h: 'Principiul egalității schimburilor de căldură',
        html: function () {
          return K('key', '$Q_{cedată} = Q_{primită}$ &nbsp;&nbsp;sau&nbsp;&nbsp; $Q_1 + Q_2 = 0$', 'Enunț') +
            '<p>Pentru fiecare corp, $Q = m·c·ΔT$ (cu $ΔT = T_f − T_i$); condiția $Q_1 + Q_2 = 0$ le leagă între ele.</p>';
        }
      },
      {
        id: 'inverse', h: 'Procese inverse',
        html: function () {
          return K('imp', 'Cantitatea de căldură <b>absorbită</b> într-o transformare este egală, <b>ca valoare</b>, cu cea <b>degajată</b> în transformarea inversă. Exemplu: <b>topire ↔ solidificare</b>.', 'Marcat în caiet') +
            MQ('Topirea unei cantități de gheață absoarbe 3300 J. Ce căldură se degajă la solidificarea aceleiași cantități (în aceleași condiții)?', ['3300 J (se degajă)', '3300 J (se absoarbe)', 'Nicio căldură', 'Nu se poate afla'], 0,
              'Procese inverse (topire ↔ solidificare) ⟹ aceeași valoare: solidificarea <b>degajă</b> 3300 J.');
        }
      }
    ]
  });
})(window);
