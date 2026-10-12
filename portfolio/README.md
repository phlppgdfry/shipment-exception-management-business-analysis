# Portfolio

> Recruiter-facing material for this case. Everything here is derived from the [documentation](../docs/00-documentation-map.md) and the [demo](../demo/README.md); nothing here adds new claims.

| What | File | Use it for |
|---|---|---|
| **5-minute tour** | [site: for recruiters](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/for/recruiters/) | the link in an application or e-mail |
| **Executive case study** (6 pages, PDF) | [`case-study/case-study.pdf`](case-study/case-study.pdf) · source [`case-study.html`](case-study/case-study.html) | attachment, or reading before an interview |
| **Interview presentation** (10 slides, with speaker notes) | [`presentation/interview-deck.pptx`](presentation/interview-deck.pptx) · [talk track](presentation/README.md) | a 10-minute case presentation |
| **Executive summary** (1 page, EN + NL) | [`executive-summary/`](executive-summary/README.md) | the shortest version |
| **Walkthrough video** (65 s, no sound, captions) | [GIF](walkthrough/walkthrough.gif) · [MP4 on the site](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/assets/walkthrough/walkthrough.mp4) | e-mail, LinkedIn post, for people who won't click |
| **Screenshots** of the control tower | [`screenshots/`](screenshots/) | CV, LinkedIn, slides |
| **CV project description** | [`cv-description.md`](cv-description.md) | a CV or LinkedIn "projects" entry |

## Rebuilding

```bash
cd demo/application
BASE_PATH=/shipment-exception-management-business-analysis/control-tower npm run build
node scripts/capture-screenshots.mjs                                                  # portfolio/screenshots
node scripts/record-walkthrough.mjs                                                   # video + GIF (needs ffmpeg)
node scripts/render-pdf.mjs ../../portfolio/case-study/case-study.html ../../portfolio/case-study/case-study.pdf
cd ../.. && python3 scripts/build_interview_deck.py                                    # needs python-pptx==1.0.2
```

**Known limitation:** the deck layout was checked with a text-fit estimate, not opened in PowerPoint or Keynote in this environment. Open it once before an interview.
