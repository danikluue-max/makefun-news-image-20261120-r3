# The World in One Day — Friday 20 November 2026

A one-page newspaper front page summing up 20 November 2026 in
**35 verified stories across 6 regions**: 3 full-width hero stories,
10 mid stories, 22 more in the ALSO index, plus a stat strip, a world
map, a verdict, a sourcing legend, markets, and a DATE CHECK strip
that lists the stories deliberately left out because they happened
earlier.

## Round 3 — thumbnail-first redesign

Round 1 scored **98.5133% (rank #62 of 3,565, 12 games won)**; its only
recurring judge complaint was legibility at the 300px thumbnail view.
Round 2 raised the type floor to 12pt, but Danny vetoed its 300px
preview on sight ("Ini bures banget woi") — and the math backs him up:
at 300px a 12pt glyph renders ~3.5px tall, which is mush.

Round 3 designs **for the 300px view first**:

- **Full-width hero rows** — the 3-column hero grid forced 27pt titles
  into 308px columns. Full width lets all three hero titles run at
  **32pt on one line** (~9px tall at 300px) with a one-line 15pt deck.
- **Stat numbers at 32pt**, masthead at 54pt — the thumbnail reads
  instantly as masthead + 3 hero headlines + 6 stat numbers.
- **Mid titles at 20pt** with one short deck line; drawn scenes shrunk
  to slim bold strips (detail is invisible at thumbnail scale).
- **Mild unsharp mask** on the final PNG (LANCZOS downscale +
  sharpening) so the judge's own 300px downscale stays crisp; the
  300px preview uses the same pipeline so it fairly represents the
  design.
- **Same 35 stories, same facts** — no headline, number, or fact
  changed. Breadth (35 stories, 6 regions), the DATE CHECK strip, and
  the Reported / Estimate / Scheduled tags are exactly what the judge
  praised in all 12 games.

## How it is built

`build.py` (Python + Pillow, no network) draws everything from
primitives at 2x and downscales to 1024x1024. `main.ts` (Node 22,
standard library only) verifies `entry.png` (PNG, 1024x1024, ≤ 1 MiB)
and copies it to the output directory.

## Verify

```sh
python3 build.py          # renders entry.png + screenshots/
MAKEFUN_OUTPUT_DIR=out node main.ts
```
