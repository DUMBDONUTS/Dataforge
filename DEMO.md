# DEMO.md — 3-minute judge demo + Q&A prep

## One-command start
```
cd HACKATHON/KHDS
python -m http.server 8000
# open http://localhost:8000 (page opens with Side B pre-run)
```
Fallback if offline: everything is local except nothing — no CDN, no fonts, no backend.
If the projector fails: narrate the screenshots in this file's stead (TODO: add 2 screenshots).

## 60-second happy path
1. **Side A:** press Run — steps appear, token counter ticks to ~30, answer 14. Say:
   "Every word cost a forward pass, and one wrong word would poison the rest."
2. **Side B:** drag slider 1 → 12, press Run — accuracy climbs, tokens stay 0. Say:
   "Same puzzle family, zero words written. Effort went into silent passes."
3. **Evidence panel:** "BDH-CQ reported 29.5% pass@2 ARC-AGI-1 at $0.0007/task with no
   CoT tokens — vendor-reported, labeled. Coconut (COLM 2025) independently shows
   continuous thought beating CoT on planning-heavy logic."
4. **Limitations box:** "Toy is synthetic; silent states are unobservable; that is the trade."

## Judges Q&A (5 hard ones)
1. **Why static, not Streamlit?** Zero-install public URL, <1s feedback, works on a phone;
   the brief's gold standard (Transformer Explainer) is also static.
2. **Is Side A a real LLM?** No — labeled scripted illustration. The *claim under test*
   is Side B's live computation; Side A exists to make cost visible.
3. **Why should I trust the toy?** Seeded (42), reproducible, mechanism transparent
   (contraction 0.55 < 1 ⇒ expected error shrinks per pass). It teaches the *shape* of
   the tradeoff, not BDH-CQ's exact numbers — labeled as such.
4. **BDH-CQ numbers — independent?** No. Vendor-reported; stated on the page and here.
   Independent support comes from Coconut (peer-reviewed, COLM 2025).
5. **When is latent reasoning the wrong choice?** Audit-required settings (medical, legal):
   observability loss outweighs cost savings. The demo teaches this, not just the win.

## Post-hackathon
- [ ] Add 2 screenshots + 30-sec screen recording fallback
- [ ] LICENSE (MIT) file
- [ ] Blog draft + one-page summary from README + evidence panel
