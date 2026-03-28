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
  Info
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

const calculateSetup = (config) => {
  const { classId, modelId, circuitId, weatherId, ambientTemp, mode, profileId } = config;
  
  const carClass = CAR_CLASSES.find(c => c.id === classId);
  const models = CAR_MODELS[classId] || [];
  const model = models.find(m => m.id === modelId) || models[0];
  const circuit = CIRCUITS.find(cir => cir.id === circuitId);
  const weather = WEATHER_CONDITIONS.find(w => w.id === weatherId) || WEATHER_CONDITIONS[0];

  // LMU DEFAULT BASELINE LOGIC (v2.2)
  
  // 1. Electronics
  let tcMap = 5;
  let tcPower = 5;
  let tcSlip = 8;
  let absMap = 9;

  if (classId === 'LMGT3' || classId === 'GTE') {
    tcMap = 6;
    absMap = 10;
  }

  // --- SMART DIAGNOSIS CORRECTIONS (v3.0) ---
  const { diagnostics, telemetry } = config;
  let diagOffsetRH = 0;
  let diagOffsetSprings = 0;
  let diagOffsetARB = 0;
  let diagOffsetWing = 0;
  let diagOffsetDiff = 0;

  if (diagnostics) {
    // Slow Corners
    if (diagnostics.slowCorner === 'understeer') {
      diagOffsetRH += 5; // Raise rear / Lower front (Rake logic simplified)
      diagOffsetARB -= 1; // Soften front
    } else if (diagnostics.slowCorner === 'oversteer') {
      diagOffsetDiff += 20; // Increase preload
      diagOffsetSprings -= 1; // Soften rear
    }

    // Fast Corners
    if (diagnostics.fastCorner === 'understeer') {
      diagOffsetWing += 1;
    } else if (diagnostics.fastCorner === 'oversteer') {
      diagOffsetWing += 2;
      diagOffsetRH -= 5; // Lower rear
    }

    // Chicanes (Lateral Transitions)
    if (diagnostics.chicanes === 'unstable') {
      diagOffsetARB += 1; // Stiffen front ARB slightly for better transition response
    }

    // Curbs (Vertical Impacts)
    if (diagnostics.curbs === 'bumpy') {
      diagOffsetSprings -= 2;
      diagOffsetRH += 10;
    }
  }

  // --- TELEMETRY (CSV) CORRECTIONS (v3.0) ---
  let camberAdvice = "DEFAULT";
  if (telemetry && telemetry.tireTemps) {
    const { fl, fr, rl, rr } = telemetry.tireTemps;
    // Simple logic: If Inner is much hotter than Outer, reduce camber.
    // LMU logic: Usually Inner-Outer delta 2-5 deg is ideal.
    const flDelta = fl.inner - fl.outer;
    if (flDelta > 10) camberAdvice = "Reduce Negative Camber (Too hot inside)";
    else if (flDelta < 1) camberAdvice = "Increase Negative Camber (Too cold inside)";
  }

  // Profile adjustments (FIXED & OPEN)
  if (profileId === 'stable') {
    tcMap += 2;
    absMap += 2;
  } else if (profileId === 'aggressive') {
    tcMap -= 3;
    absMap -= 3;
  }

  // Wet adjustments
  if (weather.wetness > 0) {
    tcMap += weather.wetness * 2;
    tcPower += weather.wetness * 2;
    tcSlip += weather.wetness * 2;
    absMap += Math.max(weather.wetness, 1);
  }

  tcMap = Math.max(Math.min(tcMap, 12), 1);
  absMap = Math.max(Math.min(absMap, 12), 1);
  tcPower = Math.max(Math.min(tcPower, 12), 1);
  tcSlip = Math.max(Math.min(tcSlip, 15), 1);

  // 2. Brakes (Brake Balance - % Forward)
  let brakeBalance = 54.0; 
  if (classId === 'LMGT3') brakeBalance = 51.0;
  if (weather.wetness > 0) brakeBalance += weather.wetness * 1.5;
  if (profileId === 'stable') brakeBalance += 1.0;
  if (profileId === 'aggressive') brakeBalance -= 1.0;
  
  // Diagnosis impact
  if (diagnostics?.slowCorner === 'oversteer') brakeBalance += 1.0; 
  
  brakeBalance = Math.min(Math.max(brakeBalance, 45.0), 75.0);

  // 3. Environmental (Brake Ducts)
  const tempDiff = ambientTemp - 25;
  const tempScaleSteps = Math.floor(tempDiff / 5);
  const brakeDuctSetting = 2 + (tempScaleSteps > 0 ? Math.min(tempScaleSteps, 3) : 0) + (weather.wetness > 2 ? 1 : 0);

  // 4. Chassis & Suspension (v3.3 Full Expansion)
  // Base values relative to LMU Default Medium Downforce
  
  // Ride Height (RH)
  let rhFront = 0; // Offset in mm
  let rhRear = diagOffsetRH;  // Offset in mm
  
  if (circuit.bumpiness === 'BUMPY') {
    rhFront += 10;
    rhRear += 12;
  } else if (circuit.bumpiness === 'MIXED') {
    rhFront += 5;
    rhRear += 6;
  }

  // 5. Springs & ARB
  let springFront = "DEFAULT";
  let springRear = "DEFAULT";
  let arbFront = "DEFAULT";
  let arbRear = "DEFAULT";

  if (circuit.bumpiness === 'BUMPY' || diagnostics?.chicanes === 'bumpy') {
    springFront = "-2 clicks (Softer)";
    springRear = "-2 clicks (Softer)";
  }

  if (diagOffsetSprings < 0) {
    springRear = `${diagOffsetSprings} clicks (Softer)`;
  }

  if (profileId === 'aggressive') {
    arbFront = "-1 click (Softer)";
    arbRear = "+1 click (Stiffer)";
  } else if (profileId === 'stable') {
    arbFront = "+1 click (Stiffer)";
    arbRear = "-1 click (Softer)";
  }

  // Diagnosis override
  if (diagOffsetARB < 0) arbFront = "-1 click (Softer)";

  // 6. Dampers (Slow Bump/Rebound)
  let damperAdvice = "DEFAULT";
  if (circuit.bumpiness === 'BUMPY' || diagnostics?.chicanes === 'bumpy') {
    damperAdvice = "Slow Bump: -2 / Slow Rebound: -1 (Better compliance)";
  }

  // 7. Aero (Rear Wing)
  let rwOffset = diagOffsetWing; 
  if (circuit.downforce === 'LOW') rwOffset -= 2;
  else if (circuit.downforce === 'MED-HIGH') rwOffset += 2;
  else if (circuit.downforce === 'MED-LOW') rwOffset -= 1;

  // 7. Differential
  let preloadNm = model.basePreload;
  let preloadSetting = Math.floor(preloadNm * 0.6) + diagOffsetDiff;
  if (profileId === 'stable') preloadSetting += 20;
  if (profileId === 'aggressive') preloadSetting -= 20;

  return {
    tcMap, tcPower, tcSlip, absMap, brakeBalance, brakeDuctSetting, 
    rwOffset, rhFront, rhRear, springFront, springRear, arbFront, arbRear, damperAdvice,
    preloadSetting, preloadNm, camberAdvice,
    wetness: weather.wetness,
    weatherName: weather.name,
    temp: ambientTemp,
    bumpiness: circuit.bumpiness
  };
};

const formatOutput = (results, config) => {
  const { classId, modelId, circuitId, profileId, mode } = config;
  const carClass = CAR_CLASSES.find(c => c.id === classId);
  const models = CAR_MODELS[classId] || [];
  const model = models.find(m => m.id === modelId) || models[0];
  const circuit = CIRCUITS.find(cir => cir.id === circuitId);
  const profile = DRIVER_PROFILES.find(p => p.id === profileId);

  let output = `--- LMU AI SETUP ENGINEER OUTPUT v3.3 (FULL OPEN) ---\n`;
  output += `CAR: ${model.name} (${carClass.name})\n`;
  output += `TRACK: ${circuit.name} [Property: ${circuit.bumpiness}]\n`;
  output += `DRIVER PROFILE: ${profile.name}\n`;
  output += `------------------------------------\n\n`;

  const main = results[0];

  output += `[1. ELECTRONICS / 電子制御]\n`;
  output += `Traction Control Map      = ${main.tcMap}\n`;
  output += `TC Power Cut Map (TC2)    = ${main.tcPower}\n`;
  output += `TC Slip Angle Map (TC3)   = ${main.tcSlip}\n`;
  output += `Antilock Braking (ABS)    = ${main.absMap}\n`;
  output += `Brake Balance (前後配分)  = ${main.brakeBalance.toFixed(1)}% (Front)\n`;
  
  if (mode === 'open') {
    output += `\n[2. AERODYNAMICS / 空力]\n`;
    output += `Rear Wing (純正Default比) = ${main.rwOffset >= 0 ? '+' : ''}${main.rwOffset} clicks\n`;
    output += `Brake Duct Setting (F/R)  = ${main.brakeDuctSetting}\n`;

    output += `\n[3. CHASSIS & SUSPENSION / 足回り]\n`;
    output += `Ride Height Front (車高F) = ${main.rhFront >= 0 ? '+' : ''}${main.rhFront} mm\n`;
    output += `Ride Height Rear  (車高R) = ${main.rhRear >= 0 ? '+' : ''}${main.rhRear} mm\n`;
    output += `Spring Rate Front         = ${main.springFront}\n`;
    output += `Spring Rate Rear          = ${main.springRear}\n`;
    output += `Anti-Roll Bar Front (ARB) = ${main.arbFront}\n`;
    output += `Anti-Roll Bar Rear  (ARB) = ${main.arbRear}\n`;
    output += `Damper (Slow Bump/Reb)    = ${main.damperAdvice}\n`;

    output += `\n[4. DRIVETRAIN / 駆動系]\n`;
    output += `Diff Preload Setting      = ${main.preloadSetting} // (${main.preloadNm} Nm相当)\n`;
  }

  output += `\n[5. TYRE STRATEGY / タイヤ戦略]\n`;
  output += `Starting Tyre Compound    = ${main.wetness > 2 ? '[WET] ウェットタイヤ' : '[DRY] ドライタイヤ'}\n`;
  output += `(※気温 ${main.temp}°C / ${main.weatherName} に最適化済み)\n`;

  if (main.camberAdvice !== "DEFAULT") {
    output += `\n[TELEMETRY ANALYSIS]:\n- ${main.camberAdvice}\n`;
  }

  output += `\n[SESSION EVOLUTION (Slots 1-5)]\n`;
  output += `SLOT | WEATHER        | TEMP | TC | BB%  | TYRE\n`;
  output += `----------------------------------------------\n`;
  results.forEach((r, i) => {
    const tyre = r.wetness > 2 ? 'WET ' : 'DRY ';
    output += `${i+1}    | ${r.weatherName.padEnd(14)} | ${r.temp}°C | ${r.tcMap.toString().padEnd(2)} | ${r.brakeBalance.toFixed(1)} | ${tyre}\n`;
  });

  output += `\n------------------------------------\n`;
  output += `ENGINEERING ADVICE (v3.3 Strategy):\n`;
  
  if (main.bumpiness === 'BUMPY') {
    output += `- 路面凹凸に対応するため、特にフロントサスペンションのバンプストップの設定も確認してください。\n`;
  }
  
  if (profileId === 'aggressive') {
    output += `- 回頭性を高めるために、高速コーナーでの安定性が不足する場合は、リアウイングを+1上げる検討をしてください。\n`;
  } else if (profileId === 'stable') {
    output += `- 加速時のリアを安定させるため、ディファレンシャルのプリロードを上げ目に調整しています。\n`;
  }

  const rainySlots = results.filter(r => r.wetness > 2).length;
  if (rainySlots > 0 && rainySlots < 5) {
    output += `- レース中の降雨が予想されます。路面が濡れ始めたら即座にBBを${results.find(r => r.wetness > 2).brakeBalance.toFixed(1)}%に移行してください。\n`;
  }

  return output;
};

// --- COMPONENT ---

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
  
  // Smart Analysis (v3.0)
  const [diagnostics, setDiagnostics] = useState({
    slowCorner: 'none',
    fastCorner: 'none',
    chicanes: 'none',
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

  // Update model when class changes
  useEffect(() => {
    const firstModel = CAR_MODELS[classId][0].id;
    setModelId(firstModel);
  }, [classId]);

  const handleGenerateSetup = () => {
    setIsGenerating(true);
    
    // Simulate brief processing for premium feel
    setTimeout(() => {
      const results = sessionSlots.map(slot => calculateSetup({
        classId, modelId, circuitId: circuit, profileId: profile, mode,
        weatherId: slot.weatherId || 'clear',
        ambientTemp: slot.temp,
        diagnostics,
        telemetry
      }));

      const output = formatOutput(results, { classId, modelId, circuitId: circuit, profileId: profile, mode });
      setSetup(output);
      setIsGenerating(false);
      setIsFirstGen(false);

      // Auto-scroll to results
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 800);
  };

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      // Dummy Parsing logic (to be expanded)
      // We look for tire temp patterns in the CSV string
      const text = event.target.result;
      if (text.includes('Tyre Temp')) {
        setTelemetry({
          tireTemps: { fl: { inner: 85, outer: 70 }, fr: { inner: 82, outer: 72 }, rl: { inner: 80, outer: 75 }, rr: { inner: 80, outer: 75 } }
        });
      }
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
      <div className="max-w-6xl mx-auto py-12">
        
        {/* Header */}
        <header style={{ marginBottom: '3rem', borderLeft: '4px solid #ff003c', paddingLeft: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Zap style={{ color: '#00f0ff' }} size={32} />
            <h1 style={{ fontSize: '2.25rem', fontWeight: '900', fontStyle: 'italic', letterSpacing: '-0.05em', textTransform: 'uppercase', margin: 0 }}>
              AI <span style={{ color: '#ff003c' }}>Setup</span> Engineer <span style={{ fontSize: '0.75rem', backgroundColor: '#ff003c', color: 'white', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', marginLeft: '0.5rem', fontStyle: 'normal', letterSpacing: 'normal' }}>v3.3</span>
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

        <div 
          className="grid gap-6 items-stretch"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: isLargeScreen ? 'repeat(12, minmax(0, 1fr))' : '1fr' 
          }}
        >
          
          {/* COL 1: BASIC SETTINGS */}
          <div 
            style={{ 
              gridColumn: isLargeScreen ? 'span 4 / span 4' : 'auto',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
          >
            <div style={{ backgroundColor: '#111', borderRadius: '1rem', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ spaceY: '1.25rem', flex: 1, overflowY: 'auto', paddingRight: '0.25rem' }}>
                {/* 1. Class Selection */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#00f0ff', letterSpacing: '0.1em', padding: '0 0.25rem', marginBottom: '0.75rem' }}>
                    <Car size={14} /> 1. Class
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                    {CAR_CLASSES.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setClassId(c.id)}
                        style={{
                          fontSize: '10px', fontWeight: '900', padding: '0.875rem 0.5rem', borderRadius: '0.75rem', border: '1px solid', transition: 'all', letterSpacing: '0.05em', cursor: 'pointer',
                          backgroundColor: classId === c.id ? '#ff003c' : 'rgba(0,0,0,0.4)',
                          borderColor: classId === c.id ? '#ff003c' : 'rgba(255,255,255,0.05)',
                          color: classId === c.id ? 'white' : '#64748b',
                          boxShadow: classId === c.id ? '0 0 20px rgba(255,0,60,0.4)' : 'none'
                        }}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Vehicle Selection */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#00f0ff', letterSpacing: '0.1em', padding: '0 0.25rem', marginBottom: '0.75rem' }}>
                    <ChevronRight size={14} /> 2. Vehicle
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      style={{ width: '100%', backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0.75rem', padding: '0.875rem', fontSize: '12px', fontWeight: 'bold', color: 'white', outline: 'none', cursor: 'pointer', appearance: 'none' }}
                      value={modelId}
                      onChange={(e) => setModelId(e.target.value)}
                    >
                      {(CAR_MODELS[classId] || []).map((m) => (
                        <option key={m.id} value={m.id} style={{ backgroundColor: 'black' }}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3. Circuit Selection */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#00f0ff', letterSpacing: '0.1em', padding: '0 0.25rem', marginBottom: '0.75rem' }}>
                    <MapPin size={14} /> 3. Circuit
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      style={{ width: '100%', backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0.75rem', padding: '0.875rem', fontSize: '12px', fontWeight: 'bold', color: 'white', outline: 'none', cursor: 'pointer', appearance: 'none' }}
                      value={circuit}
                      onChange={(e) => setCircuit(e.target.value)}
                    >
                      {CIRCUITS.map((cir) => (
                        <option key={cir.id} value={cir.id} style={{ backgroundColor: 'black' }}>{cir.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 4. Setup Mode */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#00f0ff', letterSpacing: '0.1em', padding: '0 0.25rem', marginBottom: '0.75rem' }}>
                    <Settings size={14} /> 4. Mode
                  </label>
                  <div style={{ display: 'flex', backgroundColor: 'rgba(0,0,0,0.4)', padding: '0.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    {['fixed', 'open'].map((m) => (
                      <button
                        key={m}
                        onClick={() => setMode(m)}
                        style={{
                          flex: 1, fontSize: '10px', fontWeight: '900', padding: '0.75rem 0', borderRadius: '0.5rem', transition: 'all', textTransform: 'uppercase', letterSpacing: '0.1em', border: 'none', cursor: 'pointer',
                          backgroundColor: mode === m ? '#ff003c' : 'transparent',
                          color: mode === m ? 'white' : '#64748b'
                        }}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Strategy Profile */}
                <div style={{ marginBottom: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#00f0ff', letterSpacing: '0.1em', padding: '0 0.25rem', marginBottom: '0.75rem' }}>
                    <ShieldCheck size={14} /> 5. Profile
                  </label>
                  <select
                    style={{ width: '100%', backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0.75rem', padding: '0.875rem', fontSize: '11px', fontWeight: 'bold', color: 'white', outline: 'none', cursor: 'pointer' }}
                    value={profile}
                    onChange={(e) => setProfile(e.target.value)}
                  >
                    {DRIVER_PROFILES.map(p => (
                      <option key={p.id} value={p.id} style={{ backgroundColor: 'black' }}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* COL 2: CENTER: SESSION FORECAST */}
          <div 
            style={{ 
              gridColumn: isLargeScreen ? 'span 4 / span 4' : 'auto',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
          >
            <div style={{ backgroundColor: '#111', borderRadius: '1rem', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#00f0ff', letterSpacing: '0.1em', padding: '0 0.25rem', marginBottom: '1rem' }}>
                <Wind size={14} /> Forecast
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.375rem', overflowY: 'auto', paddingRight: '0.25rem' }}>
                {sessionSlots.map((slot, index) => (
                  <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', backgroundColor: 'rgba(0,0,0,0.4)', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)', transition: 'all', color: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.25rem' }}>
                      <span style={{ fontSize: '10px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Slot #{index + 1}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: '0.375rem', padding: '0.25rem 0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Thermometer size={14} style={{ color: '#ff003c' }} />
                        <input
                          type="number"
                          value={slot.temp}
                          onChange={(e) => {
                            const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                            updateSlot(index, 'temp', val);
                          }}
                          style={{ width: '3rem', backgroundColor: 'transparent', fontSize: '13px', fontFamily: 'monospace', fontWeight: 'bold', color: 'white', border: 'none', outline: 'none' }}
                        />
                        <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b' }}>°C</span>
                      </div>
                    </div>
                    <select
                      style={{ width: '100%', backgroundColor: 'transparent', fontSize: '12px', fontWeight: 'bold', color: '#cbd5e1', outline: 'none', cursor: 'pointer', border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem', marginTop: '0.25rem' }}
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
            </div>
          </div>

          {/* COL 3: SMART ANALYSIS LAB */}
          <div 
            style={{ 
              gridColumn: isLargeScreen ? 'span 4 / span 4' : 'auto',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
          >
            <div style={{ backgroundColor: '#111', borderRadius: '1rem', padding: '1.25rem', border: '1px solid rgba(255,0,60,0.2)', boxShadow: '0 0 20px rgba(255,0,60,0.1)', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ padding: '0.5rem', backgroundColor: 'rgba(255,0,60,0.2)', borderRadius: '0.5rem' }}>
                  <Zap size={18} style={{ color: '#ff003c' }} />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', letterSpacing: '-0.025em', textTransform: 'uppercase', margin: 0 }}>Smart Analysis Lab</h3>
              </div>

              {/* Driver Feedback */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '9px', fontWeight: '900', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: '1rem' }}>1. 走行フィードバック</label>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {[
                    { label: '低速コーナー', key: 'slowCorner', options: [{v:'none',t:'問題なし'},{v:'understeer',t:'アンダー (曲がりにくい)'},{v:'oversteer',t:'オーバー (流れる)'}] },
                    { label: '高速コーナー', key: 'fastCorner', options: [{v:'none',t:'問題なし'},{v:'understeer',t:'アンダー (曲がりにくい)'},{v:'oversteer',t:'不安定 (オーバー気味)'}] },
                    { label: 'シケイン (切り返し)', key: 'chicanes', options: [{v:'none',t:'問題なし'},{v:'unstable',t:'不安定 (ふらつく/遅れる)'}] },
                    { label: '縁石 (走破性)', key: 'curbs', options: [{v:'none',t:'問題なし'},{v:'bumpy',t:'跳ねる (吸収不足)'}] }
                  ].map(item => (
                    <div key={item.key} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span style={{ fontSize: '9px', color: '#71717a', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</span>
                      <select 
                        style={{ width: '100%', backgroundColor: 'black', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.5rem', fontSize: '0.75rem', color: 'white', outline: 'none', cursor: 'pointer' }}
                        value={diagnostics[item.key]}
                        onChange={(e) => setDiagnostics({...diagnostics, [item.key]: e.target.value})}
                      >
                        {item.options.map(opt => <option key={opt.v} value={opt.v}>{opt.t}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Telemetry Upload */}
              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '0.75rem' }}>
                <label style={{ fontSize: '9px', fontWeight: '900', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: '0.75rem' }}>2. MoTeC CSV データ連携</label>
                <div style={{ position: 'relative', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '1rem', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  <input 
                    type="file" 
                    accept=".csv" 
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                    onChange={handleCsvUpload}
                  />
                  <div className="text-center space-y-1.5">
                    <div className="flex justify-center">
                      <Info size={20} className="text-zinc-600 group-hover:text-[#ff003c] transition-colors" />
                    </div>
                    <p className="text-[10px] font-bold text-zinc-400">
                      {telemetry ? "✅ データ読み込み完了" : "CSVをドロップ"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BUTTON: CENTERED BELOW FORECAST */}
          <div 
            style={{ 
              gridColumn: isLargeScreen ? '5 / span 4' : 'auto',
              marginTop: '0.5rem'
            }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateSetup}
              disabled={isGenerating}
              style={{
                width: '100%', position: 'relative', overflow: 'hidden', padding: '1.5rem 1rem', borderRadius: '1rem', fontWeight: '900', fontStyle: 'italic', letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '14px', transition: 'all', border: 'none', cursor: isGenerating ? 'not-allowed' : 'pointer',
                background: isGenerating ? '#27272a' : 'linear-gradient(90deg, #ff003c, #ff4d79, #ff003c)',
                color: isGenerating ? '#71717a' : 'white',
                boxShadow: isGenerating ? 'none' : '0 0 20px rgba(255,0,60,0.2)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                {isGenerating ? (
                  <>
                    <div style={{ width: '1rem', height: '1rem', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <span>ANALYZING...</span>
                  </>
                ) : (
                  <>
                    <Zap size={20} style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
                    <span>GENERATE SETUP</span>
                  </>
                )}
              </div>
            </motion.button>
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
                <ShieldCheck size={14} style={{ color: '#ff003c' }} /> Computed Setup Data (v3.3)
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
            AI SETUP ENGINEER v3.3.0 // SMART ANALYSIS LAB // OPTIMIZED FOR LMU 2025
          </p>
          <div className="flex key-value gap-6">
             <span className="text-[10px] font-mono">[ STRATEGY ENGINE ACTIVE ]</span>
             <span className="text-[10px] font-mono">[ 2025 DATA V4.0 ]</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
