# Healers in Crisis — launch assets

Social copy and image assets for the "Healers in Crisis" article. The article
itself lives in `content/stories.ts`; this file is the companion for posting it.

**Status: published and live** at
<https://www.vantagefoundationuganda.com/stories/healers-in-crisis-ugandas-medical-interns>,
by Dr. Turyasingura Hillary A., Co-founder and Operations Director. Both social
cards are built and committed. Social posts had not yet gone out at the time of
writing.

> **Deploys are manual.** This project's Vercel deployments are not wired to
> GitHub — merging to `main` does not publish. Every release needs
> `vercel --prod` run against the `vantage-foundation-uganda-website` project.
> Production sat on a 26 July build for a week because of this.

**If the article's argument changes, update the social copy with it.** The
posts below restate the article's position, so an edit to "What needs to
change" can silently leave them contradicting the piece — that has already
happened once.

Social handles (from `content/site.ts`):
- Instagram: @vantagefoundationuganda
- LinkedIn: linkedin.com/company/vantagefoundation
- YouTube: @vantagefoundation
- (No Twitter/X or Facebook page is listed in the site config — add if needed.)

---

## 1. OG image — built

Both cards are built and committed as **PNG**, not SVG. The SVG compatibility warning below was correct: Twitter/X, Facebook, LinkedIn, WhatsApp and iMessage do not reliably render SVG OG images, so no SVG version was produced.

| File | Dimensions | Size | Use |
|---|---|---|---|
| `public/images/og/healers-in-crisis-ugandas-medical-interns.png` | 1200 × 630 | 327 KB | OG/Twitter card. Wired to `seo.ogImage`. |
| `public/images/og/healers-in-crisis-ugandas-medical-interns-square.png` | 1080 × 1080 | 325 KB | Instagram feed post. Manual upload — not referenced in code. |

### What was actually built

Option A (photo-led), with one deviation from the brief: the source illustration is **light** on the left, not dim, so a dark overlay with white text would have been unreadable. The cards instead use a soft pale scrim (`#eef8f8`, 45% → 0) over the existing negative space, with **teal type** on top.

- Accent rule, eyebrow and byline: `#006b70` (Teal Dark).
- Headline: `#00565a`.
- **The gold accent in the original brief (`#E0B33C`) was not used.** `docs/brand/colour-system.md` and `globals.css` both state "no orange/yellow accents per brand system" — `--accent` is aliased to teal dark. The deep teal `#0F3D3E` in Option B is also not a brand token; the real one is `#006b70`.
- Landscape card puts text in the left third; the square card stacks the image on top with a pale panel across the bottom third.

### Text on the cards

```
[accent rule]
HEALERS IN CRISIS
Why Uganda cannot afford to lose
its young doctors

Dr. Turyasingura Hillary A.  ·  2 August 2026
AI-generated illustration
```

### Imagery provenance — read before posting

The three hospital images are **AI-generated**, not Vantage field photography. `docs/brand/photography.md` asks for documentary imagery and lists "Misleading staging" under Avoid, so the provenance is disclosed rather than left implicit:

- Both cards carry a visible "AI-generated illustration" line.
- The story page renders a caption under the hero: *"AI-generated illustration — not a photograph of the interns described here."*
- `consentClassification` is `"none"` — no real individuals are depicted, so no consent is owed. The original note about requiring `consentClassification: "verified"` does not apply here; it would apply if these were swapped for real photographs.

If any card or crop is reused elsewhere, carry the disclosure with it.

### Source files

Hero and two unused illustrations live in `public/images/stories/` as WebP + AVIF (`healers-in-crisis-hero`, `-ward`, `-corridor`), processed through the same pipeline as the rest of the archive: metadata stripped, max 1920 px, WebP q82 / AVIF q60. `-ward` and `-corridor` are currently unused and available for a carousel.

Alt text is set explicitly on the story (`heroImageAlt`); `og:image:alt` is auto-filled by `createPublicMetadata` from the social title.

---

## 2. Social-share copy

### Twitter / X  (≤280 chars; thread optional)

> On 30 July Uganda deployed 2,417 medical interns to its hospitals. They start on 3 August.
>
> The list says exactly where each of them will work. It says nothing about whether any of them will be paid.
>
> www.vantagefoundationuganda.com/stories/healers-in-crisis-ugandas-medical-interns

(222 chars as X counts it — comfortably inside a single tweet, with ~58 to spare. **Note:** X counts *any* URL as 23 characters via t.co wrapping, however long it is, so the raw length of 280 overstates the real count by 58. This is why restoring the `www.` prefix costs nothing on X even though it lengthens the raw string. The original doc's "263 chars" figure counted the URL raw, understating how much room the copy actually had.)

The lead is the live news, not the policy: the deployment list went out on 30 July and the interns start on 3 August with the pay question still open. That is concrete, checkable and time-bound, which travels further than a framing argument. The redefinition point is strong but it is the *second* beat — it explains the news rather than being the news.

**Optional thread continuation (1/3 → 3/3):**

> 1/3 What actually changed — it isn't a budget cut:
> • Internship folded into the university degree
> • Medical training stretched from 5 years to 6
> • The internship year now falls BEFORE graduation
> • So interns are no longer junior professionals owed an allowance. They're undergraduates completing a course requirement.
> • Approved by Cabinet Oct 2024. Effective Aug 2026.

> 2/3 Where it stands:
> • 22 July: interns give govt a 10-day ultimatum to suspend NETH
> • 30 July: the deployment list goes out anyway — 2,417 interns
> • 3 August: they are due on the wards
> • UGX 2.5m allowance — a 2021 presidential directive, never reliably honoured — cut to 1m, then scrapped
> • Govt found UGX 158bn for MPs' cars. Interns need UGX 28bn/yr.

> 3/3 What needs to change:
> ✓ Pay the interns. Not negotiable.
> ✓ Supervision can't be funded by defunding the supervised
> ✓ Clear the arrears already earned
> ✓ Fix welfare, hours and mentorship alongside pay — not instead of it
>
> Read the full piece ↓
> www.vantagefoundationuganda.com/stories/healers-in-crisis-ugandas-medical-interns

**Hold the boycott out of the thread until it's confirmed.** The induction boycott is the sharpest fact available and the most tempting thing to lead with — but it is currently unsourced (see the note under the article's Sources). A social post is fast and effectively unretractable. Add it once there is a citation or an on-record attribution; until then it stays in the article, where it sits in context, and out of a tweet, where it would travel alone.

### LinkedIn  (longer-form, professional tone)

> **Healers in Crisis: Why Uganda Cannot Afford to Lose Its Young Doctors**
> By Dr. Turyasingura Hillary A., Co-founder and Operations Director, Vantage Foundation Uganda
>
> On 30 July, Uganda's Medical Internship Committee deployed 2,417 newly qualified graduates to hospitals across the country. They report on 3 August. The list sets out precisely where each of them will work. It says nothing about whether any of them will be paid.
>
> At three in the morning, in a ward across Uganda, the doctor at a patient's bedside is most likely a young intern — less than a year out of medical school, running on a few hours of sleep, and now doing that work without any certainty of being paid.
>
> Uganda's medical interns are the backbone of a health system serving more than 46 million people. They deliver over 90% of emergency obstetric care nationwide and account for 70–80% of the doctors a patient will actually encounter in many public facilities.
>
> This year, the compact broke down — and it is worth being precise about how. The National Education and Training for Health Policy, approved by Cabinet in October 2024 and effective this August, does not simply withdraw a payment. It redefines what an internship is. Clinical training is folded into the university degree, medical courses stretch from five years to six, and the internship year now falls before graduation rather than after it. On that reading, interns are no longer junior professionals earning an allowance; they are undergraduates completing a course requirement.
>
> The Ministry of Health defends the reform as closing an accountability gap, and says the savings will fund specialist training and better supervision. The profession disputes the premise: the Uganda Medical Association has questioned the legality of requiring an additional year of unpaid clinical work before a degree is awarded. Meanwhile more than 180 interns went four months without pay, and the Federation of Uganda Medical Interns has escalated the matter to the Attorney General.
>
> At Vantage Foundation Uganda, our health work — from rural medical camps to mental-health workshops in schools — rests on a simple conviction: a health system is only as strong as the people who carry it.
>
> Our position is straightforward: interns must be paid. Supervision and specialist training do need investment — but funding them by withdrawing pay from the people being supervised is not a reform, it moves the cost onto the least powerful person on the ward. Welfare, working hours, working conditions and genuine mentorship need fixing alongside pay, not instead of it.
>
> We've published our full perspective on what this crisis means for patients, for the profession, and for the future of healthcare in Uganda.
>
> Read it here: https://www.vantagefoundationuganda.com/stories/healers-in-crisis-ugandas-medical-interns
>
> #Uganda #HealthWorkforce #MedicalInterns #GlobalHealth #BrainDrain #HealthPolicy

### Instagram  (caption, ≤2200 chars; pair with the 1:1 OG variant or a carousel)

> Healers in Crisis 🩺
>
> On 30 July, 2,417 medical interns were deployed to hospitals across Uganda. They start on 3 August. The list says exactly where each of them will work — and nothing about whether any of them will be paid.
>
> At 3 a.m. in a Ugandan hospital, the doctor at your bedside is most likely a young intern — exhausted, under-supervised, and now unpaid.
>
> Here's what most people haven't been told: this isn't a budget cut. From August, a new national policy folds internship into the medical degree — five years become six, and the internship year moves to before graduation. Interns stop being junior doctors owed an allowance and become students completing a course requirement. The payment wasn't cut. The reason to pay it was removed.
>
> 2,300 young doctors — the people running the night shift in our public hospitals — have gone months without pay. The allowance was quietly halved from UGX 2.5m to UGX 1m before being scrapped. Some have worked 36–48 hour shifts without rest.
>
> These interns deliver over 90% of emergency obstetric care nationwide. They are 70–80% of the doctors a patient actually meets in many public hospitals. A health system is only as strong as the people who carry it — and right now, Uganda is asking them to carry too much, for too little, for too long.
>
> As Archbishop Kaziimba asked: how can government find UGX 158 billion for MPs' cars, but not UGX 28 billion to pay the doctors who keep our hospitals running?
>
> To be clear about where we stand: interns must be paid. Supervision and specialist training also need funding — but paying for them by defunding the people being supervised is not a reform. Welfare, working hours, conditions and real mentorship have to be fixed alongside pay, not instead of it.
>
> Our Co-founder and Operations Director, Dr. Turyasingura Hillary A., has written our full perspective on what this crisis means for patients, for the profession, and for the future of healthcare in Uganda. Link in bio.
>
> #Uganda #HealthWorkforce #MedicalInterns #GlobalHealth #HealthPolicy #VantageFoundationUganda #Kampala #BrainDrain #Healthcare

**Note on the "link in bio" line:** Instagram captions don't make URLs clickable. Either keep "Link in bio." or, if you have a Stories link sticker / link-in-bio tool, point it to:
`https://www.vantagefoundationuganda.com/stories/healers-in-crisis-ugandas-medical-interns`

### Facebook  (only if/when a page exists)

Use the LinkedIn copy verbatim — Facebook's audience and character tolerance are similar, and the longer post performs better than a short teaser there.

---

## 3. Suggested posting schedule

| Platform | When | Why |
|---|---|---|
**The article has been re-dated to 2 August 2026** — the `date` field, the visible byline, `article:publishedTime` and both PNG cards all now carry it. The news hook is sharper than it was on 31 July, not weaker: the interns report to the wards on **3 August**, so the piece now runs the day before the policy meets its first full cohort. That is the strongest window this story will get. Post at 08:00 EAT.

| Platform | When | Why |
|---|---|---|
| LinkedIn + Twitter/X | First — ≈08:00 EAT, next weekday | Catches the policy/NGO/professional audience at the start of their day. |
| Instagram | 2–4 hours later | Visual platform performs better midday; pair the 1080×1080 card with a Stories link sticker. |
| Facebook | Same as LinkedIn if a page exists | Mirrors the LinkedIn long-form post. |

If you want a single coordinated launch, post LinkedIn + Twitter at 08:00 EAT and Instagram at 12:00 EAT.

If publication slips past 3 August the dateline needs moving again, and the "the question this week answers" line near the end of the allowance section will need revisiting — by then the interns will already be on the wards, paid or not, and the piece should say which. Re-dating touches four places: the story's `date` field, the body's KAMPALA dateline, and the byline on both PNG cards.

---

## 4. Canonical URL for tracking

`https://www.vantagefoundationuganda.com/stories/healers-in-crisis-ugandas-medical-interns`

Confirmed in the production build — this is what the page emits for both `rel="canonical"` and `og:url`, and the sitemap picks it up automatically.

The domain was wrong in three places and has been corrected:

- `.env.local` — `NEXT_PUBLIC_SITE_URL` had `.org`; now `https://www.vantagefoundationuganda.com`.
- `lib/site-url.ts` — the `DEFAULT_SITE_URL` fallback had a `www.` prefix; dropped to match the canonical.
- `.env.example` — still had `.org`; corrected.

Note that `DEFAULT_SITE_URL` is only a fallback. Everything real resolves through `resolveSiteUrl()` via `content/site.ts`, which reads the env var — so **a preview or staging deploy missing `NEXT_PUBLIC_SITE_URL` will silently emit the fallback domain**. Set it in the Vercel project environment, not just locally.

(`CANONICAL_SITE_URL` and `toCanonicalUrl()` are exported from `lib/site-url.ts` but unused outside tests.)
