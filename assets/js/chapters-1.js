/* =========================================================
   chapters-1.js — lecțiile 1–4
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
    lead: 'Reacțiile chimice încălzesc sau răcesc mediul din jur. Termochimia studiază exact aceste efecte termice — dar mai întâi avem nevoie de câteva cuvinte de bază.',
    sections: [
      {
        id: 'ce', h: 'Ce studiază termochimia?',
        html: function () {
          return '<p>Când amesteci două substanțe și paharul se încălzește (sau se răcește), nu e o întâmplare: reacțiile chimice sunt însoțite, de obicei, de o <b>modificare a temperaturii sistemului</b>. Aceste modificări se numesc <b>efecte termice</b>.</p>' +
            K('key', '<b>Termochimia</b> este ramura chimiei care studiază <b>efectele termice ale reacțiilor chimice</b>, pe baza principiilor termodinamicii.', 'Definiție') +
            '<p><b>Efectul termic</b> al unei reacții constă în <b>degajarea</b> sau <b>absorbția</b> de căldură.</p>' +
            K('tip', 'Termochimia răspunde la o singură întrebare: <b>câtă căldură iese sau intră</b> atunci când are loc reacția? Tot restul lecțiilor sunt unelte pentru a răspunde la ea.') +
            MQ('Într-un pahar are loc o reacție și paharul devine cald la atingere. Ce înseamnă asta?',
              ['Reacția absoarbe căldură din mediu', 'Reacția degajă căldură în mediu', 'Reacția nu are efect termic', 'Reacția nu poate avea loc'], 1,
              'Paharul se încălzește pentru că reacția <b>degajă</b> căldură, iar căldura trece în mediu (inclusiv în mâna ta).');
        }
      },
      {
        id: 'sistem', h: 'Sistem și mediu exterior',
        html: function () {
          return '<p>Ca să vorbim despre căldură, trebuie să stabilim <b>ce anume studiem</b> și <b>ce rămâne în afară</b>.</p>' +
            K('key', '<b>Sistemul termodinamic</b> = un ansamblu de corpuri/substanțe care pot face schimb de energie între ele sau cu mediul exterior.', 'Definiție') +
            '<p>La o <b>reacție chimică</b>:</p><ul>' +
            '<li><b>sistemul</b> = substanțele participante la reacție <b>+ recipientul</b> în care are loc;</li>' +
            '<li><b>mediul exterior</b> = tot ceea ce se află în afara sistemului.</li></ul>' +
            W('systemEnv') +
            K('warn', 'Prin convenție (ca în definiția de la curs), recipientul (paharul, eprubeta) <b>face parte din sistem</b>. Aerul din laborator, masa și mâna ta sunt <b>mediu exterior</b>. La test se întreabă des exact asta.');
        }
      },
      {
        id: 'stare', h: 'Starea termodinamică și procesul termodinamic',
        html: function () {
          return '<p><b>Starea termodinamică</b> a unui sistem este determinată de proprietățile sale la un moment dat: <b>temperatura</b>, <b>presiunea</b>, <b>volumul</b> etc. Aceste mărimi se numesc <b>parametri de stare</b>.</p>' +
            K('tip', 'Gândește-te la starea sistemului ca la o <b>fotografie</b> (T, p, V). Procesul este <b>filmul</b> dintre două fotografii.') +
            K('imp', 'Modificarea stării unui sistem ca urmare a <b>interacțiunii cu mediul exterior</b> reprezintă un <b>proces termodinamic</b>.', 'Marcat în caiet') +
            '<p>Exemplu: încălzești apa din pahar de la 20 °C la 80 °C pe o plită. Starea inițială (20 °C) și cea finală (80 °C) diferă prin temperatură, iar trecerea de la una la alta, datorită plitei (mediul exterior), este un proces termodinamic.</p>' +
            MQ('Care dintre următoarele este un parametru de stare?', ['temperatura sistemului', 'căldura primită într-o transformare', 'numele substanței', 'durata experimentului'], 0,
              'Parametrii de stare descriu sistemul <b>la un moment dat</b> (T, p, V). Căldura primită descrie o <b>transformare</b> (un transfer), nu starea la un moment dat.');
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
    lead: 'Căldura este energie în tranzit. Semnul ei arată încotro merge — iar semnul este locul unde se greșește cel mai des.',
    sections: [
      {
        id: 'ce', h: 'Ce este căldura?',
        html: function () {
          return K('key', '<b>Căldura</b> ($Q$) este o formă de energie <b>transferată între corpuri aflate la temperaturi diferite</b>.', 'Definiție') +
            '<p>Căldura trece de la corpul mai cald la cel mai rece, până când temperaturile se egalează.</p>' +
            K('tip', 'Căldura nu este o proprietate pe care un corp o „conține”. Este energia care <b>trece</b> dintr-un corp în altul. De aceea vorbim mereu de căldură <b>primită</b> sau <b>cedată</b>.');
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
            K('warn', 'Semnul se judecă <b>pentru sistem</b>, nu pentru mediu. Dacă un corp se răcește, el <b>cedează</b> căldură: $Q < 0$ pentru el. Mediul, în același timp, primește aceeași cantitate de căldură.') +
            MQ('O ceașcă cu ceai fierbinte se răcește în aer. Ce semn are $Q$ pentru ceai?', ['$Q > 0$', '$Q < 0$', '$Q = 0$', 'Depinde de mărimea cănii'], 1,
              'Ceaiul cedează căldură mediului (aerului), deci $Q < 0$ pentru ceai (sistemul).');
        }
      },
      {
        id: 'efecte', h: 'Ce poate produce căldura primită',
        html: function () {
          return '<p>Căldura primită de un corp poate produce <b>trei lucruri</b> (uneori împreună):</p>' +
            '<div class="grid-3">' +
            '<div class="callout tip"><div class="ct">1 · creșterea temperaturii</div><div class="cb">Apa pusă pe foc se încălzește.</div></div>' +
            '<div class="callout tip"><div class="ct">2 · lucru mecanic</div><div class="cb">Un gaz încălzit se dilată și împinge un piston.</div></div>' +
            '<div class="callout tip"><div class="ct">3 · schimbarea stării</div><div class="cb">Gheața primește căldură și se topește.</div></div></div>' +
            '<p>În simularea de la secțiunea anterioară poți comuta între cele trei efecte. Atenție: <b>în timpul unei schimbări de stare temperatura rămâne constantă</b> — vei vedea de ce în lecția despre căldura latentă.</p>';
        }
      },
      {
        id: 'unitati', h: 'Unități: joule și calorie',
        html: function () {
          return K('key', '$1 cal ≈ 4,186 J$ &nbsp;·&nbsp; $1 kJ = 1000 J$ &nbsp;·&nbsp; $1 kcal = 1000 cal$', 'Reține') +
            '<p>Căldura se măsoară în <b>J</b> (unitatea SI), <b>kJ</b>, <b>cal</b> sau <b>kcal</b>. Exemplu de conversie, folosit chiar în problemele din caiet:</p>' +
            '<div class="formula">$256,57 kcal = 256 570 cal ≈ 256 570 · 4,18 J ≈ 1 072 000 J ≈ 1072 kJ$</div>' +
            W('calConv') +
            K('warn', 'În probleme apare uneori $4,18$, alteori $4,184$ sau $4,186$ J pentru o calorie. Folosește <b>valoarea din enunț</b>. Diferențele sunt mici, dar contează la rotunjire.');
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
    short: '$C$, $c$, $C_m$ și $λ$ — definiții, formule, unități',
    lead: 'Patru mărimi leagă căldura de temperatură și de schimbările de stare. Cele mai multe probleme din test folosesc una dintre ele.',
    sections: [
      {
        id: 'cap', h: 'Capacitatea calorică, C',
        html: function () {
          return K('key', 'Cantitatea de căldură necesară pentru a crește temperatura unui <b>corp</b> cu un grad.', 'Definiție') +
            '<div class="formula">$C = (Q)//(ΔT)$ &nbsp;&nbsp;&nbsp; $[C] = J/K$</div>' +
            '<div class="formula">$ΔT = T_f − T_i$</div>' +
            '<p>$T_f$ = temperatura finală, $T_i$ = temperatura inițială.</p>' +
            K('tip', '$ΔT$ este o <b>diferență</b> de temperaturi, deci are aceeași valoare în °C și în K: încălzirea de la 20 °C la 80 °C înseamnă $ΔT = 60 K = 60 °C$. Nu trebuie să convertești în kelvini când ai doar diferențe.');
        }
      },
      {
        id: 'spec', h: 'Căldura specifică, c',
        html: function () {
          return K('key', 'Cantitatea de căldură necesară pentru a crește temperatura <b>unității de masă</b> dintr-o substanță cu un grad.', 'Definiție') +
            '<div class="formula">$c = (Q)//(m·ΔT)$ &nbsp;&nbsp;⟹&nbsp;&nbsp; $Q = m·c·ΔT$ &nbsp;&nbsp;&nbsp; $[c] = J/(g·K)$</div>' +
            '<p>Exemplu: pentru apă, $c = 4,184 J/(g·K)$ — adică 1 g de apă încălzit cu 1 K primește 4,184 J.</p>' +
            W('calcLab') +
            K('tip', 'Diferența dintre <b>C</b> și <b>c</b>: $C$ e pentru <b>un corp întreg</b> (depinde de masă), $c$ e pentru <b>o substanță</b> (pe gram). Legătura: $C = m·c$.');
        }
      },
      {
        id: 'molar', h: 'Căldura specifică molară, $C_m$',
        html: function () {
          return K('key', 'Cantitatea de căldură necesară pentru a crește temperatura unui <b>mol</b> de substanță cu un grad.', 'Definiție') +
            '<div class="formula">$C_m = (Q)//(ν·ΔT)$ &nbsp;&nbsp;&nbsp; $[C_m] = J/(mol·K)$</div>' +
            '<p>Aici $ν$ este numărul de moli. Legătura cu căldura specifică: $C_m = M·c$ (masa molară înmulțită cu căldura pe gram).</p>';
        }
      },
      {
        id: 'latenta', h: 'Căldura latentă specifică, λ',
        html: function () {
          return K('key', 'Cantitatea de căldură necesară <b>transformării de stare</b> a unității de masă dintr-o substanță, <b>fără modificarea temperaturii</b>.', 'Definiție') +
            '<div class="formula">$λ = (Q)//(m)$ &nbsp;&nbsp;&nbsp; $[λ] = J/g$</div>' +
            '<p>Se întâlnește la <b>topire</b>, <b>vaporizare</b> și <b>sublimare</b>. Cât timp substanța își schimbă starea, căldura primită nu ridică temperatura: ea învinge forțele de atracție dintre particule.</p>' +
            W('heatingCurve') +
            K('warn', 'Uită-te mereu la <b>unitatea</b> căldurii latente: dacă e în <b>J/g</b> ($λ$), înmulțești cu masa ($Q = m·λ$); dacă e în <b>kJ/mol</b> (căldura latentă <b>molară</b>, notată adesea tot $λ$), înmulțești cu numărul de moli ($Q = ν·λ$). Problema cu sodiul din caiet are $λ = 2,6$ kJ/mol, deci pe mol.');
        }
      },
      {
        id: 'legaturi', h: 'Cum alegi formula potrivită',
        html: function () {
          return '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Mărime</th><th>Formulă</th><th>Unitate</th><th>Când o folosești</th></tr></thead><tbody>' +
            '<tr><td>$C$</td><td>$(Q)//(ΔT)$</td><td>J/K</td><td>pentru un corp dat (nu se cunoaște substanța)</td></tr>' +
            '<tr><td>$c$</td><td>$(Q)//(m·ΔT)$</td><td>J/(g·K)</td><td>se dă masa; se încălzește / răcește</td></tr>' +
            '<tr><td>$C_m$</td><td>$(Q)//(ν·ΔT)$</td><td>J/(mol·K)</td><td>se dă numărul de moli</td></tr>' +
            '<tr><td>$λ$</td><td>$(Q)//(m)$</td><td>J/g</td><td>se schimbă starea; se dă pe gram</td></tr><tr><td>$λ_m$</td><td>$(Q)//(ν)$</td><td>kJ/mol</td><td>se schimbă starea; se dă pe mol (în caiet apare tot cu $λ$)</td></tr></tbody></table></div>' +
            K('key', '$Q = C·ΔT = m·c·ΔT = ν·C_m·ΔT$ &nbsp;(când se schimbă temperatura) &nbsp;·&nbsp; $Q = m·λ$ sau $ν·λ$ &nbsp;(când se schimbă starea)') +
            K('tip', 'Dacă în problemă încălzești o substanță <b>până la topire</b> și apoi o <b>topești</b>, calculezi <b>două călduri, pe etape</b>, și le aduni: întâi $Q_1 = m·c·ΔT$ (până la temperatura de topire), apoi $Q_2 = ν·λ$ (la temperatură constantă). Exact așa e problema cu sodiul.');
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
    lead: 'Două reguli simple rezolvă toate problemele de amestecare: tot ce cedează un corp, primește altul — iar procesele inverse schimbă aceeași căldură.',
    sections: [
      {
        id: 'echilibru', h: 'Principiul echilibrului termic',
        html: function () {
          return K('key', 'Dacă mai multe corpuri cu temperaturi diferite sunt puse în contact <b>într-un sistem izolat</b>, după un timp ele ajung la <b>aceeași temperatură</b>.', 'Enunț') +
            '<p>„Sistem izolat” înseamnă că nu schimbă căldură cu exteriorul: toată căldura rămâne între corpurile din sistem. Exemplu: laptele rece turnat în ceaiul fierbinte, într-un termos.</p>';
        }
      },
      {
        id: 'egalitate', h: 'Principiul egalității schimburilor de căldură',
        html: function () {
          return K('key', '$Q_{cedată} = Q_{primită}$ &nbsp;&nbsp;sau&nbsp;&nbsp; $Q_1 + Q_2 = 0$', 'Enunț') +
            '<p>Cele două scrieri spun același lucru: în prima, căldurile sunt luate <b>în modul</b> (valori pozitive); în a doua, <b>cu semn</b> — cel care cedează are $Q < 0$, cel care primește are $Q > 0$, iar suma lor e zero.</p>' +
            '<h3>Cum rezolvi o problemă de amestecare</h3><ol>' +
            '<li>Alege <b>temperatura finală</b> $T_f$ ca necunoscută.</li>' +
            '<li>Pentru fiecare corp scrie $Q_i = m_i·c_i·(T_f − T_i)$.</li>' +
            '<li>Pune condiția $Q_1 + Q_2 = 0$ și rezolvă ecuația.</li>' +
            '<li><b>Verifică:</b> $T_f$ trebuie să fie între cele două temperaturi inițiale.</li></ol>' +
            '<div class="formula">$m_1 c_1 (T_f − T_1) + m_2 c_2 (T_f − T_2) = 0$ &nbsp;⟹&nbsp; $T_f = (m_1 c_1 T_1 + m_2 c_2 T_2)//(m_1 c_1 + m_2 c_2)$</div>' +
            W('mixing') +
            K('tip', 'Dacă substanța e aceeași ($c_1 = c_2$), $c$ se simplifică: $T_f = (m_1 T_1 + m_2 T_2)//(m_1 + m_2)$. La mase egale, $T_f$ este chiar <b>media</b> temperaturilor.') +
            MQ('Amesteci 100 g de apă la 80 °C cu 100 g de apă la 20 °C, într-un sistem izolat. Care este temperatura finală?', ['50 °C', '60 °C', '40 °C', '100 °C'], 0,
              'Mase egale, aceeași substanță ⟹ media: $(80 + 20)//(2) = 50$ °C.');
        }
      },
      {
        id: 'inverse', h: 'Procese inverse',
        html: function () {
          return K('imp', 'Cantitatea de căldură <b>absorbită</b> într-o transformare este egală, <b>ca valoare</b>, cu cea <b>degajată</b> în transformarea inversă. Exemplu: <b>topire ↔ solidificare</b>.', 'Marcat în caiet') +
            '<p>Dacă topirea unui mol de gheață absoarbe, să zicem, 6 kJ, atunci solidificarea unui mol de apă degajă tot 6 kJ. Căldurile au <b>aceeași valoare</b>, dar <b>semne opuse</b> (una absorbită, alta degajată).</p>' +
            '<p>Aceeași idee e valabilă la reacții chimice: dacă $A + B → C + D$ degajă $Q$, atunci reacția inversă $C + D → A + B$ <b>absoarbe</b> exact $Q$. Vei folosi asta în legea lui Hess (<i>inversezi ecuația ⟹ schimbi semnul lui ΔH</i>).</p>' +
            MQ('Condensarea vaporilor de apă degajă 2260 J pentru fiecare gram. Ce căldură absoarbe vaporizarea unui gram de apă (la aceeași temperatură)?', ['2260 J', '−2260 J', 'Nicio căldură', 'Nu se poate afla'], 0,
              'Procese inverse ⟹ aceeași valoare. Vaporizarea <b>absoarbe</b> 2260 J/g (în modul egal cu căldura degajată la condensare).');
        }
      }
    ]
  });
})(window);
