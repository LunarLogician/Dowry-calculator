const BASE = 500_000;

export function calculateDowry(inputs) {
  const {
    age, height, weight, looks,
    isTen,
    knownDuration, nature, bestfriend, maleFriends,
    education, familyBackground, cookingSkill,
  } = inputs;

  // --- Validation ---
  const required = { age, height, weight, looks };
  for (const [k, v] of Object.entries(required)) {
    if (v === undefined || v === null || v === "") {
      throw new Error(`Missing required field: ${k}`);
    }
  }
  const ageVal = parseInt(age);
  const h = parseInt(height);
  const w = parseFloat(weight);
  const looksVal = parseInt(looks);

  if (isNaN(ageVal) || ageVal < 16 || ageVal > 60)   throw new Error("Age must be between 16 and 60");
  if (isNaN(h) || h < 100 || h > 220)                throw new Error("Height must be between 100 and 220 cm");
  if (isNaN(w) || w < 30 || w > 250)                 throw new Error("Weight must be between 30 and 250 kg");
  if (isNaN(looksVal) || looksVal < 1 || looksVal > 10) throw new Error("Looks must be between 1 and 10");

  let total = BASE;
  const breakdown = [];

  const add = (category, label, value) => {
    total += value;
    breakdown.push({ category, label, value });
  };

  // ── AGE ──────────────────────────────────────────────────────────────────
  if (ageVal >= 22 && ageVal <= 26)      add("Age", "Prime age (22–26)",        200_000);
  else if (ageVal < 22)                  add("Age", "Young (under 22)",           50_000);
  else if (ageVal >= 27 && ageVal <= 30) add("Age", "Late twenties (27–30)",     100_000);
  else                                   add("Age", "Over 30",                  -150_000);

  // ── HEIGHT ────────────────────────────────────────────────────────────────
  if (h >= 160 && h <= 170)  add("Physical", "Ideal height (160–170 cm)",  150_000);
  else if (h > 170)          add("Physical", "Tall (>170 cm)",               80_000);
  else                       add("Physical", "Short height (<160 cm)",      -50_000);

  // ── BMI ───────────────────────────────────────────────────────────────────
  const bmi = w / Math.pow(h / 100, 2);
  const bmiRounded = Math.round(bmi * 10) / 10;
  if      (bmi >= 18.5 && bmi <= 24.9) add("Physical", `Healthy BMI (${bmiRounded})`,  200_000);
  else if (bmi >= 25   && bmi <= 29.9) add("Physical", `Slightly above BMI (${bmiRounded})`, 50_000);
  else if (bmi > 30)                   add("Physical", `High BMI (${bmiRounded})`,     -200_000);
  else                                 add("Physical", `Low BMI (${bmiRounded})`,       -50_000);

  // ── LOOKS ─────────────────────────────────────────────────────────────────
  const looksBonus = (looksVal - 5) * 80_000;
  add("Appearance", `Looks rating (${looksVal}/10)`, looksBonus);

  // Extra bonus for 9-10
  if (looksVal >= 9) add("Appearance", "Exceptional looks bonus",  150_000);
  else if (looksVal <= 2) add("Appearance", "Below average appearance penalty", -50_000);

  // ── 10/10 OVERRIDE ────────────────────────────────────────────────────────
  if (isTen === "yes") {
    add("Appearance", "She's a 10/10 \uD83D\uDC51 (ultimate override)", 500_000);
  }

  // ── EDUCATION ─────────────────────────────────────────────────────────────
  const eduMap = {
    none:      { v: -100_000, label: "No formal education" },
    matric:    { v:        0, label: "Matric (10th grade)" },
    inter:     { v:   50_000, label: "Intermediate (12th grade)" },
    bachelors: { v:  150_000, label: "Bachelor's degree" },
    masters:   { v:  250_000, label: "Master's degree" },
    phd:       { v:  350_000, label: "PhD / Doctorate" },
  };
  const edu = eduMap[education];
  if (edu) add("Education", edu.label, edu.v);

  // ── FAMILY BACKGROUND ─────────────────────────────────────────────────────
  const famMap = {
    lower:  { v: -100_000, label: "Lower-income family" },
    middle: { v:   50_000, label: "Middle-class family" },
    upper:  { v:  150_000, label: "Upper-middle-class family" },
    elite:  { v:  300_000, label: "Elite / Wealthy family" },
  };
  const fam = famMap[familyBackground];
  if (fam) add("Background", fam.label, fam.v);

  // ── COOKING SKILL ─────────────────────────────────────────────────────────
  const cookMap = {
    none:      { v: -100_000, label: "Cannot cook at all" },
    basic:     { v:        0, label: "Basic cooking skills" },
    decent:    { v:  100_000, label: "Decent home cook" },
    excellent: { v:  200_000, label: "Excellent cook" },
  };
  const cook = cookMap[cookingSkill];
  if (cook) add("Skills", cook.label, cook.v);

  // ── HOW LONG KNOWN ────────────────────────────────────────────────────────
  if      (knownDuration === "less1") add("Social", "Known less than 1 year (risky)", -100_000);
  else if (knownDuration === "1to3")  add("Social", "Known 1–3 years",                 100_000);
  else if (knownDuration === "3plus") add("Social", "Known 3+ years (trusted)",         250_000);

  // ── NATURE / PERSONALITY ──────────────────────────────────────────────────
  const natureMap = {
    loving:      { v:  300_000, label: "Loving & caring nature" },
    balanced:    { v:  100_000, label: "Balanced personality" },
    nonchalant:  { v: -150_000, label: "Nonchalant / indifferent" },
    complicated: { v: -250_000, label: "Complicated personality" },
  };
  const nat = natureMap[nature];
  if (nat) add("Personality", nat.label, nat.v);

  // ── BEST FRIEND ───────────────────────────────────────────────────────────
  if (bestfriend === "yes") add("Social", "Has a best friend (drama risk)", -100_000);
  else                      add("Social", "No best friend (low drama)",       50_000);

  // ── MALE FRIENDS ─────────────────────────────────────────────────────────
  const mfMap = {
    none: { v:  150_000, label: "No male friends" },
    few:  { v: -100_000, label: "A few male friends" },
    many: { v: -300_000, label: "Many male friends" },
  };
  const mf = mfMap[maleFriends];
  if (mf) add("Social", mf.label, mf.v);

  // ── FINAL TOTAL ───────────────────────────────────────────────────────────
  const finalTotal = Math.max(total, 50_000);

  // ── SCORE (0–100) ─────────────────────────────────────────────────────────
  const maxPossible = BASE
    + 200_000  // age prime
    + 150_000  // height ideal
    + 200_000  // healthy BMI
    + 400_000  // looks 10/10 + bonus
    + 150_000  // extra looks
    + 500_000  // 10/10 override
    + 350_000  // PhD
    + 300_000  // elite family
    + 200_000  // excellent cook
    + 250_000  // known 3+
    + 300_000  // loving nature
    + 50_000   // no bestfriend
    + 150_000; // no male friends

  const score = Math.round(
    Math.min(100, Math.max(0, (finalTotal / maxPossible) * 100))
  );

  // ── VERDICT ───────────────────────────────────────────────────────────────
  let verdict, verdictEmoji, tag;
  if (finalTotal > 1_800_000) {
    verdict = "She's a rare gem. Open the treasury immediately.";
    verdictEmoji = "💎"; tag = "S Tier";
  } else if (finalTotal > 1_300_000) {
    verdict = "An excellent match. Negotiate with full confidence.";
    verdictEmoji = "🏆"; tag = "A Tier";
  } else if (finalTotal > 900_000) {
    verdict = "A decent deal. Some negotiation may be required.";
    verdictEmoji = "💍"; tag = "B Tier";
  } else if (finalTotal > 500_000) {
    verdict = "Below average. Think carefully, bhai.";
    verdictEmoji = "🤔"; tag = "C Tier";
  } else {
    verdict = "The red flags are included at no extra charge.";
    verdictEmoji = "🚩"; tag = "D Tier";
  }

  // Group breakdown by category for frontend
  const grouped = {};
  for (const item of breakdown) {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  }

  return {
    total: finalTotal,
    base: BASE,
    score,
    bmi: bmiRounded,
    breakdown,
    grouped,
    verdict,
    verdictEmoji,
    tag,
    computedAt: new Date().toISOString(),
  };
}
