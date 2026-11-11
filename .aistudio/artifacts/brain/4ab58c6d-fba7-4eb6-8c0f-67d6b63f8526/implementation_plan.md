# Complete Elimination of Shadows on Clinical Referral Intake Form

Eradicate all box-shadows, inner shadows, and focus glow halos across all input fields, textareas, selects, and containers in the Clinical Referral Intake form (specifically resolving the shadow observed on the WBC 12,500 input and all lab/clinical fields) using strict global CSS rules and explicit flat border styling.

## User Review & Critical Decisions

> [!IMPORTANT]
> The user confirmed that shadows were visible inside and around the input box itself (such as the WBC input) and selected the approach to **apply strict global CSS to remove all box-shadows**.

- **Confirmed Decision 1**: Shadows are present on/around input boxes (including browser default inner shadows and WebKit appearances).
- **Confirmed Decision 2**: Implement an uncompromising global CSS rule removing `box-shadow`, `-webkit-box-shadow`, `-moz-box-shadow`, and `outline` across all form elements, backed by Tailwind `shadow-none` and `focus:ring-0`.

---

## 1. Overview & Core Concept

- **What It Does**: Transforms the Clinical Referral Intake form into a 100% crisp, flat medical paper interface with zero depth illusions, zero inset/outset shadows, and zero focus glow rings.
- **Target Audience**: Emergency physicians, referral nurses, and dispatchers at Champasak Provincial Hospital and district health centers who require a clean, glare-free, clinical form interface.
- **Key Value**: Crisp high-contrast legibility without subtle shadows or browser-induced blurry bevels on vital and lab input fields.

---

## 2. User Experience & Visual Design

### Aesthetic Direction
- **Flat Clinical Discipline**: Pure flat white input surfaces (`bg-white`), crisp 1px neutral borders (`border-slate-300`), and active state indicated solely by a solid border color change (`border-emerald-600`) with zero glow or blur.

### Color & Spatial Tokens
- **Input Canvas**: `#FFFFFF` (pure white, zero gradient, `background-image: none`).
- **Input Border**: `#CBD5E1` (`slate-300`) resting, `#059669` (`emerald-600`) active focus.
- **Shadow Enforcement**: `box-shadow: none !important; -webkit-box-shadow: none !important; -webkit-appearance: none !important;`.
- **Containers**: Flat `border border-emerald-900/10` and `bg-emerald-50/30` with `shadow-none`.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Global CSS Reset vs. Component-Only Classes**
  - *Chosen Approach*: Apply both a global CSS rule in `src/index.css` targeting `input, textarea, select, button` AND explicit Tailwind utility classes (`shadow-none ring-0 focus:ring-0`) on every component input.
  - *Why*: Browsers (especially Safari, WebKit, and Chromium mobile/desktop) often render default inset box-shadows (`-webkit-box-shadow: inset 0 1px 2px rgba(0,0,0,0.1)`) on native text inputs that Tailwind utility classes alone do not completely neutralize without `appearance: none` and `box-shadow: none !important`.
  - *Alternatives Considered*: Only editing Tailwind classes (which left the subtle browser shadow on WBC).

- **Decision 2: Focus Indication Without Glow**
  - *Chosen Approach*: Solid 1px or 1.5px high-contrast border transition (`focus:border-emerald-600`) without any multi-pixel spread ring.
  - *Why*: Meets WCAG accessibility requirements for focus visibility while remaining 100% shadow-free.

---

## 4. Technical Architecture & Data Strategy

```
┌───────────────────────────────────────────────────────────────┐
│                       Global CSS Layer                        │
│                     (src/index.css)                           │
│  - input, textarea, select { box-shadow: none !important; }   │
│  - appearance: none !important;                               │
│  - focus { outline: none !important; box-shadow: none ! }     │
└───────────────────────────────┬───────────────────────────────┘
                                │ enforces flat rendering
                                ▼
┌───────────────────────────────────────────────────────────────┐
│            Clinical Referral Intake Form Component            │
│               (src/components/ReferralForm.tsx)               │
│                                                               │
│  Step 1: Patient Demographics & Transfer Routing (Flat)       │
│  Step 2: Diagnosis, History & Vital Signs (Flat)              │
│  Step 3: Laboratory Investigations (WBC, HCT, etc.) & Imaging │
│          - Pure flat white boxes                              │
│          - border border-slate-300 shadow-none                │
│          - focus:border-emerald-600 focus:outline-none        │
│  Step 4: Physical Examination & GCS (Flat)                    │
│  Step 5: Treatment Given & Dispatch Authorization (Flat)      │
└───────────────────────────────────────────────────────────────┘
```

### Proposed Changes

1. **`src/index.css`**:
   - Add global reset rules for all form elements:
     ```css
     input, textarea, select {
       box-shadow: none !important;
       -webkit-box-shadow: none !important;
       -moz-box-shadow: none !important;
       -webkit-appearance: none !important;
       appearance: none !important;
     }
     input:focus, textarea:focus, select:focus {
       box-shadow: none !important;
       -webkit-box-shadow: none !important;
       -moz-box-shadow: none !important;
       outline: none !important;
     }
     ```
2. **`src/components/ReferralForm.tsx`**:
   - Audit and enforce `shadow-none` across all input fields (including WBC, HCT, HB, PLT, Glucose, Creatinine, Urea, K/Na, Dengue, Other Labs, CXR, Ultrasound, CT-Scan, Physical Exam fields, GCS, and Demographics).
3. **Verification**:
   - Compile and lint applet (`compile_applet` and `lint_applet`).
   - Run production build `npm run build` to confirm zero issues.
