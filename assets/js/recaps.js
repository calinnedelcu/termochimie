/* =========================================================
   recaps.js — „Reține din lecție”: doar ce scrie în caiet
   ========================================================= */
(function (g) {
  'use strict';
  g.T.recaps = {
    intro: [
      '<b>Termochimia</b> studiază efectele termice ale reacțiilor chimice: <b>degajare</b> sau <b>absorbție</b> de căldură.',
      '<b>Sistemul</b> = substanțele participante la reacție <b>+ recipientul</b>; <b>mediul exterior</b> = tot ce e în afara lui.',
      '<b>Starea</b> se descrie prin parametri de stare ($t$, $p$, $V$); modificarea ei prin interacțiunea cu mediul exterior este un <b>proces termodinamic</b>.'
    ],
    caldura: [
      '$Q > 0$: sistemul <b>primește</b> căldură. &nbsp;$Q < 0$: sistemul <b>cedează</b> căldură.',
      'Căldura primită poate produce: <b>↑ t°</b>, <b>un lucru mecanic</b> sau <b>schimbarea stării de agregare</b>.',
      '$1 cal ≈ 4,186 J$.'
    ],
    marimi: [
      '$C = (Q)//(ΔT)$ în J/K · $c = (Q)//(m·ΔT)$ ⟹ $Q = m·c·ΔT$ în J/(g·K) · $c_m = (Q)//(ν·ΔT)$ în J/(mol·K).',
      '$λ = (Q)//(m)$ în J/g: căldura transformării de stare, <b>fără modificarea temperaturii</b> (topire, vaporizare, sublimare).',
      '$ΔT = T_f − T_i$.'
    ],
    principii: [
      '<b>Echilibru termic:</b> corpuri cu temperaturi diferite, în contact într-un sistem izolat, ajung la aceeași temperatură.',
      '<b>Egalitatea schimburilor de căldură:</b> $Q_{cedată} = Q_{primită}$, adică $Q_1 + Q_2 = 0$.',
      '<b>Procese inverse:</b> căldura absorbită într-o transformare = cea degajată în transformarea inversă (topire ↔ solidificare).'
    ],
    principiul1: [
      '$Q = ΔU + L$: căldura primită de sistem = variația energiei interne + lucrul mecanic efectuat.'
    ],
    'exo-endo': [
      '<b>Exotermă:</b> reactanți → produși + $Q$, $Q < 0$ (se degajă căldură). Ex.: neutralizarea ($T_f > T_i$).',
      '<b>Endotermă:</b> reactanți + $Q$ → produși, $Q > 0$ (se absoarbe căldură din mediul exterior). Ex.: descompunerea cloratului de potasiu.'
    ],
    'ec-termo': [
      'Ecuația termochimică arată și <b>efectul termic $Q$</b>; se precizează stările: (s), (l), (g), (aq).',
      'Căldura de reacție se exprimă în J, kJ, cal, kcal. Ex.: $C(s) + O_2(g) → CO_2(g) + 393,5$ kJ.',
      'Coeficienții sunt moli; pentru alte cantități se face <b>proporție</b>. La c.n.: $V_m = 22,4$ L/mol.'
    ],
    'legaturi-stari': [
      '<b>Ruperea</b> unei legături = absorbție de energie; <b>formarea</b> unei legături = degajare de energie.',
      '<b>Endoterme:</b> topire, vaporizare, sublimare. <b>Exoterme:</b> solidificare, condensare, desublimare.',
      '<b>Condiții standard:</b> $T = 298 K = 25 °C$, $p = 1 atm$.'
    ],
    entalpie: [
      '$V = ct.$ ⟹ $pΔV = 0$ ⟹ $Q_V = ΔU$. &nbsp;$p = ct.$ ⟹ $Q_P = Δ(U + pV) = ΔH$.',
      '$H = U + pV$ nu poate fi măsurată experimental; $ΔH$ se determină <b>indirect</b>, din căldura de reacție.',
      '$ΔH = H_P − H_R$: exotermă ⟹ $ΔH < 0$; endotermă ⟹ $ΔH > 0$.'
    ],
    diagrame: [
      'Diagrama: $H_R$, $H_P$, $H_{CA}^*$; $E_a = H_{CA}^* − H_R$; $ΔH = H_P − H_R$.',
      'Ciocnire eficientă (condiția energetică): energia ciocnirii este cel puțin egală cu $E_a$ (energia de prag).'
    ],
    formare: [
      '$ΔH_f$ = căldura schimbată la formarea a <b>1 mol</b> de substanță din <b>elemente</b> în stare standard; pentru elemente: $ΔH_f = 0$.',
      'Cu cât $ΔH_f$ este mai mică (mai negativă), cu atât substanța este <b>mai stabilă</b>.',
      '$ΔH_r = Σ ν_P·ΔH_f(produși) − Σ ν_R·ΔH_f(reactanți)$.'
    ],
    hess: [
      'Căldura de reacție <b>nu depinde de stările intermediare</b>, ci doar de starea inițială și finală: $ΔH = ΔH_1 + ΔH_2 + ΔH_3$.',
      'La exercițiu: <b>inversezi</b> ecuațiile care au substanța în partea opusă (își schimbă semnul $ΔH$), le <b>înmulțești</b> ca să potrivești coeficienții, le <b>aduni</b> — și aduni și valorile $ΔH$.'
    ]
  };
})(window);
