# Prompts — IKEA Outro (Seedance 2.5 / 720p / 5s / 9:16 / start_image)

Shared params:
```json
{
  "model": "seedance_2_5",
  "mode": "omni_reference",
  "duration": 5,
  "resolution": "720p",
  "aspect_ratio": "9:16",
  "generate_audio": false,
  "bitrate_mode": "high",
  "medias": [{ "value": "<MEDIA_ID>", "role": "start_image" }]
}
```

---

## A — Style Snap

Locked-off vertical product shot. The white kitchenette cabinet with light oak worktop and the full coffee station on top (black carafe, steel kettle, glass jars, espresso machine, white cup) stays EXACTLY as in the reference image the entire time — same position, same objects, same scale, absolutely no morphing or drifting. Only the empty room around it transforms. Every second the background wall, floor and surrounding decor snap-change to a different IKEA-styled interior: 1) bright Scandinavian minimal, pure white wall, thin black-framed poster, white paper pendant lamp; 2) warm natural wood and linen, oak wall panel, rattan basket, jute rug; 3) green plant room, floating shelves of terracotta pots, hanging vines; 4) moody dark charcoal wall, brass wall lamp, framed art, deep shadow; 5) playful color-pop, bold yellow and blue accents, graphic textile, colorful stool. Instant crisp cuts on the beat with a soft light flash between each style, decor pieces settle with a tiny bounce. Very slow subtle push-in on the counter. Clean commercial catalog lighting, soft realistic shadows on the floor, generous empty wall space above the counter reserved for an end-card logo. Photoreal, no text, no people.

---

## B — Room Builds Itself

Vertical stop-motion style build-up. The white kitchenette cabinet with light oak worktop and its coffee station stay EXACTLY as in the reference image, perfectly still and unchanged, never morphing. Around it an empty studio room assembles itself: IKEA furniture and decor fly in from the edges of frame and snap into place in five quick waves, one per second — 1) a Scandinavian white wall panel and framed poster slide in behind; 2) a light oak shelf, glass jars and a linen runner drop in from above; 3) potted plants and a hanging vine swing in from the sides; 4) a paper pendant lamp descends and switches on with a warm glow, a rattan basket and jute rug slide under; 5) a colorful stool, folded textile and a small side table pop in, then everything settles with a tiny bounce into a finished IKEA-styled kitchen corner. Snappy stop-motion timing, light motion blur on each incoming object, soft settling shadows. Camera locked, then the last half second eases back a few centimeters to reveal the finished room. Clean bright commercial lighting, catalog photography look, empty wall space above the counter for an end-card logo. Photoreal, no text, no people.

---

## C — Orbit Reveal

Vertical hero shot with a smooth orbiting camera. The white kitchenette cabinet with light oak worktop and the complete coffee station on it stay EXACTLY as in the reference image — identical objects, identical arrangement, rock solid, no morphing. The camera glides in a slow gentle arc around the counter; as it passes, a soft sweep of light wipes across frame and the room behind reveals a different IKEA-styled interior each second: 1) bright Scandinavian minimal white room; 2) warm oak and linen room with rattan and jute; 3) plant-filled green room with shelves of pots; 4) moody dark charcoal room with brass lamp and warm pools of light; 5) playful color-pop room with yellow and blue accents. Each reveal is seamless, driven by the light sweep and a soft depth-of-field shift, background furniture cross-dissolving while the counter stays sharp and locked. In the final second the camera eases back to a perfectly centered front-on framing on a clean uncluttered wall, motion settling to a stop. Cinematic commercial lighting, soft shadows, shallow depth of field, generous empty wall space above the counter for an end-card logo. Photoreal, no text, no people.

---

# รอบ 2 — variants ของแบบ B (มี styled-room reference)

Shared params (เพิ่ม image_references):
```json
{
  "model": "seedance_2_5",
  "mode": "omni_reference",
  "duration": 5,
  "resolution": "720p",
  "aspect_ratio": "9:16",
  "generate_audio": false,
  "bitrate_mode": "high",
  "medias": [
    { "value": "<COUNTER_MEDIA_ID>", "role": "start_image" },
    { "value": "<STYLED_ROOM_MEDIA_ID>", "role": "image_references" }
  ]
}
```

---

## B1 — Faithful (ยังไม่ได้รัน — เครดิตไม่พอ)

Vertical stop-motion build-up. The white kitchenette cabinet with light oak worktop and its full coffee station (black carafe, steel kettle, glass jars, espresso machine, white cups) stays EXACTLY as in the first reference image — same position, same objects, same scale, perfectly still, never morphing or drifting. Around it the bare white studio assembles itself into the warm Scandinavian coffee corner shown in the second reference image, with matching palette of cream, natural oak, beige linen and soft daylight. Decor flies in from the edges of frame and snaps into place in five quick waves, one per second: 1) a pale oak floor plank surface sweeps across the ground and a light wood wall tone fills in behind; 2) a slim oak peg rail slides onto the wall above the counter and five white mugs hook themselves on one by one, a beige linen towel drapes over the end; 3) a white-framed handwritten coffee recipe poster swings onto the wall to the right, small and neatly aligned; 4) a black metal three-tier trolley rolls in from the right edge and coffee bags and glass storage jars drop onto its shelves; 5) a woven jute rug unrolls across the floor, a light wood bench slides in on the left with folded knit blankets and a cushion, a seagrass basket settles underneath. Snappy stop-motion timing, slight motion blur on each incoming object, tiny settling bounce and soft contact shadows. Camera locked off, then eases back a few centimetres in the last half second to reveal the finished room. Bright airy daylight, clean commercial catalog lighting, generous empty wall space above the counter reserved for an end-card logo. Photoreal, no text overlay, no people.

---

## B2 — Light Reveal

Vertical stop-motion build-up with a light reveal payoff. The white kitchenette cabinet with light oak worktop and its complete coffee station stays EXACTLY as in the first reference image — identical objects, identical arrangement, rock solid, never morphing. The bare white studio around it builds itself into the warm Scandinavian coffee corner of the second reference image, same cream, oak, beige linen palette. Five quick waves, one per second: 1) pale oak floor planks sweep in and a soft warm wall tone washes across the background; 2) a woven jute rug unrolls, a seagrass basket and a light wood bench with folded knit blankets slide in from the left; 3) a black metal three-tier trolley rolls in from the right, coffee bags and glass jars dropping onto its shelves; 4) an oak peg rail lands on the wall, white mugs hook on one by one, a white-framed coffee recipe poster swings into place beside them; 5) finally a tall window frame builds itself into the left wall and floor-length cream linen curtains drop from the rod, and warm morning sunlight floods across the room, long soft shadows stretching over the floor as everything settles. Snappy stop-motion timing, slight motion blur, tiny settling bounce, soft contact shadows. Camera locked, holding the final lit frame steady. Bright airy daylight, clean catalog lighting, generous empty wall space above the counter for an end-card logo. Photoreal, no text overlay, no people.

---

## B3 — Tight to Wide

Vertical stop-motion build-up that ends on a wide reveal. The white kitchenette cabinet with light oak worktop and its full coffee station stays EXACTLY as in the first reference image — same objects, same layout, perfectly stable, never morphing. It begins framed fairly tight in a bare white studio; as the room assembles, the camera glides smoothly backwards, revealing more floor and wall with every wave. Five waves, one per second, building the warm Scandinavian coffee corner from the second reference image in matching cream, oak and beige linen tones: 1) pale oak floor planks sweep in beneath the counter; 2) an oak peg rail lands on the wall and white mugs hook themselves on, a beige linen towel drapes over the end; 3) a white-framed coffee recipe poster swings onto the wall, a small wooden chopping board leans behind the counter; 4) a black metal three-tier trolley rolls in from the right stacked with coffee bags and glass jars; 5) the camera reaches its widest as a woven jute rug unrolls across the floor and a light wood bench with folded blankets, a cushion and a seagrass basket settles in on the left, everything landing with a tiny bounce. Snappy stop-motion timing, light motion blur on incoming objects, soft contact shadows, smooth easing camera pullback that comes to a gentle stop on a balanced wide composition. Bright airy daylight, clean commercial catalog lighting, generous empty space in the upper frame reserved for an end-card logo. Photoreal, no text overlay, no people.
