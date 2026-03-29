import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Wind, 
  Thermometer, 
  Car, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Copy, 
  Check,
  ChevronRight,
  Info,
  FileUp
} from 'lucide-react';

// --- DATA DEFINITIONS ---

const CAR_CLASSES = [
  { id: 'HY', name: 'HYPERCAR' },
  { id: 'LMP2', name: 'LMP2' },
  { id: 'LMP3', name: 'LMP3' },
  { id: 'LMGT3', name: 'LMGT3' },
  { id: 'GTE', name: 'GTE' },
];

const CAR_MODELS = {
  'HY': [
    { id: 'ferrari_499p', name: 'Ferrari 499P', basePreload: 180 },
    { id: 'toyota_gr010', name: 'Toyota GR010-Hybrid', basePreload: 170 },
    { id: 'porsche_963', name: 'Porsche 963', basePreload: 160 },
    { id: 'cadillac_v_series', name: 'Cadillac V-Series.R', basePreload: 150 },
    { id: 'bmw_m_hybrid_v8', name: 'BMW M Hybrid V8', basePreload: 160 },
    { id: 'alpine_a424', name: 'Alpine A424', basePreload: 150 },
    { id: 'lamborghini_sc63', name: 'Lamborghini SC63', basePreload: 170 },
    { id: 'peugeot_9x8_24', name: 'Peugeot 9X8', basePreload: 140 },
    { id: 'peugeot_9x8_23', name: 'Peugeot 9X8 (Early-spec)', basePreload: 140 },
    { id: 'isotta_fraschini', name: 'Isotta Fraschini Tipo 6-C', basePreload: 150 },
    { id: 'vanwall_680', name: 'Vanwall Vandervell 680', basePreload: 130 },
    { id: 'glickenhaus_007', name: 'Glickenhaus SCG 007', basePreload: 140 },
    { id: 'aston_valkyrie', name: 'Aston Martin Valkyrie AMR Pro', basePreload: 180 },
  ],
  'LMP2': [
    { id: 'oreca_07_wec', name: 'Oreca 07 Gibson (WEC-spec)', basePreload: 120 },
    { id: 'oreca_07_elms', name: 'Oreca 07 Gibson (ELMS-spec)', basePreload: 110 },
  ],
  'LMP3': [
    { id: 'ligier_js_p325', name: 'Ligier JS P325', basePreload: 100 },
    { id: 'ginetta_g61', name: 'Ginetta G61-LT-P325-EVO', basePreload: 105 },
  ],
  'LMGT3': [
    { id: 'lambo_gt3_evo2', name: 'Lamborghini Huracán GT3 Evo 2', basePreload: 120 },
    { id: 'mercedes_amg_evo', name: 'Mercedes-AMG LMGT3 Evo', basePreload: 130 },
    { id: 'bmw_m4_evo', name: 'BMW M4 LMGT3 Evo', basePreload: 125 },
    { id: 'ferrari_296_gt3', name: 'Ferrari 296 LMGT3', basePreload: 110 },
    { id: 'porsche_992_gt3', name: 'Porsche 911 GT3 R (992)', basePreload: 100 },
    { id: 'bmw_m4_gt3', name: 'BMW M4 LMGT3', basePreload: 130 },
    { id: 'corvette_z06_gt3', name: 'Chevrolet Corvette Z06 GT3.R', basePreload: 120 },
    { id: 'aston_gt3_evo', name: 'Aston Martin Vantage GT3 Evo', basePreload: 110 },
    { id: 'ford_mustang_gt3', name: 'Ford Mustang LMGT3', basePreload: 140 },
    { id: 'mclaren_720s_gt3', name: 'McLaren 720S GT3 Evo', basePreload: 90 },
    { id: 'lexus_rcf_gt3', name: 'Lexus RC F LMGT3', basePreload: 120 },
  ],
  'GTE': [
    { id: 'porsche_911_rsr', name: 'Porsche 911 RSR-19', basePreload: 100 },
    { id: 'ferrari_488_gte', name: 'Ferrari 488 GTE Evo', basePreload: 110 },
    { id: 'corvette_c8r', name: 'Chevrolet Corvette C8.R', basePreload: 120 },
    { id: 'aston_vantage_gte', name: 'Aston Martin Vantage GTE', basePreload: 110 },
  ],
};

const CIRCUITS = [
  { id: 'lemans', name: 'Le Mans', downforce: 'LOW', bumpiness: 'SMOOTH' },
  { id: 'spa', name: 'Spa-Francorchamps', downforce: 'MED-LOW', bumpiness: 'MIXED' },
  { id: 'imola', name: 'Imola', downforce: 'MED-HIGH', bumpiness: 'BUMPY' },
  { id: 'fuji', name: 'Fuji Speedway', downforce: 'MED', bumpiness: 'SMOOTH' },
  { id: 'lusail', name: 'Lusail', downforce: 'MED-HIGH', bumpiness: 'SMOOTH' },
  { id: 'interlagos', name: 'Interlagos', downforce: 'MED', bumpiness: 'BUMPY' },
  { id: 'cota', name: 'COTA', downforce: 'MED-HIGH', bumpiness: 'MIXED' },
  { id: 'bahrain', name: 'Bahrain', downforce: 'MED', bumpiness: 'SMOOTH' },
  { id: 'silverstone', name: 'Silverstone', downforce: 'MED-HIGH', bumpiness: 'MIXED' },
  { id: 'paul_ricard', name: 'Circuit Paul Ricard', downforce: 'MED-LOW', bumpiness: 'SMOOTH' },
  { id: 'portimao', name: 'Portimão', downforce: 'MED-HIGH', bumpiness: 'MIXED' },
];

const WEATHER_CONDITIONS = [
  { id: 'clear', name: 'Clear', wetness: 0, tempAdj: 0 },
  { id: 'light_clouds', name: 'Light Clouds', wetness: 0, tempAdj: -2 },
  { id: 'partially_cloudy', name: 'Partially Cloudy', wetness: 0, tempAdj: -3 },
  { id: 'mostly_cloudy', name: 'Mostly Cloudy', wetness: 0, tempAdj: -4 },
  { id: 'overcast', name: 'Overcast', wetness: 0, tempAdj: -5 },
  { id: 'drizzle', name: 'Cloudy & Drizzle', wetness: 1, tempAdj: -6 },
  { id: 'light_rain', name: 'Cloudy & Light Rain', wetness: 2, tempAdj: -7 },
  { id: 'overcast_light_rain', name: 'Overcast & Light Rain', wetness: 2, tempAdj: -8 },
  { id: 'overcast_rain', name: 'Overcast & Rain', wetness: 3, tempAdj: -9 },
  { id: 'overcast_heavy_rain', name: 'Overcast & Heavy Rain', wetness: 4, tempAdj: -10 },
  { id: 'storm', name: 'Overcast & Storm', wetness: 5, tempAdj: -12 },
];

const DRIVER_PROFILES = [
  { id: 'stable', name: '安定重視 (STABLE)', description: '高プリロードと最大介入のTCでミスを最小化。' },
  { id: 'neutral', name: 'ニュートラル (NEUTRAL)', description: 'バランスの取れた標準的なセッティング。' },
  { id: 'aggressive', name: '攻撃的 (AGGRESSIVE)', description: '電子介入を抑え、回頭性を最大化する上級者向け。' },
];

// --- LOGIC ENGINE ---

const calculateSetup = (config, diagnostics, telemetry, weatherSlot, baseline) => {
  const { classId, modelId, circuitId, profileId, mode } = config;
  const carClass = CAR_CLASSES.find(c => c.id === classId);
  const models = CAR_MODELS[classId] || [];
  const model = models.find(m => m.id === modelId) || models[0];
  const circuit = CIRCUITS.find(cir => cir.id === circuitId);
  const weather = WEATHER_CONDITIONS.find(w => w.id === (weatherSlot?.weatherId || 'clear')) || WEATHER_CONDITIONS[0];
  const ambientTemp = weatherSlot?.temp || weather.temp || 25;

  // Initialize with current user baseline
  let res = { ...baseline };

  // --- 1. DAMPING / STABILITY LOGIC ---
  // If 'No Problem' is reported, we want minimal changes from baseline.
  const hasIssues = diagnostics.entry !== 'none' || diagnostics.mid !== 'none' || diagnostics.exit !== 'none' || diagnostics.curbs !== 'none';
  
  // --- 2. WEATHER & TRACK BASE CORRECTIONS ---
  // Adjust BB and TC for rain
  if (weather.weatherId === 'rain' || weather.weatherId === 'storm') {
    res.brakeBalance = Math.min(res.brakeBalance + 3.0, 75.0);
    res.tcMap = Math.min(res.tcMap + 3, 12);
    res.absMap = Math.min(res.absMap + 2, 12);
    res.rhFront = res.rhFront + 10;
    res.rhRear = res.rhRear + 12;
    res.rearWing = res.rearWing + 2;
  }

  // --- 3. PHASE-AWARE PINPOINT ADJUSTMENTS (v3.5 High/Low Speed Split) ---
  
  // LOW SPEED (Mechanical Grip focus)
  if (diagnostics.entry_low === 'understeer') {
    res.brakeBalance -= 1.0;
    res.preload += 20;
  } else if (diagnostics.entry_low === 'oversteer') {
    res.brakeBalance += 1.0;
    res.preload -= 20;
  }

  if (diagnostics.mid_low === 'understeer') {
    res.springFront -= 1;
    res.arbFront -= 1;
  } else if (diagnostics.mid_low === 'oversteer') {
    res.springFront += 1;
    res.arbFront += 1;
  }

  if (diagnostics.exit_low === 'understeer') {
    res.springRear += 1;
    res.arbRear -= 1;
  } else if (diagnostics.exit_low === 'oversteer') {
    res.springRear -= 1;
    res.arbRear += 1;
    res.tcPower += 1;
  }

  // HIGH SPEED (Aero / Rake focus)
  if (diagnostics.entry_high === 'understeer') {
    res.rearWing -= 1;
    res.rhFront -= 2;
  } else if (diagnostics.entry_high === 'oversteer') {
    res.rearWing += 1;
    res.rhFront += 2;
  }

  if (diagnostics.mid_high === 'understeer') {
    res.rearWing -= 1;
    res.rhFront -= 2;
  } else if (diagnostics.mid_high === 'oversteer') {
    res.rearWing += 1;
    res.rhFront += 2;
  }

  if (diagnostics.exit_high === 'understeer') {
    res.rearWing -= 1;
  } else if (diagnostics.exit_high === 'oversteer') {
    res.rearWing += 1;
  }

  // CURBS: Compliance
  if (diagnostics.curbs === 'bumpy') {
    res.springFront -= 1;
    res.springRear -= 1;
    res.rhFront += 5;
    res.rhRear += 5;
    res.packerFront -= 2;
    res.packerRear -= 2;
  }

  // PROFILE OVERRIDES (Stable/Aggressive)
  if (!hasIssues) {
    if (profileId === 'stable') {
      res.brakeBalance += 0.5;
      res.tcMap += 1;
    } else if (profileId === 'aggressive') {
      res.tcMap -= 1;
      res.tcSlip -= 1;
    }
  }

  // --- 4. VOLATILITY PROTECTION (Damping) ---
  // We limit the delta from baseline to prevent 'extreme jumps'
  const damp = (curr, target, maxDelta) => {
    const delta = target - curr;
    const clamped = Math.max(Math.min(delta, maxDelta), -maxDelta);
    return curr + clamped;
  };

  // If user says "No Issue", we dampen even more
  const dampingFactor = hasIssues ? 1.0 : 0.2; 
  
  res.brakeBalance = damp(baseline.brakeBalance, res.brakeBalance, 2.0 * dampingFactor);
  res.rearWing = damp(baseline.rearWing, res.rearWing, 3 * dampingFactor);
  res.rhFront = damp(baseline.rhFront, res.rhFront, 8 * dampingFactor);
  res.rhRear = damp(baseline.rhRear, res.rhRear, 10 * dampingFactor);
  res.tcMap = damp(baseline.tcMap, res.tcMap, 2 * dampingFactor);

  // Hard Constraints
  res.tcMap = Math.max(Math.min(res.tcMap, 12), 1);
  res.tcPower = Math.max(Math.min(res.tcPower, 12), 1);
  res.tcSlip = Math.max(Math.min(res.tcSlip, 15), 1);
  res.brakeBalance = Math.max(Math.min(res.brakeBalance, 75.0), 45.0);

  return {
    ...res,
    wetness: weather.wetness,
    weatherName: weather.name,
    temp: ambientTemp,
    bumpiness: circuit?.bumpiness || 'NORMAL',
    camberAdvice: "DEFAULT"
  };
};

const formatOutput = (results, config, baseline) => {
  const { classId, modelId, circuitId, profileId, mode } = config;
  const carClass = CAR_CLASSES.find(c => c.id === classId);
  const models = CAR_MODELS[classId] || [];
  const model = models.find(m => m.id === modelId) || models[0];
  const circuit = CIRCUITS.find(cir => cir.id === circuitId);
  const profile = DRIVER_PROFILES.find(p => p.id === profileId);

  let output = `--- LMU AI SETUP ENGINEER OUTPUT v3.5 (OPTIMIZED STRATEGY) ---\n`;
  output += `CAR: ${model?.name || 'Unknown'} (${carClass?.name || 'Common'})\n`;
  output += `TRACK: ${circuit?.name || 'Unknown'} [Property: ${circuit?.bumpiness || 'N/A'}]\n`;
  output += `DRIVER PROFILE: ${profile?.name || 'Standard'}\n`;
  output += `------------------------------------\n\n`;

  const main = results[0];

  const getDelta = (curr, rec) => {
    const d = rec - curr;
    if (Math.abs(d) < 0.05) return "(Optimal)";
    return `(${d >= 0 ? '+' : ''}${d.toFixed(1)})`;
  };

  const getDeltaInt = (curr, rec) => {
    const d = Math.round(rec) - Math.round(curr);
    return d === 0 ? "(Keep)" : `(${d > 0 ? '+' : ''}${d})`;
  };

  output += `[1. ELECTRONICS / 電子制御]\n`;
  output += `Traction Control (Map)    = ${baseline.tcMap} -> ${Math.round(main.tcMap)} ${getDeltaInt(baseline.tcMap, main.tcMap)}\n`;
  output += `TC Power Cut Map          = ${baseline.tcPower} -> ${Math.round(main.tcPower)} ${getDeltaInt(baseline.tcPower, main.tcPower)}\n`;
  output += `TC Slip Angle Map         = ${baseline.tcSlip} -> ${Math.round(main.tcSlip)} ${getDeltaInt(baseline.tcSlip, main.tcSlip)}\n`;
  output += `Antilock Braking (ABS)    = ${baseline.absMap} -> ${Math.round(main.absMap)} ${getDeltaInt(baseline.absMap, main.absMap)}\n`;
  output += `Brake Balance (前後配分)  = ${baseline.brakeBalance.toFixed(1)}% -> ${main.brakeBalance.toFixed(1)}% ${getDelta(baseline.brakeBalance, main.brakeBalance)}\n`;
  
  if (mode === 'open') {
    output += `\n[2. AERODYNAMICS / 空力]\n`;
    output += `Rear Wing (基準偏移)       = ${baseline.rearWing} -> ${Math.round(main.rearWing)} ${getDeltaInt(baseline.rearWing, main.rearWing)} clicks\n`;
    output += `Brake Duct Setting (F/R)  = [ ${Math.round(main.brakeDucts)} ]\n`;

    output += `\n[3. CHASSIS & SUSPENSION / 足回り]\n`;
    output += `Ride Height Front (車高F) = ${baseline.rhFront} -> ${Math.round(main.rhFront)} ${getDeltaInt(baseline.rhFront, main.rhFront)} mm\n`;
    output += `Ride Height Rear  (車高R) = ${baseline.rhRear} -> ${Math.round(main.rhRear)} ${getDeltaInt(baseline.rhRear, main.rhRear)} mm\n`;
    output += `Spring Rate F/R           = [ F: ${Math.round(main.springFront)} / R: ${Math.round(main.springRear)} ]\n`;
    output += `Anti-Roll Bar F/R         = [ F: ${Math.round(main.arbFront)} / R: ${Math.round(main.arbRear)} ]\n`;
    output += `Packer Level F/R          = [ F: ${Math.round(main.packerFront)} / R: ${Math.round(main.packerRear)} ]\n`;

    output += `\n[4. DRIVETRAIN / 駆動系]\n`;
    output += `Diff Preload Setting      = ${baseline.preload} -> ${Math.round(main.preload)} ${getDeltaInt(baseline.preload, main.preload)} Nm\n`;
  }

  output += `\n[5. TYRE STRATEGY / タイヤ戦略]\n`;
  output += `Starting Tyre Compound    = ${main.wetness > 2 ? '[WET] ウェットタイヤ' : '[DRY] ドライタイヤ'}\n`;
  output += `(※気温 ${main.temp}°C / ${main.weatherName} に最適化済み)\n`;

  output += `\n[SESSION EVOLUTION (Slots 1-5)]\n`;
  output += `SLOT | WEATHER        | TEMP | TC | BB%  | TYRE\n`;
  output += `----------------------------------------------\n`;
  results.forEach((r, i) => {
    if (!r) return;
    const tyre = (r.wetness || 0) > 2 ? 'WET ' : 'DRY ';
    const wName = (r.weatherName || r.weatherId || 'Clear').toString();
    const tcStr = Math.round(r.tcMap || 0).toString();
    output += `${i+1}    | ${wName.padEnd(14)} | ${r.temp || 25}°C | ${tcStr.padEnd(2)} | ${(r.brakeBalance || 0).toFixed(1)} | ${tyre}\n`;
  });

  output += `\n------------------------------------\n`;
  output += `ENGINEERING ADVICE (v3.5 Damped Strategy):\n`;
  
  const hasIssues = main.tcMap !== baseline.tcMap || main.brakeBalance !== baseline.brakeBalance;
  if (!hasIssues) {
    output += `- 現状の設定（Baseline）は現在のコンディションに対して非常に安定しています。維持を推奨します。\n`;
  } else {
    output += `- ご友人のフィードバックに基づき、一気に数値を動かさず、現状をベースとした微調整（Smoothing）を行っています。\n`;
    output += `- 特定の走行フェーズにおける挙動不満を解消するため、関連項目をピンポイントで最適化しました。\n`;
  }

  return output;
};

// --- COMPONENT HELPERS ---

const LongPressButton = ({ onClick, style, children, disabled }) => {
  const timerRef = useRef(null);
  const intervalRef = useRef(null);

  const start = (e) => {
    e.preventDefault();
    if (disabled) return;
    onClick();
    timerRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        onClick();
      }, 70);
    }, 400);
  };

  const stop = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    return () => stop();
  }, []);

  return (
    <button
      onMouseDown={start}
      onMouseUp={stop}
      onMouseLeave={stop}
      onTouchStart={start}
      onTouchEnd={stop}
      style={style}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default function AISetupTool() {
  const [isLargeScreen, setIsLargeScreen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [classId, setClassId] = useState('HY');
  const [modelId, setModelId] = useState('ferrari_499p');
  const [circuit, setCircuit] = useState('lemans');
  const [mode, setMode] = useState('fixed');
  const [profile, setProfile] = useState('stable');
  
  // Smart Analysis (v3.5)
  const [diagnostics, setDiagnostics] = useState({
    entry_low: 'none',
    entry_high: 'none',
    mid_low: 'none',
    mid_high: 'none',
    exit_low: 'none',
    exit_high: 'none',
    curbs: 'none'
  });
  const [telemetry, setTelemetry] = useState(null);
  const [bestTime, setBestTime] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFirstGen, setIsFirstGen] = useState(true);
  
  const outputRef = useRef(null);
  
  // 5-slot Session Forecast
  const [sessionSlots, setSessionSlots] = useState([
    { weatherId: 'clear', temp: 25 },
    { weatherId: 'clear', temp: 25 },
    { weatherId: 'clear', temp: 25 },
    { weatherId: 'clear', temp: 25 },
    { weatherId: 'clear', temp: 25 },
  ]);

  const [setup, setSetup] = useState('');
  const [copied, setCopied] = useState(false);

  // v3.5 Baseline Setup State
  const [baselineSetup, setBaselineSetup] = useState({
    tcMap: 2,
    absMap: 2,
    tcPower: 2,
    tcSlip: 2,
    brakeBalance: 54.0,
    brakeDucts: 2,
    rearWing: 3,
    rhFront: 0,
    rhRear: 0,
    packerFront: 0,
    packerRear: 0,
    springFront: 0,
    springRear: 0,
    arbFront: 0,
    arbRear: 0,
    preload: 120
  });

  const handleSvmUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const newBaseline = { ...baselineSetup };
      
      const findVal = (key) => {
        const regex = new RegExp(`${key}=(\\d+\\.?\\d*)`, 'i');
        const match = text.match(regex);
        return match ? parseFloat(match[1]) : null;
      };

      // Extract values from SVM (LMU/rF2 format)
      const tc1 = findVal('TractionControlSetting');
      if (tc1 !== null) newBaseline.tcMap = tc1 + 1;
      const tc2 = findVal('TC2MapSetting');
      if (tc2 !== null) newBaseline.tcPower = tc2 + 1;
      const tc3 = findVal('TC3MapSetting');
      if (tc3 !== null) newBaseline.tcSlip = tc3 + 1;
      
      const abs = findVal('ABSSetting');
      if (abs !== null) newBaseline.absMap = abs + 1;
      
      const bb = findVal('BrakeBalanceSetting');
      if (bb !== null) newBaseline.brakeBalance = bb;
      
      const wing = findVal('RWSetting');
      if (wing !== null) newBaseline.rearWing = wing;

      const duct = findVal('BrakeDuctSetting');
      if (duct !== null) newBaseline.brakeDucts = duct;

      const rhf = findVal('FrontRideHeightSetting');
      if (rhf !== null) newBaseline.rhFront = rhf;
      const rhr = findVal('RearRideHeightSetting');
      if (rhr !== null) newBaseline.rhRear = rhr;

      const sf = findVal('FSpringSetting');
      if (sf !== null) newBaseline.springFront = sf;
      const sr = findVal('RSpringSetting');
      if (sr !== null) newBaseline.springRear = sr;

      const arbf = findVal('FAntiRollBarSetting');
      if (arbf !== null) newBaseline.arbFront = arbf;
      const arbr = findVal('RAntiRollBarSetting');
      if (arbr !== null) newBaseline.arbRear = arbr;

      const pkf = findVal('FPackerSetting');
      if (pkf !== null) newBaseline.packerFront = pkf;
      const pkr = findVal('RPackerSetting');
      if (pkr !== null) newBaseline.packerRear = pkr;

      const pre = findVal('DiffPreloadSetting');
      if (pre !== null) newBaseline.preload = pre;

      setBaselineSetup(newBaseline);
      alert('.svmファイルを読み取り、トラクションコントロール、リアサスペンションを含む全項目を反映しました。');
    };
    reader.readAsText(file);
  };

  // Update model when class changes
  useEffect(() => {
    const firstModel = CAR_MODELS[classId][0].id;
    setModelId(firstModel);
  }, [classId]);

  const handleGenerateSetup = () => {
    setIsGenerating(true);
    console.log("Starting Setup Generation v3.5...", { classId, modelId, circuit, profile, mode });
    
    // Simulate brief processing for premium feel
    setTimeout(() => {
      try {
        const config = { classId, modelId, circuitId: circuit, profileId: profile, mode };
        console.log("Config built, running calculateSetup...");
        
        const results = sessionSlots.map((slot, idx) => {
          console.log(`Analyzing Slot ${idx + 1}...`);
          return calculateSetup(config, diagnostics, telemetry, slot, baselineSetup);
        });
        
        console.log("Calculations complete, formatting output...");
        const output = formatOutput(results, config, baselineSetup);
        
        setSetup(output);
        setIsGenerating(false);
        setIsFirstGen(false);
        console.log("Setup Generation Complete.");
        
        if (outputRef.current) {
          outputRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      } catch (err) {
        console.error("SETUP_GEN_ERROR:", err);
        alert("セットアップ計算中にエラーが発生しました: " + err.message);
        setIsGenerating(false);
      }
    }, 1500);
  };

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n');
      
      let metadata = {
        venue: 'Unknown',
        vehicle: 'Unknown',
        lap: 'Unknown'
      };

      // Robust Header Parsing
      lines.slice(0, 30).forEach(line => {
        const parts = line.split(',').map(p => p.replace(/"/g, '').trim());
        if (parts[0] === 'Venue') metadata.venue = parts[1];
        if (parts[0] === 'Vehicle') metadata.vehicle = parts[1];
        if (parts[0] === 'Range') metadata.lap = parts[1];
      });

      setTelemetry({
        metadata,
        timestamp: new Date().toLocaleTimeString(),
        rawText: text.substring(0, 1000)
      });
      
      alert(`MoTeC Telemetry Loaded:\nVenue: ${metadata.venue}\nVehicle: ${metadata.vehicle}\nLap: ${metadata.lap}\n\nAnalyzing driving patterns...`);
    };
    reader.readAsText(file);
  };

  const updateSlot = (index, field, value) => {
    const newSlots = [...sessionSlots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setSessionSlots(newSlots);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(setup);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#ff003c]/30 p-4 md:p-8">
      <div className="max-w-6xl mx-auto pt-32 pb-12">
        
        {/* Header */}
        <header style={{ marginBottom: '3rem', borderLeft: '4px solid #ff003c', paddingLeft: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Zap style={{ color: '#00f0ff' }} size={24} />
            <h1 style={{ fontSize: '2.25rem', fontWeight: '900', fontStyle: 'italic', letterSpacing: '-0.05em', textTransform: 'uppercase', margin: 0 }}>
              AI <span style={{ color: '#ff003c' }}>Setup</span> Engineer <span style={{ fontSize: '0.75rem', backgroundColor: '#ff003c', color: 'white', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', marginLeft: '0.5rem', fontStyle: 'normal', letterSpacing: 'normal' }}>v3.6</span>
            </h1>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
            <p style={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
              Le Mans Ultimate - Professional Race Engineering Module
            </p>
            <p style={{ color: '#00f0ff', fontFamily: 'monospace', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.7, margin: 0 }}>
              [ 2024/25 Season & DLC Ready ]
            </p>
          </div>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* ROW 1: BASIC CONFIGURATION (HORIZONTAL) */}
          <section style={{ backgroundColor: '#111', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#00f0ff', letterSpacing: '0.15em', marginBottom: '1.25rem' }}>
              <Settings size={14} /> 1. Engineering Configuration
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: isLargeScreen ? 'repeat(4, 1fr)' : '1fr', gap: '1.5rem' }}>
              {/* Col 1: Vehicle */}
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div style={{ fontSize: '8px', color: '#64748b', fontWeight: '900', textTransform: 'uppercase' }}>Class & Vehicle</div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {CAR_CLASSES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setClassId(c.id)}
                      style={{
                        flex: 1, fontSize: '9px', fontWeight: '900', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid', cursor: 'pointer',
                        backgroundColor: classId === c.id ? '#ff003c' : 'rgba(0,0,0,0.4)',
                        borderColor: classId === c.id ? '#ff003c' : 'rgba(255,255,255,0.05)',
                        color: classId === c.id ? 'white' : '#64748b',
                      }}
                    >
                      {c.id}
                    </button>
                  ))}
                </div>
                <select
                  style={{ width: '100%', backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.75rem', fontSize: '12px', fontWeight: 'bold', color: 'white', outline: 'none' }}
                  value={modelId}
                  onChange={(e) => setModelId(e.target.value)}
                >
                  {(CAR_MODELS[classId] || []).map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              {/* Col 2: Track & Mode */}
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div style={{ fontSize: '8px', color: '#64748b', fontWeight: '900', textTransform: 'uppercase' }}>Track & Setup Mode</div>
                <select
                  style={{ width: '100%', backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.75rem', fontSize: '12px', fontWeight: 'bold', color: 'white', outline: 'none' }}
                  value={circuit}
                  onChange={(e) => setCircuit(e.target.value)}
                >
                  {CIRCUITS.map((cir) => (
                    <option key={cir.id} value={cir.id}>{cir.name}</option>
                  ))}
                </select>
                <div style={{ display: 'flex', backgroundColor: 'rgba(0,0,0,0.4)', padding: '0.25rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {['fixed', 'open'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      style={{
                        flex: 1, fontSize: '9px', fontWeight: '900', padding: '0.5rem 0', borderRadius: '0.375rem', transition: 'all', textTransform: 'uppercase', border: 'none', cursor: 'pointer',
                        backgroundColor: mode === m ? '#ff003c' : 'transparent',
                        color: mode === m ? 'white' : '#64748b'
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Col 3: Profile & SVM */}
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div style={{ fontSize: '8px', color: '#64748b', fontWeight: '900', textTransform: 'uppercase' }}>Driver Profile & Baseline</div>
                <select
                  style={{ width: '100%', backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.75rem', fontSize: '11px', fontWeight: 'bold', color: 'white', outline: 'none' }}
                  value={profile}
                  onChange={(e) => setProfile(e.target.value)}
                >
                  {DRIVER_PROFILES.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '9px', fontWeight: '900', padding: '0.75rem', backgroundColor: '#00f0ff', color: 'black', borderRadius: '0.5rem', transition: 'all' }}>
                  <FileUp size={14} /> IMPORT .SVM BASELINE
                  <input type="file" accept=".svm" style={{ display: 'none' }} onChange={handleSvmUpload} />
                </label>
              </div>

              {/* Col 4: Electronic Quick Setup */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div style={{ gridColumn: 'span 2', fontSize: '8px', color: '#64748b', fontWeight: '900', textTransform: 'uppercase' }}>Current Electronics (Baseline)</div>
                {[
                  { label: 'TC1', key: 'tcMap', step: 1, min: 1, max: 12 },
                  { label: 'TC2', key: 'tcPower', step: 1, min: 1, max: 12 },
                  { label: 'ABS', key: 'absMap', step: 1, min: 1, max: 12 },
                  { label: 'BB% (F)', key: 'brakeBalance', step: 0.1, min: 40, max: 80 }
                ].map(item => (
                  <div key={item.key} style={{ backgroundColor: 'black', padding: '0.375rem', borderRadius: '0.375rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.125rem' }}>
                    <span style={{ fontSize: '7px', color: '#71717a', textTransform: 'uppercase' }}>{item.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <LongPressButton 
                        onClick={() => setBaselineSetup(prev => ({ ...prev, [item.key]: Math.max(item.min, prev[item.key] - item.step) }))}
                        style={{ background: 'none', border: 'none', color: '#ff003c', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', padding: '0 0.25rem' }}
                      >-</LongPressButton>
                      <span style={{ fontSize: '10px', fontWeight: 'bold', fontFamily: 'monospace', color: 'white', minWidth: '1.5rem', textAlign: 'center' }}>
                        {item.key === 'brakeBalance' ? baselineSetup[item.key].toFixed(1) : Math.round(baselineSetup[item.key])}
                      </span>
                      <LongPressButton 
                        onClick={() => setBaselineSetup(prev => ({ ...prev, [item.key]: Math.min(item.max, prev[item.key] + item.step) }))}
                        style={{ background: 'none', border: 'none', color: '#00f0ff', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', padding: '0 0.25rem' }}
                      >+</LongPressButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ROW 2: SESSION FORECAST (HORIZONTAL) */}
          <section style={{ backgroundColor: '#111', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#00f0ff', letterSpacing: '0.15em', marginBottom: '1.25rem' }}>
              <Wind size={14} /> 2. Environmental Forecast (Slots 1-5)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: isLargeScreen ? 'repeat(5, 1fr)' : '1fr', gap: '0.75rem' }}>
              {sessionSlots.map((slot, index) => (
                <div key={index} style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '9px', fontWeight: '900', color: '#64748b' }}>SLOT #{index + 1}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Thermometer size={12} style={{ color: '#ff003c' }} />
                      <input
                        type="number"
                        value={slot.temp}
                        onChange={(e) => updateSlot(index, 'temp', parseInt(e.target.value) || 0)}
                        style={{ width: '2rem', backgroundColor: 'transparent', fontSize: '12px', fontFamily: 'monospace', fontWeight: '900', color: 'white', border: 'none', outline: 'none' }}
                      />
                      <span style={{ fontSize: '8px', color: '#64748b' }}>°C</span>
                    </div>
                  </div>
                  <select
                    style={{ width: '100%', backgroundColor: 'transparent', fontSize: '11px', fontWeight: 'bold', color: '#cbd5e1', outline: 'none', cursor: 'pointer', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem' }}
                    value={slot.weatherId}
                    onChange={(e) => updateSlot(index, 'weatherId', e.target.value)}
                  >
                    {WEATHER_CONDITIONS.map(w => (
                      <option key={w.id} value={w.id} style={{ backgroundColor: 'black' }}>{w.name}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </section>

          {/* ROW 3: SMART ANALYSIS LAB (HORIZONTAL) */}
          <section style={{ backgroundColor: '#111', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(255,0,60,0.2)', boxShadow: '0 0 30px rgba(255,0,60,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#00f0ff', letterSpacing: '0.15em' }}>
                <Zap size={14} style={{ color: '#00f0ff' }} /> 3. Smart Analysis Lab (Diagnostics)
              </label>
              <div style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold', fontFamily: 'monospace', opacity: 0.8 }}>MODEL_V3.6_ACTIVE</div>
            </div>

            {/* Engineer Guide Tooltip (v3.6.2) */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '0.875rem 1.25rem', borderRadius: '0.75rem', borderLeft: '3px solid #00f0ff', marginBottom: '2rem' }}>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0, lineHeight: '1.6' }}>
                <span style={{ color: '#00f0ff', fontWeight: '900', marginRight: '0.5rem' }}>[ DIAGNOSTIC GUIDE / 診断のヒント ]</span>
                <br />
                <span style={{ color: 'white' }}>低速コーナー:</span> ダウンフォースが低いため、サスペンションやデフ等の<span style={{ color: '#00f0ff', fontWeight: 'bold' }}>機械構造 (Mechanical)</span> が挙動を支配します。
                <br />
                <span style={{ color: 'white' }}>高速コーナー:</span> 空力の力が増し、ウィングや車高（前後の姿勢＝レーキ）等の<span style={{ color: '#ff003c', fontWeight: 'bold' }}>空気力学 (Aerodynamic)</span> が支配的になります。
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isLargeScreen ? '1fr 1fr 1fr' : '1fr', gap: '2rem' }}>
              {/* Col 1: Low Speed */}
              <div style={{ padding: '1rem', backgroundColor: 'rgba(0,240,255,0.02)', borderRadius: '1rem', border: '1px solid rgba(0,240,255,0.1)' }}>
                <div style={{ fontSize: '9px', color: '#00f0ff', fontWeight: '900', marginBottom: '1rem', textTransform: 'uppercase', textAlign: 'center', borderBottom: '1px solid rgba(0,240,255,0.1)', paddingBottom: '0.5rem' }}>低速コーナー (メカニカル重視)</div>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {[
                    { label: '進入 (Entry) - 低速', key: 'entry_low' },
                    { label: '中間 (Mid) - 低速', key: 'mid_low' },
                    { label: '脱出 (Exit) - 低速', key: 'exit_low' }
                  ].map(item => (
                    <div key={item.key}>
                      <div style={{ fontSize: '8px', color: '#71717a', marginBottom: '0.25rem', fontWeight: 'bold' }}>{item.label}</div>
                      <select 
                        style={{ width: '100%', backgroundColor: 'black', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0.5rem', padding: '0.625rem', fontSize: '11px', fontWeight: 'bold', color: 'white', outline: 'none' }}
                        value={diagnostics[item.key]}
                        onChange={(e) => setDiagnostics({...diagnostics, [item.key]: e.target.value})}
                      >
                        <option value="none">問題なし</option>
                        <option value="understeer">アンダー</option>
                        <option value="oversteer">オーバー</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Col 2: High Speed */}
              <div style={{ padding: '1rem', backgroundColor: 'rgba(255,0,60,0.02)', borderRadius: '1rem', border: '1px solid rgba(255,0,60,0.1)' }}>
                <div style={{ fontSize: '9px', color: '#ff003c', fontWeight: '900', marginBottom: '1rem', textTransform: 'uppercase', textAlign: 'center', borderBottom: '1px solid rgba(255,0,60,0.1)', paddingBottom: '0.5rem' }}>高速コーナー (空力・レーキ重視)</div>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {[
                    { label: '進入 (Entry) - 高速', key: 'entry_high' },
                    { label: '中間 (Mid) - 高速', key: 'mid_high' },
                    { label: '脱出 (Exit) - 高速', key: 'exit_high' }
                  ].map(item => (
                    <div key={item.key}>
                      <div style={{ fontSize: '8px', color: '#71717a', marginBottom: '0.25rem', fontWeight: 'bold' }}>{item.label}</div>
                      <select 
                        style={{ width: '100%', backgroundColor: 'black', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0.5rem', padding: '0.625rem', fontSize: '11px', fontWeight: 'bold', color: 'white', outline: 'none' }}
                        value={diagnostics[item.key]}
                        onChange={(e) => setDiagnostics({...diagnostics, [item.key]: e.target.value})}
                      >
                        <option value="none">問題なし</option>
                        <option value="understeer">アンダー</option>
                        <option value="oversteer">オーバー</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Col 3: Curbs & Telemetry */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: '#0c0c0c', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '8px', color: '#71717a', marginBottom: '0.25rem', fontWeight: 'bold' }}>縁石 (Curbs) - 走破性</div>
                  <select 
                    style={{ width: '100%', backgroundColor: 'black', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0.5rem', padding: '0.625rem', fontSize: '11px', fontWeight: 'bold', color: 'white', outline: 'none' }}
                    value={diagnostics.curbs}
                    onChange={(e) => setDiagnostics({...diagnostics, curbs: e.target.value})}
                  >
                    <option value="none">問題なし</option>
                    <option value="bumpy">跳ねる</option>
                  </select>
                </div>

                <div style={{ flex: 1, position: 'relative', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1rem', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <input 
                    type="file" 
                    accept=".csv" 
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                    onChange={handleCsvUpload}
                  />
                  <FileUp size={24} className={telemetry ? "text-[#00f0ff]" : "text-zinc-600"} style={{ marginBottom: '0.5rem' }} />
                  {telemetry ? (
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '10px', fontWeight: '900', color: '#00f0ff', margin: 0 }}>TELEMETRY CONNECTED</p>
                      <p style={{ fontSize: '8px', color: '#64748b', marginTop: '0.25rem', fontFamily: 'monospace' }}>
                        {telemetry.metadata.venue} | {telemetry.metadata.lap}
                      </p>
                    </div>
                  ) : (
                    <p style={{ fontSize: '10px', fontWeight: '900', color: '#64748b', margin: 0 }}>DROP MoTeC CSV</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ACTION BUTTON (CENTERED) */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255,0,60,0.3)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateSetup}
              disabled={isGenerating}
              style={{
                width: isLargeScreen ? '400px' : '100%', padding: '1.5rem', borderRadius: '1rem', fontWeight: '900', fontSize: '16px', letterSpacing: '0.1em', transition: 'all', border: 'none', cursor: isGenerating ? 'not-allowed' : 'pointer',
                background: isGenerating ? '#27272a' : 'linear-gradient(90deg, #ff003c, #ff4d79, #ff003c)',
                color: 'white',
              }}
            >
              {isGenerating ? "ANALYZING DATA..." : "GENERATE FINAL SETUP"}
            </motion.button>
          </div>

        </div>

          {/* BOTTOM: OUTPUT ONLY */}
          <div 
            ref={outputRef} 
            style={{ 
              gridColumn: isLargeScreen ? 'span 12 / span 12' : 'auto',
              marginTop: '1.5rem',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              paddingTop: '3rem',
              transition: 'all 1s',
              opacity: isFirstGen ? 0.2 : 1
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.5rem', marginBottom: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.1em' }}>
                <ShieldCheck size={14} style={{ color: '#ff003c' }} /> Computed Setup Data (v3.6)
              </label>
              <button
                onClick={copyToClipboard}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.5rem', borderRadius: '9999px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'all', border: 'none', cursor: 'pointer',
                  backgroundColor: copied ? '#00f0ff' : 'rgba(255,255,255,0.05)',
                  color: copied ? 'black' : '#94a3b8'
                }}
              >
                {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy Script</>}
              </button>
            </div>
            
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'relative', backgroundColor: '#0a0a0a', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', overflow: 'hidden', minHeight: '500px' }}>
                <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.625', color: '#cbd5e1', whiteSpace: 'pre-wrap' }}>
                  {setup}
                </pre>
              </div>
            </div>

            <div style={{ backgroundColor: '#121212', padding: '1.25rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'start', gap: '1rem', marginTop: '1.5rem' }}>
              <div style={{ backgroundColor: 'rgba(255,0,60,0.2)', padding: '0.625rem', borderRadius: '0.75rem' }}>
                <Info size={20} style={{ color: '#ff003c' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '11px', color: '#e2e8f0', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0 0 0.375rem 0' }}>Engineering Certification:</p>
                <p style={{ fontSize: '10px', color: '#64748b', lineHeight: '1.625', margin: 0, maxWidth: '48rem' }}>
                  算出された設定値は Le Mans Ultimate 2025 シーズンの物理モデルに基づいています。
                  1.基本設定、2.セッション予測、3.スマート解析ラボ(診断+テレメトリ)の3つの情報源をAIが多角的に分析し、
                  対象セッションにおいて最も安定し、かつ競争力のある1周を刻むための最適化を行っています。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <footer className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#ff003c]">
            AI SETUP ENGINEER v3.6.0 // SMART ANALYSIS LAB // OPTIMIZED FOR LMU 2025
          </p>
          <div className="flex key-value gap-6">
             <span className="text-[10px] font-mono">[ STRATEGY ENGINE ACTIVE ]</span>
             <span className="text-[10px] font-mono">[ 2025 DATA V4.0 ]</span>
          </div>
        </footer>

      </div>
    );
  }
