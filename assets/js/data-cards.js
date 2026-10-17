/* =========================================================
   data-cards.js — cartonașe de memorare (întrebare / răspuns)
   ========================================================= */
(function (g) {
  'use strict';
  var n = 0;
  function C(ch, q, a) { n++; g.T.cards.push({ id: 'c' + n, ch: ch, q: q, a: a }); }

  /* 1 */
  C('intro', 'Ce este termochimia?', 'Ramura chimiei care studiază <b>efectele termice ale reacțiilor chimice</b>, pe baza principiilor termodinamicii.');
  C('intro', 'Ce este efectul termic al unei reacții?', '<b>Degajarea</b> sau <b>absorbția</b> de căldură care însoțește reacția.');
  C('intro', 'Ce este sistemul termodinamic?', 'Un ansamblu de corpuri / substanțe care pot face <b>schimb de energie</b> între ele sau cu mediul exterior.');
  C('intro', 'La o reacție chimică, ce sunt sistemul și mediul exterior?', '<b>Sistem</b> = substanțele participante la reacție <b>+ recipientul</b> în care are loc.<br><b>Mediu exterior</b> = tot ce se află în afara sistemului.');
  C('intro', 'Ce determină starea termodinamică a unui sistem?', 'Proprietățile lui la un moment dat: <b>temperatura, presiunea, volumul</b> etc. — numite <b>parametri de stare</b>.');
  C('intro', 'Ce este un proces termodinamic?', 'Modificarea stării unui sistem ca urmare a <b>interacțiunii cu mediul exterior</b>.');

  /* 2 */
  C('caldura', 'Ce este căldura?', 'O formă de energie <b>transferată între corpuri aflate la temperaturi diferite</b>.');
  C('caldura', 'Ce înseamnă $Q > 0$?', 'Sistemul <b>primește / absoarbe</b> căldură.');
  C('caldura', 'Ce înseamnă $Q < 0$?', 'Sistemul <b>cedează</b> căldură mediului.');
  C('caldura', 'Ce poate produce căldura primită de un corp?', '① creșterea <b>temperaturii</b><br>② efectuarea unui <b>lucru mecanic</b><br>③ <b>schimbarea stării</b> de agregare');
  C('caldura', 'Cât este o calorie în joule?', '$1 cal ≈ 4,186 J$ &nbsp;(și $1 kcal = 1000 cal$, $1 kJ = 1000 J$).');

  /* 3 */
  C('marimi', 'Capacitatea calorică: definiție, formulă, unitate', 'Căldura necesară pentru a crește temperatura unui <b>corp</b> cu un grad.<br>$C = (Q)//(ΔT)$ &nbsp; $[C] = J/K$');
  C('marimi', 'Căldura specifică: definiție, formulă, unitate', 'Căldura necesară pentru a crește cu un grad temperatura <b>unității de masă</b>.<br>$c = (Q)//(m·ΔT)$ ⟹ $Q = m·c·ΔT$ &nbsp; $[c] = J/(g·K)$');
  C('marimi', 'Căldura specifică molară: definiție, formulă, unitate', 'Căldura necesară pentru a crește cu un grad temperatura unui <b>mol</b>.<br>$C_m = (Q)//(ν·ΔT)$ &nbsp; $[C_m] = J/(mol·K)$');
  C('marimi', 'Căldura latentă specifică: definiție, formulă, unitate', 'Căldura necesară <b>transformării de stare</b> a unității de masă, <b>fără modificarea temperaturii</b>.<br>$λ = (Q)//(m)$ &nbsp; $[λ] = J/g$ &nbsp;(topire, vaporizare, sublimare). Pe mol: $λ_m = (Q)//(ν)$, în kJ/mol.');
  C('marimi', 'Cum se calculează $ΔT$?', '$ΔT = T_f − T_i$ (final − inițial). Are aceeași valoare în °C și în K.');
  C('marimi', 'Dacă căldura latentă este dată în kJ/mol (pe mol), ce formulă folosești?', '$Q = ν·λ$ (cu $ν$ = numărul de moli), nu $m·λ$. Verifică mereu unitatea!');

  /* 4 */
  C('principii', 'Principiul echilibrului termic', 'Mai multe corpuri cu temperaturi diferite, puse în contact într-un <b>sistem izolat</b>, ajung după un timp la <b>aceeași temperatură</b>.');
  C('principii', 'Principiul egalității schimburilor de căldură', '$Q_{cedată} = Q_{primită}$ (în modul), adică $Q_1 + Q_2 = 0$ (cu semn).');
  C('principii', 'Ce sunt procesele inverse (în calorimetrie)?', 'Căldura <b>absorbită</b> într-o transformare este egală, ca valoare, cu cea <b>degajată</b> în transformarea inversă. Ex.: topire ↔ solidificare.');

  /* 5 */
  C('principiul1', 'Enunțul primului principiu al termodinamicii', '$Q = ΔU + L$<br>căldura primită = variația energiei interne + lucrul mecanic efectuat de sistem.');
  C('principiul1', 'Ce știi despre energia internă $U$?', 'Nu poate fi măsurată experimental direct; se determină <b>variațiile</b> ei, $ΔU$.');

  /* 6 */
  C('exo-endo', 'Reacție exotermă: definiție și ecuație', 'Reacție cu <b>degajare</b> de căldură: [[reactanți -> produși + Q]]<br>$Q < 0$ (față de sistem), $ΔH < 0$. Ex.: neutralizarea.');
  C('exo-endo', 'Reacție endotermă: definiție și ecuație', 'Reacție cu <b>absorbție</b> de căldură din mediu: [[reactanți + Q -> produși]]<br>$Q > 0$, $ΔH > 0$. Ex.: descompunerea cloratului de potasiu.');
  C('exo-endo', 'Ce se întâmplă cu temperatura când amesteci soluții care reacționează exoterm?', 'Crește: $T_f > T_i$.');

  /* 7 */
  C('ec-termo', 'Ce este ecuația termochimică?', 'O ecuație chimică în care se indică și <b>efectul termic $Q$</b>. Se precizează stările de agregare: (s), (l), (g), (aq).');
  C('ec-termo', 'În ce unități se exprimă căldura de reacție?', 'J, kJ, cal, kcal. Ex.: [[C(s) + O2(g) -> CO2(g) + 393,5 kJ]]');
  C('ec-termo', 'Ce înseamnă coeficienții într-o ecuație termochimică?', 'Numărul de <b>moli</b>; căldura din ecuație este pentru exact acele cantități. Pentru alte cantități: proporție.');
  C('ec-termo', 'Cum faci un calcul pe ecuația termochimică?', 'Scrii „pe ecuație” ($ν·M$ sau $ν·22,4$ și $Q$) și „pe date” (ce se dă și $x$ = necunoscuta), apoi proporția: $x = (dat · Q)//(pe ecuație)$.');

  /* 8 */
  C('legaturi-stari', 'Energia legăturilor chimice', '<b>Ruperea</b> unei legături = <b>absorbție</b> de energie.<br><b>Formarea</b> unei legături = <b>degajare</b> de energie.');
  C('legaturi-stari', 'Care schimbări de stare sunt endoterme?', '<b>Topire, vaporizare, sublimare</b> — absorb căldură.');
  C('legaturi-stari', 'Care schimbări de stare sunt exoterme?', '<b>Solidificare, condensare, desublimare</b> — degajă căldură.');
  C('legaturi-stari', 'Condiții standard', '$T = 298 K = 25 °C$ și $p = 1 atm$.');
  C('legaturi-stari', 'Condiții normale (volum de gaz)', '$T = 273 K = 0 °C$, $p = 1 atm$ ⟹ $V_m = 22,4 L/mol$.');

  /* 9 */
  C('entalpie', 'Cât este $Q_V$ (căldura la volum constant)?', '$Q_V = ΔU$, pentru că la $V = ct.$ avem $pΔV = 0$.');
  C('entalpie', 'Cât este $Q_P$ (căldura la presiune constantă)?', '$Q_P = ΔU + pΔV = Δ(U + pV) = ΔH$.');
  C('entalpie', 'Ce este entalpia?', '$H = U + pV$ — suma dintre energia internă și lucrul mecanic efectuat pentru ocuparea volumului propriu. Nu se măsoară direct; $ΔH$ se află din căldura de reacție.');
  C('entalpie', 'Căldura de reacție la presiune constantă = ?', 'Variația de entalpie: $Q_P = ΔH = H_P − H_R$.');

  /* 10 */
  C('diagrame', 'Diagrama de entalpie a unei reacții endoterme', '$H_P > H_R$ ⟹ $ΔH > 0$ (produșii sunt mai sus decât reactanții).');
  C('diagrame', 'Diagrama de entalpie a unei reacții exoterme', '$H_P < H_R$ ⟹ $ΔH < 0$ (produșii sunt mai jos decât reactanții).');
  C('diagrame', 'Ce este energia de activare $E_a$?', 'Energia minimă (de prag) necesară pentru ca o ciocnire să fie eficientă: $E_a = H_{CA}^* − H_R$. Este <b>mereu pozitivă</b>.');
  C('diagrame', 'Ce este complexul activat?', 'Starea intermediară instabilă, cu entalpie maximă, prin care trece reacția — vârful „dealului”.');
  C('diagrame', 'Ce condiții trebuie să îndeplinească o ciocnire eficientă?', '① <b>energetică</b>: energie $≥ E_a$<br>② <b>geometrică</b>: orientare favorabilă');

  /* 11 */
  C('formare', 'Ce este căldura de formare?', 'Căldura schimbată pentru <b>formarea unui mol</b> de substanță <b>din elemente</b> aflate în stare standard. Notație: $ΔH_f$ (kJ/mol).');
  C('formare', 'Cât este $ΔH_f$ pentru elementele în stare standard?', 'Zero: [[O2(g)]], [[H2(g)]], [[N2(g)]], [[C(s)]] grafit etc.');
  C('formare', 'Cum legi stabilitatea de $ΔH_f$?', 'Cu cât $ΔH_f$ este <b>mai mică (mai negativă)</b>, cu atât substanța este <b>mai stabilă</b>.');
  C('formare', 'Formula pentru $ΔH_R$ din căldurile de formare', '$ΔH_R = Σ ν_P·ΔH_f(produși) − Σ ν_R·ΔH_f(reactanți)$');

  /* 12 */
  C('hess', 'Legea lui Hess', 'Căldura de reacție <b>nu depinde de stările intermediare</b>, ci doar de starea inițială și finală: $ΔH = ΔH_1 + ΔH_2 + ΔH_3$.');
  C('hess', 'Hess: ce faci când inversezi o ecuație?', 'Îi <b>schimbi semnul</b> lui $ΔH$.');
  C('hess', 'Hess: ce faci când înmulțești o ecuație cu $k$?', 'Înmulțești și $ΔH$ cu $k$.');
  C('hess', 'Algoritmul de rezolvare a unui exercițiu Hess', 'Pentru fiecare substanță din țintă (care apare într-o singură ecuație): aceeași parte ⟹ păstrezi; parte opusă ⟹ <b>inversezi</b>; potrivești coeficientul; apoi aduni ecuațiile <b>și</b> valorile $ΔH$.');
})(window);
