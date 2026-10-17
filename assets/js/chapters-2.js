/* =========================================================
   chapters-2.js — lecțiile 5–8
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
    lead: 'Căldura primită de un sistem nu dispare: o parte rămâne în sistem și îl încălzește (ΔU), iar restul se transformă în lucru mecanic (L). Este conservarea energiei, scrisă pentru căldură.',
    sections: [
      {
        id: 'enunt', h: 'Enunțul',
        html: function () {
          return '<div class="formula">$Q = ΔU + L$</div>' +
            '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Mărime</th><th>Ce reprezintă</th></tr></thead><tbody>' +
            '<tr><td>$Q$</td><td>căldura <b>primită</b> de sistem</td></tr>' +
            '<tr><td>$ΔU$</td><td><b>variația energiei interne</b> a sistemului</td></tr>' +
            '<tr><td>$L$</td><td><b>lucrul mecanic efectuat</b> de sistem</td></tr></tbody></table></div>' +
            '<p><b>Energia internă</b> ($U$) este energia tuturor particulelor din sistem (mișcarea și interacțiunile lor). Nu o poți măsura direct; ceea ce se măsoară sunt <b>variațiile</b> ei.</p>' +
            K('key', 'Căldura primită se <b>împarte</b>: o parte rămâne în sistem și îi crește energia internă ($ΔU$), iar o parte pleacă din sistem sub formă de lucru mecanic ($L$).', 'Reține') +
            K('tip', 'Imaginează-ți un gaz într-un cilindru cu piston. Îi dai căldură: o parte îl <b>încălzește</b> (ΔU), o parte <b>împinge pistonul</b> (L).');
        }
      },
      {
        id: 'semne', h: 'Semne și simulare',
        html: function () {
          return '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Mărime</th><th>Pozitivă</th><th>Negativă</th></tr></thead><tbody>' +
            '<tr><td>$Q$</td><td>sistemul primește căldură</td><td>sistemul cedează căldură</td></tr>' +
            '<tr><td>$L$</td><td>sistemul efectuează lucru (se dilată)</td><td>se efectuează lucru asupra sistemului (se comprimă)</td></tr>' +
            '<tr><td>$ΔU$</td><td>energia internă crește (de obicei, sistemul se încălzește)</td><td>energia internă scade (de obicei, sistemul se răcește)</td></tr></tbody></table></div>' +
            '<p class="muted">La o schimbare de stare (de ex. topirea), energia internă crește, dar temperatura rămâne constantă.</p>' +
            W('firstLaw') +
            MQ('Un gaz primește 500 J sub formă de căldură și efectuează un lucru mecanic de 200 J. Cât este $ΔU$?', ['300 J', '700 J', '−300 J', '100 J'], 0,
              '$ΔU = Q − L = 500 − 200 = 300$ J. Energia internă crește cu 300 J.') +
            K('warn', '$L > 0$ când lucrul este efectuat <b>de sistem</b> (gazul se dilată), iar $L < 0$ când se efectuează lucru <b>asupra</b> lui (îl comprimi). Dacă $L < 0$, din $ΔU = Q − L$ rezultă că $ΔU$ <b>crește</b> — așa se încălzește pompa de bicicletă.');
        }
      },
      {
        id: 'cazuri', h: 'Două cazuri speciale (le folosești în lecția 9)',
        html: function () {
          return '<ul><li><b>Volum constant</b> ($V = ct.$): volumul nu se schimbă, deci nu se efectuează lucru mecanic: $L = 0$ ⟹ $Q = ΔU$.</li>' +
            '<li><b>Presiune constantă</b> ($p = ct.$): sistemul se poate dilata, iar lucrul este $L = pΔV$ ⟹ $Q = ΔU + pΔV$.</li></ul>' +
            '<p>Aceste două cazuri explică de ce căldura unei reacții depinde de condiții și de unde apare <b>entalpia</b>.</p>';
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
    lead: 'Orice reacție fie degajă căldură în mediu (exotermă), fie o ia din mediu (endotermă). Cum le recunoști și unde scrii $Q$ în ecuație.',
    tone: 'exo',
    sections: [
      {
        id: 'exo', h: 'Reacții exoterme',
        html: function () {
          return K('exo', 'Reacții la care are loc o <b>degajare de căldură</b> în mediul exterior.', 'Definiție') +
            '<div class="eqn exo">[[reactanți -> produși + Q]] &nbsp;,&nbsp; $Q < 0$ (față de sistem)</div>' +
            K('ex', '<b>Neutralizarea</b> (exemplul din caiet):<div class="eqn">[[2NaOH(aq) + H2SO4(aq) -> Na2SO4(aq) + 2H2O(l) + Q]]</div>La amestecarea soluțiilor, temperatura crește: <b>$T_f > T_i$</b>.') +
            '<p>Alte exemple: arderile (metan, lemn), respirația celulară, reacția aluminotermică (termit). În toate, mediul se <b>încălzește</b>.</p>';
        }
      },
      {
        id: 'endo', h: 'Reacții endoterme',
        html: function () {
          return K('endo', 'Reacții la care are loc o <b>absorbție de căldură</b> din mediul exterior.', 'Definiție') +
            '<div class="eqn endo">[[reactanți + Q -> produși]] &nbsp;,&nbsp; $Q > 0$ (față de sistem)</div>' +
            K('ex', '<b>Descompunerea cloratului de potasiu</b> (exemplul din caiet):<div class="eqn">[[2KClO3(s) + Q -> 2KCl(s) + 3O2(g)]]</div>$Q$ apare la reactanți: reacția <b>absoarbe</b> căldură din mediu.') +
            '<p>Alte exemple: descompunerea termică a carbonatului de calciu, dehidrogenarea etanului la etenă. Mediul <b>cedează</b> căldură (se răcește) sau trebuie să-i furnizezi tu căldura necesară.</p>' +
            T.details('Un detaliu pentru curioși: cloratul de potasiu', '<p>La test folosește exemplul <b>așa cum este în caiet</b>: reacție endotermă ($Q$ la reactanți). Dacă mergi mai departe cu studiul, vei afla că bilanțul termodinamic exact al acestei reacții este ușor exoterm (de ordinul a −80 kJ pentru ecuația de mai sus); ea cere totuși căldură ca să <i>pornească</i>. Exemple fără astfel de nuanțe: descompunerea $CaCO_3$ sau dehidrogenarea etanului.</p>');
        }
      },
      {
        id: 'semne', h: 'Semnele, pe scurt (și o capcană)',
        html: function () {
          return '<div class="tbl-wrap"><table class="tbl"><thead><tr><th></th><th class="c"><span class="tag-exo">Exotermă</span></th><th class="c"><span class="tag-endo">Endotermă</span></th></tr></thead><tbody>' +
            '<tr><td>Ecuația</td><td class="c">$R -> P + Q$</td><td class="c">$R + Q -> P$</td></tr>' +
            '<tr><td>Sistemul</td><td class="c">degajă căldură</td><td class="c">absoarbe căldură</td></tr>' +
            '<tr><td>$Q$ pentru sistem</td><td class="c">$Q < 0$</td><td class="c">$Q > 0$</td></tr>' +
            '<tr><td>$ΔH$</td><td class="c">$ΔH < 0$</td><td class="c">$ΔH > 0$</td></tr>' +
            '<tr><td>Mediul</td><td class="c">se încălzește</td><td class="c">se răcește</td></tr></tbody></table></div>' +
            W('exoEndoLab') +
            K('warn', '<b>Capcana semnului.</b> În ecuația termochimică $Q$ apare ca o <b>cantitate</b> de căldură (un număr pozitiv, ex. „+ 393,5 kJ”): la exoterme în dreapta (degajată), la endoterme în stânga (absorbită). Semnul „−” al exotermelor apare când judeci <b>față de sistem</b>: $Q < 0$ și $ΔH < 0$. Nu amesteca cele două moduri de scriere.');
        }
      },
      {
        id: 'sort', h: 'Exersează: exotermă sau endotermă?',
        html: function () {
          return W('sortExoEndo') +
            MQ('Un pahar în care are loc o reacție devine tot mai rece. Ce poți spune?', ['Reacția este exotermă', 'Reacția este endotermă: absoarbe căldură din mediu', 'Reacția nu are efect termic', 'Mediul absoarbe căldură de la reacție'], 1,
              'Paharul se răcește pentru că reacția <b>ia</b> căldură din mediu ⟹ endotermă, $Q > 0$ pentru sistem.');
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
    short: 'Cum se scrie, cum se citește, regula de trei',
    lead: 'O ecuație chimică la care adăugăm și căldura. Citită corect, îți dă proporția cu care rezolvi aproape orice problemă din test.',
    sections: [
      {
        id: 'ce', h: 'Ce este ecuația termochimică?',
        html: function () {
          return K('key', 'Ecuația termochimică este o ecuație chimică în care se indică și <b>efectul termic $Q$ al reacției</b>.', 'Definiție') +
            '<div class="grid-2"><div class="callout exo"><div class="ct">exotermă</div><div class="cb"><div class="eqn" style="margin:0">[[reactanți -> produși + Q]]</div></div></div>' +
            '<div class="callout endo"><div class="ct">endotermă</div><div class="cb"><div class="eqn" style="margin:0">[[reactanți + Q -> produși]]</div></div></div></div>' +
            '<p>Trebuie să <b>precizezi stările de agregare</b>:</p><div class="chips"><span class="chip">(s) = solid</span><span class="chip">(l) = lichid</span><span class="chip">(g) = gaz</span><span class="chip">(aq) = soluție apoasă</span></div>' +
            K('ex', 'Arderea metanului: <div class="eqn">[[CH4(g) + 2O2(g) -> CO2(g) + 2H2O(g) + Q]]</div>') +
            K('note', 'Căldura poate fi <b>mutată peste săgeată</b> dacă îi schimbi semnul: $A + B -> C + D + Q$ este același lucru cu $A + B − Q -> C + D$. Așa apare uneori în exerciții (reacție exotermă).', 'Două scrieri echivalente') +
            K('why', 'Efectul termic depinde de starea de agregare. De exemplu, arderea metanului degajă mai multă căldură dacă apa rezultată este <b>lichidă</b> (≈ 890 kJ) decât dacă este <b>gaz</b> (≈ 802 kJ): diferența (≈ 88 kJ) este căldura de vaporizare a celor 2 mol de apă formați (≈ 2 · 44 kJ).');
        }
      },
      {
        id: 'caldura', h: 'Căldura de reacție',
        html: function () {
          return '<p><b>Căldura de reacție</b> este cantitatea de căldură <b>cedată</b> sau <b>absorbită</b>. Se poate exprima în <b>J, kJ, cal, kcal</b>.</p>' +
            K('ex', '<div class="eqn">[[C(s) + O2(g) -> CO2(g) + 393,5 kJ]]</div>Se citește: <b>1 mol</b> de carbon (12 g) arde complet cu 1 mol de oxigen și se degajă <b>393,5 kJ</b>.') +
            K('key', '<b>Coeficienții din ecuație înseamnă moli</b>, iar căldura din ecuație se referă exact la cantitățile din ecuație. Pentru alte cantități, căldura se obține prin proporție.');
        }
      },
      {
        id: 'cum', h: 'Cum citești o ecuație (exemplu: reacția aluminotermică)',
        html: function () {
          return '<div class="eqn exo">[[2Al(s) + Fe2O3(s) -> 2Fe(s) + Al2O3(s) + 852 kJ]]</div>' +
            '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Substanța</th><th class="c">ν (mol)</th><th class="c">M (g/mol)</th><th class="c">masa pe ecuație</th></tr></thead><tbody>' +
            '<tr><td>[[Al]]</td><td class="c">2</td><td class="c">27</td><td class="c">54 g</td></tr><tr><td>[[Fe2O3]]</td><td class="c">1</td><td class="c">160</td><td class="c">160 g</td></tr>' +
            '<tr><td>[[Fe]]</td><td class="c">2</td><td class="c">56</td><td class="c">112 g</td></tr><tr><td>[[Al2O3]]</td><td class="c">1</td><td class="c">102</td><td class="c">102 g</td></tr></tbody></table></div>' +
            '<p>Se citește: când reacționează <b>2 mol Al</b> (54 g) cu <b>1 mol Fe₂O₃</b> (160 g), se degajă <b>852 kJ</b>. Pentru <b>1 mol Al</b> se degajă $852 / 2 = 426$ kJ.</p>' +
            K('warn', 'Căldura din ecuație (852 kJ) este pentru <b>2 mol de Al</b>, nu pentru unul! Citește întotdeauna coeficienții.') +
            K('key', '<b>Dublezi ecuația ⟹ dublezi și Q.</b> &nbsp;·&nbsp; <b>Inversezi ecuația ⟹ aceeași valoare Q, dar exotermă ↔ endotermă.</b>');
        }
      },
      {
        id: 'calc', h: 'Calcule pe ecuație: regula de trei',
        html: function () {
          return '<ol><li>Scrie <b>ecuația</b> cu căldura ei.</li>' +
            '<li>Sub substanțele care contează scrie cantitatea <b>pe ecuație</b>: $ν$ mol (= $ν·M$ grame, sau $ν·22,4$ L pentru un gaz la c.n.).</li>' +
            '<li>Scrie alături căldura din ecuație.</li>' +
            '<li>Pe rândul „<b>pe date</b>” scrie ce ai (sau ce cauți) și $x$.</li>' +
            '<li>Rezolvă proporția: $x = (dat · Q_{ec})//(pe ecuație)$.</li></ol>' +
            W('thermoEq') +
            K('ex', '<b>Ce căldură se degajă la arderea a 36 g de carbon?</b> ($M_C = 12$ g/mol)<br>$ν = (36)//(12) = 3$ mol ⟹ $Q = 3 · 393,5 = 1180,5$ kJ.') +
            K('warn', '<b>Verifică:</b> (1) unitățile ($kJ$ / $J$ / $kcal$ și $g$ / $kg$); (2) dacă ai folosit coeficienții; (3) gazele la c.n.: $V_m = 22,4$ L/mol; (4) că rezultatul are sens (mai multă substanță ⟹ mai multă căldură).');
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
    short: 'De ce degajă sau absorb căldură reacțiile; stări de agregare; 298 K',
    lead: 'De ce unele reacții degajă căldură și altele o absorb? Răspunsul stă în legăturile chimice. Apoi: schimbările de stare și condițiile standard.',
    sections: [
      {
        id: 'leg', h: 'Energia legăturilor chimice',
        html: function () {
          return K('key', '<b>Ruperea</b> unei legături = <b>absorbție</b> de energie.<br><b>Formarea</b> unei legături = <b>degajare</b> de energie.', 'Reține') +
            '<p>Într-o reacție se rup legăturile din reactanți (costă energie) și se formează legături în produși (se câștigă energie). Rezultatul final decide tipul reacției:</p>' +
            '<ul><li>se degajă <b>mai mult</b> la formare decât se absoarbe la rupere ⟹ <span class="tag-exo">exotermă</span>;</li><li>se absoarbe <b>mai mult</b> la rupere decât se degajă la formare ⟹ <span class="tag-endo">endotermă</span>.</li></ul>' +
            W('bondBalance') +
            K('tip', 'Gândește-te la <b>doi magneți lipiți</b>: ca să-i desprinzi trebuie să muncești (absorbi energie); când se lipesc la loc, se eliberează energie.');
        }
      },
      {
        id: 'stari', h: 'Schimbări de stare, efect termic',
        html: function () {
          return '<div class="grid-2">' +
            '<div class="callout endo"><div class="ct">necesită absorbție de căldură (endoterme)</div><div class="cb"><b>topire, vaporizare, sublimare</b></div></div>' +
            '<div class="callout exo"><div class="ct">degajă căldură (exoterme)</div><div class="cb"><b>solidificare, condensare, desublimare</b></div></div></div>' +
            W('stateWheel') +
            K('key', 'Procesele din coloana a doua sunt <b>inversele</b> celor din prima, deci degajă exact căldura pe care cele directe o absorb (lecția 4: procese inverse).') +
            '<p>Cât timp are loc schimbarea de stare, temperatura rămâne constantă; căldura implicată este căldura latentă ($Q = m·λ$), vezi lecția 3.</p>';
        }
      },
      {
        id: 'cond', h: 'Condiții standard (și condiții normale)',
        html: function () {
          return K('imp', 'Condiții standard: &nbsp;<b>$T = 298 K = 25 °C$</b> &nbsp;și&nbsp; <b>$p = 1 atm$</b>.', 'Marcat în caiet') +
            '<p>Căldurile de reacție și de formare (în tabele) se dau, de regulă, în aceste condiții — de aceea apare și notația $ΔH_f^{298}$.</p>' +
            '<div class="tbl-wrap"><table class="tbl"><thead><tr><th></th><th>Temperatura</th><th>Presiunea</th><th>Se folosesc pentru</th></tr></thead><tbody>' +
            '<tr><td><b>Condiții standard</b></td><td>298 K = 25 °C</td><td>1 atm</td><td>căldurile de reacție / de formare</td></tr>' +
            '<tr><td><b>Condiții normale (c.n.)</b></td><td>273 K = 0 °C</td><td>1 atm</td><td>volumul gazelor: $V_m = 22,4$ L/mol</td></tr></tbody></table></div>' +
            K('warn', 'Nu confunda cele două! La <b>volume de gaze</b> din probleme (ex. „448 L la c.n.”) folosești $22,4$ L/mol (0 °C). <b>298 K</b> este pentru entalpii.') +
            MQ('Cât este $T = 298$ K în grade Celsius?', ['25 °C', '571 °C', '−25 °C', '0 °C'], 0, '$t(°C) = T(K) − 273 = 298 − 273 = 25$ °C.');
        }
      }
    ]
  });
})(window);
