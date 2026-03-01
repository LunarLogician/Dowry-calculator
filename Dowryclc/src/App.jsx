import { useState, useEffect, useRef } from "react";
import "./App.css";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const formatPKR = (n) =>
  `PKR ${Math.round(n).toLocaleString("en-PK")}`;

// ─────────────────────────────────────────────
// BMI Preview widget
// ─────────────────────────────────────────────
function BmiPreview({ height, weight }) {
  const bmi = parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2);
  if (isNaN(bmi) || !isFinite(bmi)) return null;
  const bmiRounded = Math.round(bmi * 10) / 10;
  const { label, color } =
    bmi < 18.5  ? { label: "Underweight",    color: "#e09040" } :
    bmi <= 24.9 ? { label: "Healthy weight",  color: "#5cba7d" } :
    bmi <= 29.9 ? { label: "Overweight",      color: "#e09040" } :
                  { label: "Obese",            color: "#e05555" };
  return (
    <div className="bmi-preview" style={{ borderColor: color }}>
      <span style={{ color }}>BMI {bmiRounded} — {label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// Looks color helper
// ─────────────────────────────────────────────
function looksColor(val) {
  const v = parseInt(val);
  if (v >= 8) return "#16a34a";
  if (v >= 5) return "#b5421a";
  return "#dc2626";
}

// ─────────────────────────────────────────────
// Animated Number Counter
// ─────────────────────────────────────────────
function AnimatedNumber({ target }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const duration = 2000;
    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCurrent(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return <>{formatPKR(current)}</>;
}

// ─────────────────────────────────────────────
// Score Ring
// ─────────────────────────────────────────────
function ScoreRing({ score }) {
  const radius = 44;
  const circ = 2 * Math.PI * radius;
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(t);
  }, [score]);
  const offset = circ - (animated / 100) * circ;
  const color =
    score >= 75 ? "#16a34a" :
    score >= 50 ? "#b5421a" :
    score >= 30 ? "#e09040" : "#dc2626";
  return (
    <div className="score-ring-wrap">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={radius} fill="none" stroke="#f5ddd7" strokeWidth="10" />
        <circle
          cx="55" cy="55" r={radius} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 55 55)"
          style={{ transition: "stroke-dashoffset 1.8s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div className="score-ring-label">
        <span className="score-ring-num" style={{ color }}>{score}</span>
        <span className="score-ring-sub">/ 100</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Progress Steps
// ─────────────────────────────────────────────
const STEP_LABELS = ["Physical", "Appearance", "Social", "Background"];

function StepProgress({ current }) {
  return (
    <div className="step-progress">
      {STEP_LABELS.map((label, i) => {
        const num = i + 1;
        const done = current > num;
        const active = current === num;
        return (
          <div key={num} className="step-prog-item">
            <div className={`step-prog-dot ${active ? "active" : done ? "done" : ""}`}>
              {done ? "✓" : num}
            </div>
            <span className={`step-prog-label ${active ? "active" : ""}`}>{label}</span>
            {i < STEP_LABELS.length - 1 && (
              <div className={`step-prog-line ${done ? "done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// Form Field Wrappers
// ─────────────────────────────────────────────
function Field({ label, hint, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {hint && <p className="field-hint">{hint}</p>}
      {children}
    </div>
  );
}

function SelectField({ label, hint, value, onChange, options }) {
  return (
    <Field label={label} hint={hint}>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </Field>
  );
}

// ─────────────────────────────────────────────
// Main App
// ─────────────────────────────────────────────
const DEFAULT_INPUTS = {
  age: "", height: "", weight: "",
  looks: 7,
  isTen: "no",
  knownDuration: "1to3", nature: "balanced",
  bestfriend: "no", maleFriends: "few",
  education: "bachelors", familyBackground: "middle", cookingSkill: "decent",
};

export default function DowryCalculator() {
  const [step, setStep] = useState(0);   // 0=intro 1-4=form 5=loading 6=result
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState("");
  const [validErr, setValidErr] = useState("");
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  const set = (k, v) => { setInputs((p) => ({ ...p, [k]: v })); setValidErr(""); };

  useEffect(() => {
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const validate = () => {
    if (step === 1) {
      if (!inputs.age || !inputs.height || !inputs.weight) return "Please fill in all fields.";
      if (+inputs.age < 16 || +inputs.age > 60)          return "Age must be between 16 and 60.";
      if (+inputs.height < 100 || +inputs.height > 220)  return "Height must be between 100 and 220 cm.";
      if (+inputs.weight < 30 || +inputs.weight > 250)   return "Weight must be between 30 and 250 kg.";
    }
    return null;
  };

  const next = () => {
    const err = validate();
    if (err) { setValidErr(err); return; }
    setValidErr("");
    if (step < 4) { setStep((s) => s + 1); return; }
    submit();
  };

  const back = () => { setValidErr(""); setStep((s) => Math.max(1, s - 1)); };

  const submit = async () => {
    setStep(5);
    setApiError("");
    try {
      const base = import.meta.env.VITE_API_URL ?? "";
      const res = await fetch(`${base}/api/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Calculation failed.");
      setResult(json.data);
      setStep(6);
    } catch (err) {
      setApiError(err.message);
      setStep(4);
    }
  };

  const reset = () => {
    setStep(0); setResult(null);
    setInputs(DEFAULT_INPUTS); setValidErr(""); setApiError(""); setCopied(false);
  };

  const copyResult = () => {
    if (!result) return;
    const text = [
      "Dowry Calculator Result",
      `${result.verdictEmoji} ${result.tag}`,
      `Total: ${formatPKR(result.total)}`,
      `Score: ${result.score}/100`,
      result.verdict,
    ].join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="page">
      <div className="card" ref={cardRef}>

        {/* ── INTRO ── */}
        {step === 0 && (
          <div className="fade-in">
            <div className="disclaimer-tag">⚠ FOR ENTERTAINMENT PURPOSES ONLY</div>
            <h1 className="title">Dowry Calculator</h1>
            <p className="subtitle">A satirical algorithm for the modern desi wedding</p>
            <p className="intro-body">
              Answer a few questions about your future bride and our totally-not-scientific
              algorithm will compute a PKR dowry estimate — complete with a detailed breakdown,
              a score out of 100, and a very honest verdict.
            </p>
            <div className="intro-features">
              <div className="feat-item">📊 Multi-factor analysis</div>
              <div className="feat-item">🖥️ Real backend calculation</div>
              <div className="feat-item">📋 Detailed breakdown</div>
              <div className="feat-item">🏆 Tier verdict</div>
            </div>
            <button className="btn btn-primary" onClick={() => setStep(1)}>
              Begin Assessment →
            </button>
          </div>
        )}

        {/* ── FORM STEPS 1–4 ── */}
        {step >= 1 && step <= 4 && (
          <div className="fade-in">
            <div className="disclaimer-tag">⚠ FOR ENTERTAINMENT PURPOSES ONLY</div>
            <h1 className="title">Dowry Calculator</h1>
            <StepProgress current={step} />

            {step === 1 && (
              <div>
                <h2 className="step-heading">Physical Details</h2>
                <div className="grid2">
                  <Field label="Age (years)">
                    <input
                      type="number" placeholder="e.g. 24" min="16" max="60"
                      value={inputs.age} onChange={(e) => set("age", e.target.value)}
                    />
                  </Field>
                  <Field label="Height (cm)">
                    <input
                      type="number" placeholder="e.g. 163" min="100" max="220"
                      value={inputs.height} onChange={(e) => set("height", e.target.value)}
                    />
                  </Field>
                </div>
                <Field label="Weight (kg)" hint="Used to compute your BMI score">
                  <input
                    type="number" placeholder="e.g. 55" min="30" max="250"
                    value={inputs.weight} onChange={(e) => set("weight", e.target.value)}
                  />
                </Field>
                {inputs.height && inputs.weight && (
                  <BmiPreview height={inputs.height} weight={inputs.weight} />
                )}
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="step-heading">Appearance & Personality</h2>
                <Field label={`Looks Rating — ${inputs.looks}/10`} hint="Be honest. The algorithm knows.">
                  <div className="slider-row">
                    <span className="slider-edge">😐</span>
                    <input
                      type="range" min="1" max="10" value={inputs.looks}
                      onChange={(e) => set("looks", e.target.value)}
                    />
                    <span className="slider-edge">😍</span>
                    <span className="looks-val">{inputs.looks}</span>
                  </div>
                  <div className="looks-bar">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div
                        key={i}
                        className={`looks-pip ${i < inputs.looks ? "filled" : ""}`}
                        style={i < inputs.looks ? { background: looksColor(inputs.looks) } : {}}
                      />
                    ))}
                  </div>
                </Field>
                <SelectField
                  label="Her Personality / Nature"
                  hint="Pick the closest match"
                  value={inputs.nature}
                  onChange={(v) => set("nature", v)}
                  options={[
                    { value: "loving",      label: "❤️  Loving & caring" },
                    { value: "balanced",    label: "⚖️  Balanced & mature" },
                    { value: "nonchalant",  label: "😑  Nonchalant / indifferent" },
                    { value: "complicated", label: "💀  Complicated (God help you)" },
                  ]}
                />
                <div className="field">
                  <label>Is she a 10 out of 10? 👑</label>
                  <p className="field-hint">The ultimate override — activates a major bonus</p>
                  <div className="yesno-group">
                    <button
                      type="button"
                      className={`yesno-btn yesno-yes ${inputs.isTen === "yes" ? "active" : ""}`}
                      onClick={() => set("isTen", "yes")}
                    >
                      ✨ YES — She&apos;s perfect
                    </button>
                    <button
                      type="button"
                      className={`yesno-btn yesno-no ${inputs.isTen === "no" ? "active" : ""}`}
                      onClick={() => set("isTen", "no")}
                    >
                      😅 NO — Not quite
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="step-heading">Social Life</h2>
                <SelectField
                  label="How long have you known her?"
                  value={inputs.knownDuration}
                  onChange={(v) => set("knownDuration", v)}
                  options={[
                    { value: "less1", label: "Less than 1 year" },
                    { value: "1to3",  label: "1 – 3 years" },
                    { value: "3plus", label: "3+ years (trusted bond)" },
                  ]}
                />
                <div className="grid2">
                  <SelectField
                    label="Has a best friend?"
                    value={inputs.bestfriend}
                    onChange={(v) => set("bestfriend", v)}
                    options={[
                      { value: "no",  label: "No 🙏" },
                      { value: "yes", label: "Yes 😬" },
                    ]}
                  />
                  <SelectField
                    label="Male friends count?"
                    value={inputs.maleFriends}
                    onChange={(v) => set("maleFriends", v)}
                    options={[
                      { value: "none", label: "None 🙏" },
                      { value: "few",  label: "A few" },
                      { value: "many", label: "Many 💀" },
                    ]}
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="step-heading">Background & Skills</h2>
                <SelectField
                  label="Education Level"
                  value={inputs.education}
                  onChange={(v) => set("education", v)}
                  options={[
                    { value: "none",      label: "No formal education" },
                    { value: "matric",    label: "Matric (Grade 10)" },
                    { value: "inter",     label: "Intermediate (Grade 12)" },
                    { value: "bachelors", label: "Bachelor's Degree" },
                    { value: "masters",   label: "Master's Degree" },
                    { value: "phd",       label: "PhD / Doctorate" },
                  ]}
                />
                <SelectField
                  label="Family Background"
                  value={inputs.familyBackground}
                  onChange={(v) => set("familyBackground", v)}
                  options={[
                    { value: "lower",  label: "Lower-income family" },
                    { value: "middle", label: "Middle-class family" },
                    { value: "upper",  label: "Upper-middle-class" },
                    { value: "elite",  label: "Elite / Wealthy" },
                  ]}
                />
                <SelectField
                  label="Cooking Skill"
                  value={inputs.cookingSkill}
                  onChange={(v) => set("cookingSkill", v)}
                  options={[
                    { value: "none",      label: "Cannot cook 😬" },
                    { value: "basic",     label: "Basic cooking" },
                    { value: "decent",    label: "Decent home cook" },
                    { value: "excellent", label: "Excellent cook 👨‍🍳" },
                  ]}
                />
              </div>
            )}

            {validErr && <div className="input-error">{validErr}</div>}
            {apiError && <div className="input-error">Server error: {apiError}</div>}

            <div className="nav-row">
              <button className="btn btn-ghost" onClick={back}>← Back</button>
              <button className="btn btn-primary" onClick={next}>
                {step < 4 ? "Next →" : "Calculate Dowry"}
              </button>
            </div>
          </div>
        )}

        {/* ── LOADING ── */}
        {step === 5 && (
          <div className="fade-in center-col">
            <div className="spinner" />
            <p className="loading-text">Consulting the algorithm…</p>
            <p className="loading-sub">Crunching 12 variables in real-time</p>
          </div>
        )}

        {/* ── RESULT ── */}
        {step === 6 && result && (
          <div className="fade-in">
            <div className="disclaimer-tag">⚠ FOR ENTERTAINMENT PURPOSES ONLY</div>
            <h1 className="title">Dowry Calculator</h1>

            <div className="result-header">
              <ScoreRing score={result.score} />
              <div className="result-header-text">
                <div className="tier-tag">{result.verdictEmoji} {result.tag}</div>
                <div className="result-total">
                  <AnimatedNumber target={result.total} />
                </div>
                <p className="verdict-text">{result.verdict}</p>
              </div>
            </div>

            <hr className="divider" />

            <p className="section-label">Detailed Breakdown</p>
            <div className="base-row">
              <span>Base value</span>
              <span className="neutral">{formatPKR(result.base)}</span>
            </div>

            {Object.entries(result.grouped).map(([cat, items]) => (
              <div key={cat} className="breakdown-group">
                <div className="breakdown-cat">{cat}</div>
                {items.map((item, i) => (
                  <div key={i} className="breakdown-item">
                    <span>{item.label}</span>
                    <span className={item.value >= 0 ? "pos" : "neg"}>
                      {item.value >= 0 ? "+" : "–"}
                      {formatPKR(Math.abs(item.value))}
                    </span>
                  </div>
                ))}
              </div>
            ))}

            <div className="total-row">
              <span>Total</span>
              <span className="total-val">{formatPKR(result.total)}</span>
            </div>

            <p className="computed-at">
              BMI: {result.bmi} &nbsp;|&nbsp; Calculated at {new Date(result.computedAt).toLocaleTimeString()}
            </p>

            <div className="result-actions">
              <button className="btn btn-ghost" onClick={copyResult}>
                {copied ? "✓ Copied!" : "📋 Copy Result"}
              </button>
              <button className="btn btn-primary" onClick={reset}>
                Calculate Again
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
