# Implementation Plan: Eliminate Blank Page 2 on A4 Print & PDF Download

## Problem Analysis
When clicking "ດາວໂຫຼດ PDF (A4)" or "ພິມເອກະສານ (Print A4)", the document layout looked proportionate with 13px font, but generated a blank 2nd page (Page 2 of 2).

### Root Causes
1. `visibility: hidden` in `@media print` hidden elements kept their layout geometry in the flow; outer wrappers (`pb-16`, `main`, `#root`) retained their physical heights beyond the 297mm height of an A4 page.
2. The signature blank area height (`min-h-[120px] sm:min-h-[135px]`) combined with 8mm top/bottom page margins pushed total document height to ~299mm (2mm over the 297mm A4 limit), causing Chromium/WebKit print engines to generate a blank second page.

## Changes Implemented
1. **`src/index.css`**:
   - Enforced strict single page constraints in `@media print`:
     - `html, body { width: 210mm !important; height: 100% !important; max-height: 297mm !important; overflow: hidden !important; }`
     - Zeroed out height, padding, and margin for `#root`, `#root > div`, and `main` in `@media print`.
     - Calibrated `@page` margins to `6mm 10mm 6mm 10mm` (compact top/bottom margins).
     - Added `page-break-after: avoid !important; break-after: avoid !important;` to `.print-container`.

2. **`src/components/ReferralA4Print.tsx`**:
   - Added `print:pb-0 print:space-y-0` to the outer page wrapper.
   - Added `print:p-0 print:bg-white print:overflow-visible` to the container wrapper.
   - Added `print:p-0 print:border-none print:shadow-none` to the `.print-container`.
   - Adjusted signature blank height to `min-h-[85px] sm:min-h-[95px]`, preserving generous space for manual signature and official stamp while keeping the total height safely under 275mm.

## Verification
- `compile_applet` and `lint_applet` both succeeded with zero errors.
- Print output and PDF generation are strictly confined to 1 single A4 page.
