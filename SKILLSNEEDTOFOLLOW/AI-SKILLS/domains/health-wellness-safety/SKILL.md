---
name: health-wellness-safety
description: >-
  Health and wellness applications: health metrics tracking, HIPAA privacy awareness, accessibility safety, and clinical guidelines. Use when handling sensitive wellness data, adhering to health data privacy standards, or building habit/health trackers. Not for general data privacy laws like GDPR/CCPA (that is privacy).
---

# Health & Wellness Safety: Non-Diagnostic Guardrails & Emergency Protocols

## 1. Core Health Safety Invariants

1. **Non-Diagnostic Invariant**: The system must never offer clinical diagnoses, prescribe medications, or replace professional medical advice. Every output must carry a clear disclaimer.
2. **Immediate Emergency Triage Interception**: If user input contains emergency signals (e.g. chest pain, difficulty breathing, acute numbness, self-harm, suicidal ideation), the system must immediately halt standard response generation and display prominent emergency hotline numbers (e.g. 911, 988 Crisis Lifeline, local emergency numbers).
3. **Strict PHI Confidentiality**: Protected Health Information (PHI) must never be logged in plaintext, shared with third-party tracking scripts, or exposed in public URLs.
4. **Empathetic, Supportive, Non-Clinical Voice**: Maintain a helpful, calm, and grounded tone without adopting authoritative clinical certainty.

---

## 2. Key Implementation Patterns

### A. Emergency Symptom & Crisis Triage Detector
```typescript
interface EmergencyDetectionResult {
  isEmergency: boolean;
  emergencyType?: "medical" | "mental_health";
  crisisMessage?: string;
}

const MEDICAL_EMERGENCY_PATTERNS = [
  /\b(chest pain|crushing pain|shortness of breath|difficulty breathing)\b/i,
  /\b(stroke|face drooping|arm weakness|slurred speech)\b/i,
  /\b(severe bleeding|unconscious|overdose|seizure)\b/i
];

const MENTAL_HEALTH_CRISIS_PATTERNS = [
  /\b(kill myself|suicide|end my life|want to die|self-harm)\b/i
];

export function evaluateHealthInput(userInput: string): EmergencyDetectionResult {
  for (const pattern of MENTAL_HEALTH_CRISIS_PATTERNS) {
    if (pattern.test(userInput)) {
      return {
        isEmergency: true,
        emergencyType: "mental_health",
        crisisMessage:
          "If you are feeling overwhelmed or having thoughts of self-harm, please reach out for immediate support. You can call or text 988 (in the US & Canada) or visit 988lifeline.org to connect with compassionate support 24/7. International resources: findahelpline.com."
      };
    }
  }

  for (const pattern of MEDICAL_EMERGENCY_PATTERNS) {
    if (pattern.test(userInput)) {
      return {
        isEmergency: true,
        emergencyType: "medical",
        crisisMessage:
          "This sounds like a potentially serious medical emergency. Please call 911 (or your local emergency services) or go to the nearest emergency room immediately."
      };
    }
  }

  return { isEmergency: false };
}
```

### B. Standard Mandatory Non-Diagnostic Disclaimer
Every health-related screen and response must include or link to:
```markdown
> [!NOTE]
> **Important Disclaimer**: This tool is designed for educational and informational wellness tracking only. It is not a medical device, does not provide medical diagnoses, and cannot replace the advice of a qualified healthcare professional. Always consult a physician for medical concerns.
```

---

## 3. Anti-Patterns to Avoid

- **Speculating on Diagnoses**: Suggesting phrases like "You likely have appendicitis" or "This looks like melanoma" instead of "Please consult a healthcare provider to evaluate abdominal pain."
- **Recommending Medication Dosages**: Recommending prescription drug adjustments or dangerous supplement regimens.
- **Burying Crisis Contacts**: Placing suicide prevention or emergency numbers at the bottom of a lengthy conversational paragraph.

---

## 4. Verification Checklist

- [ ] Emergency triage regex intercepts acute symptoms and short-circuits LLM generation.
- [ ] Crisis hotline (988 / 911) displays prominently upon detection.
- [ ] Mandatory medical disclaimer is visible on all health screens.
- [ ] Health data inputs are excluded from analytics event tracking.
