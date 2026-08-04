# Vaseline Thailand — TikTok Prompt Pack (Higgsfield)

> **สถานะการวิเคราะห์คลิปต้นฉบับ:** ยังไม่ได้วิเคราะห์
> `www.tiktok.com` ถูกปฏิเสธโดย egress policy ขององค์กร (403 CONNECT) และ
> `media_import_url` ของ Higgsfield ดึงกลับมาได้แค่ HTML ไม่ใช่ไฟล์วิดีโอ
> `video_analysis_create` รับเฉพาะ YouTube URL หรือ media_id ที่อัปโหลดแล้วเท่านั้น
>
> **Prompt pack นี้จึงสร้างจากโครงหมวดสินค้า + ข้อจำกัดจริงของโมเดล Higgsfield ไม่ใช่จากคลิปนั้น**
> ทุกจุดที่ต้องผูกกับคลิปต้นฉบับถูกทำเครื่องหมาย `[ต้องยืนยัน]` ไว้

---

## 0. Unblock — ทำอย่างใดอย่างหนึ่งแล้ววิเคราะห์ได้ทันที

| ทาง | สิ่งที่ส่งมา | สิ่งที่ได้กลับ |
|---|---|---|
| A | ไฟล์ `.mp4` ของคลิป | `media_upload` → `video_analysis_create` → scene-by-scene + `virality_predictor` dashboard |
| B | ลิงก์ YouTube ของคลิปเดียวกัน (reupload/unlisted ก็ได้) | `video_analysis_create(youtube_url)` ตรง ๆ |
| C | ให้ทีมขอ direct CDN url (`.mp4`) | `media_import_url` แล้วต่อเหมือนทาง A |

คลิปสั้นให้ผลแม่นกว่าคลิปยาว — TikTok 15–60 วิ อยู่ในช่วงที่ analysis เชื่อถือได้ดี

---

## 1. Prompt Element — ชุด asset ที่ใช้ซ้ำทุกคลิป

Element คือ reference ที่ล็อกหน้า/ของ/ที่ ให้เหมือนกันข้ามคลิป สร้างครั้งเดียวใช้ได้ทั้ง 10 แบบ
เรียกในพรอมป์ด้วย `<<<element_id>>>` — รองรับบน `seedance_2_0`, `kling3_0`,
`nano_banana_2`, `seedream_v4_5`, `cinematic_studio_2_5`

### กฎเหล็กเรื่องแพ็กเกจ (ห้ามข้าม)

**อย่าให้โมเดลวาดขวด/ฉลาก Vaseline เอง** โมเดลจะเพี้ยนโลโก้ ตัวอักษร และสีฝา ซึ่งใช้งานจริงไม่ได้
และเท่ากับสร้าง brand asset ปลอม — ให้ใช้ **ภาพแพ็กช็อตจริงจากแบรนด์** เป็น Element/reference เสมอ
พรอมป์ทุกอันด้านล่างจึงอ้าง `<<<PROD-01>>>` แทนการบรรยายฉลาก

### รายการ Element

| id | category | ใช้ทำอะไร | ที่มาของภาพ |
|---|---|---|---|
| `PROD-01` | prop | ขวดผลิตภัณฑ์ตัวเอก | **แพ็กช็อตจริง** จากแบรนด์ (PNG พื้นขาว/ตัดพื้นหลัง) |
| `PROD-02` | prop | เนื้อครีม/เจลลี่บนผิว (texture) | ถ่ายจริง หรือ generate ได้ (ไม่มีฉลากอยู่ในเฟรม) |
| `CH-01` | character | พรีเซนเตอร์หลัก | generate ได้ หรือใช้รูปนางแบบที่มีสัญญา |
| `CH-02` | character | เพื่อน/แม่ (ใช้ในบทคู่) | generate ได้ |
| `LOC-01` | environment | ห้องนอนเช้า แสงธรรมชาติ | generate ได้ |
| `LOC-02` | environment | ห้องน้ำ/อ่างล้างหน้า | generate ได้ |
| `LOC-03` | environment | กลางแจ้งกรุงเทพ แดดจัด | generate ได้ |

### พรอมป์สร้าง Element (image) — `generate_image`, model `nano_banana_2`, 3:4

```
CH-01 — Presenter
Photographic portrait reference sheet of one Thai woman, 27 years old, warm medium-tan
skin with visible natural pores and fine texture, no heavy retouching, minimal makeup,
shoulder-length dark brown hair, relaxed friendly resting face. Plain light grey seamless
background, even soft frontal light. Three views in one frame: front, three-quarter, profile.
Consistent face across all three. Natural skin, no beauty filter, no smoothing.
```

```
CH-02 — Second person
Photographic portrait reference sheet of one Thai woman, 52 years old, warm tan skin with
natural age texture, laugh lines, short black hair with grey at the temples, kind direct gaze.
Plain light grey seamless background, even soft frontal light. Front, three-quarter, profile
in one frame. Natural skin, no smoothing, no beauty filter.
```

```
LOC-01 — Morning bedroom
Empty Thai condominium bedroom in the morning, no people. White linen bedding slightly
rumpled, pale wood side table, sheer white curtain with soft daylight coming through from
camera left, one small green plant. Calm, clean, lived-in but tidy. Vertical composition,
natural daylight only, soft shadows, no lamps on.
```

```
LOC-02 — Bathroom
Empty small modern Thai bathroom, no people. White ceramic basin, plain mirror, matte black
tap, folded beige towel, light grey tile. Diffused daylight from a frosted window at camera
right. Clean and simple, vertical composition, no clutter, no branded packaging visible.
```

```
LOC-03 — Bangkok exterior
Empty Bangkok street scene at 2pm, no people in foreground. Hot direct overhead sun, hard
shadows, concrete pavement, a few motorbikes parked, warm haze, distant condo towers.
Vertical composition, high contrast harsh daylight.
```

```
PROD-02 — Texture
Extreme macro of a translucent glossy skincare jelly smear on warm medium-tan human skin,
soft peaks and a thin glossy sheen catching a single soft light from the left. Visible pores
and fine skin texture underneath. No packaging, no label, no text in frame. Shallow depth
of field, clean neutral background falloff.
```

### Brand rules — ใส่ท้ายพรอมป์วิดีโอทุกอัน

```
Vertical 9:16 framing with the subject's face and the product kept inside the centre 80%
safe area, clear of TikTok UI. Natural skin texture preserved — visible pores, no plastic
smoothing, no beauty filter. Real-world lighting only. No on-screen text, no captions,
no logos, and no watermark rendered in the video — text is added in edit.
```

---

## 2. Prompt คลิป 10 รูปแบบ

ทุกอันเป็น 9:16 พร้อม param จริงที่โมเดลรับ
`[ต้องยืนยัน]` = ช่องที่ต้องเทียบกับคลิปต้นฉบับก่อนใช้จริง

---

### 01 — HOOK-DRY · ฮุก 3 วินาทีจากปัญหา

**หน้าที่:** หยุดนิ้วด้วยภาพปัญหา ไม่ใช่ด้วยสินค้า
**Model:** `seedance_2_0` · duration `5` · resolution `1080p` · mode `std` · generate_audio `true`
**Elements:** `<<<CH-01>>>`

```
Extreme macro on the back of <<<CH-01>>>'s hand in hard midday light. The skin is visibly
dry — tight, flaking at the knuckles, fine white cracks catching the light. Her thumb drags
slowly across it and the surface lifts and dulls instead of springing back. Camera holds
tight, then pulls back six inches to reveal her looking down at her own hand, jaw set.
Handheld, slight breathing movement. Harsh unflattering daylight, no fill, no glamour.
```

**ข้อความบนจอ (ตัดทีหลัง):** `ผิวแบบนี้ ทาอะไรก็ไม่ติด` · **วัดผล:** 3-sec view rate

---

### 02 — SPLIT-PROOF · ก่อน/หลัง แยกจอ

**หน้าที่:** พิสูจน์แบบเห็นภาพเดียว ไม่ต้องอธิบาย
**Model:** `kling3_0` · duration `8` · mode `pro` · sound `off`
**Elements:** `<<<CH-01>>>`

```
Split-screen vertical composition, one continuous shot. Left half: <<<CH-01>>>'s forearm,
dry and matte, skin flat and ashy. Right half: the same forearm, supple and softly luminous
with natural sheen. Identical framing, identical lighting, identical pose on both halves —
only the skin condition differs. Slow push-in on both halves at the same rate. Clean soft
daylight from camera left. No text, no divider graphic, no product in frame.
```

**ข้อความบนจอ:** `วันที่ 1` / `วันที่ 14` · **หมายเหตุ:** ระยะเวลาต้องตรงกับเคลมที่แบรนด์อนุมัติ `[ต้องยืนยัน]`

---

### 03 — ASMR-TEXTURE · มาโครเนื้อสัมผัส

**หน้าที่:** retention ล้วน คนดูจนจบเพราะมันน่าดู
**Model:** `seedance_2_0` · duration `8` · resolution `4k` · mode `std` · generate_audio `true`
**Elements:** `<<<PROD-02>>>`

```
Extreme macro, locked-off camera. A fingertip presses into <<<PROD-02>>> and lifts, drawing
a slow glossy string that thins and breaks. The jelly settles back into a soft peak. Then the
finger spreads a thin film sideways across warm medium-tan skin and the surface turns from
matte to a soft even sheen, pores still visible underneath. Single soft key light from the
left, deep falloff to black. Very shallow depth of field. Slow, unhurried, no cuts.
Audio: soft tacky press-and-release, faint skin friction, no music, no voice.
```

**วัดผล:** average watch time ≥ 90%

---

### 04 — UGC-REVIEW · พูดกล้องแบบคนจริง

**หน้าที่:** ความน่าเชื่อถือ ต้องดูเหมือนคลิปที่ถ่ายเอง ไม่ใช่โฆษณา
**Model:** `marketing_studio_video` · mode `ugc` · resolution `1080p` · generate_audio `true` · duration 12–15
**ใส่:** `product_ids: ['<PROD-01 id>']` + `hook_id` + `setting_id` (ดึงจาก `show_marketing_studio`)

```
A 27-year-old Thai woman sits on the edge of her bed in soft morning light, phone propped
at arm's length, filming herself vertically. She is mid-conversation, not performing —
talking with her hands, glancing off-camera once, a small self-conscious laugh. She holds
the product loosely, taps the cap while she talks, then turns her forearm to camera to show
her skin. Slightly imperfect handheld framing, natural room audio, no studio lighting,
no colour grade. She looks like a real person recommending something, not an actor.
```

**สคริปต์พูด (ไทย):** เขียนแยกแล้วป้อนผ่าน hook/setting — ห้ามอ้างสรรพคุณเกินที่แบรนด์อนุมัติ `[ต้องยืนยัน]`

---

### 05 — GRWM · เตรียมตัวไปทำงาน

**หน้าที่:** วางสินค้าเข้าไปในกิจวัตร ไม่ใช่ในโฆษณา
**Model:** `flux_3_video` · duration `15` · resolution `1080p` · generate_audio `true`
**Elements:** `<<<CH-01>>>` `<<<LOC-01>>>` `<<<LOC-02>>>`

```
Continuous morning routine in one flowing sequence. <<<CH-01>>> in <<<LOC-01>>> pushes the
curtain open and squints at the light. She moves to <<<LOC-02>>>, splashes her face, presses
a towel to it. Back in <<<LOC-01>>> she sits on the bed and works lotion down one shin with
both hands, unhurried, the way someone does when no one is watching. She pulls on a work
shirt and checks her phone. Handheld follow, natural daylight throughout, quiet ambient
room sound. No dialogue, no music, no direct looks at camera.
```

**ข้อความบนจอ:** ไทม์สแตมป์ `6:40` `6:48` `7:05` ตัดวางทีหลัง

---

### 06 — HERO-PACK · ฮีโร่ช็อตสินค้า

**หน้าที่:** ภาพจำแบรนด์ ใช้ปิดท้ายทุกคลิปได้
**Model:** `seedance_2_0` · duration `4` · resolution `4k` · mode `std` · generate_audio `false`
**Elements:** `<<<PROD-01>>>` ← **ต้องเป็นแพ็กช็อตจริงเท่านั้น**

```
<<<PROD-01>>> standing upright on a seamless warm-neutral surface. The camera arcs slowly
90 degrees around it while a soft rim light sweeps across the container from behind,
lifting its edge out of the background. A single wide soft key from the front-left keeps
the front face evenly lit and fully legible at all times. Product stays razor sharp and
perfectly centred, packaging never distorts, never tilts, never leaves frame. Background
gradient falls off gently to deeper warm neutral. No hands, no props, no text.
```

**ตรวจก่อนใช้:** ฉลากต้องอ่านออกและตรงกับแพ็กช็อตต้นฉบับ 100% — เพี้ยนเมื่อไหร่ทิ้งเทกนั้น

---

### 07 — TOUCH-SWITCH · แตะแล้วเปลี่ยน

**หน้าที่:** ทรานซิชันที่คนอยากดูซ้ำ
**Model:** `kling3_0` · duration `6` · mode `pro` · sound `on`
**Elements:** `<<<CH-01>>>` · **first frame:** ภาพผิวแห้ง

```
One continuous take, no cuts. <<<CH-01>>>'s palm covers the camera lens completely, the
frame goes to soft skin-blur for a beat, and when the hand pulls away the same forearm is
now supple and softly luminous, the room behind her brighter and warmer than before.
Same framing, same pose, same distance — only the skin and the light have changed.
The motion through the blackout is smooth and even so the two states read as one shot.
Handheld, natural daylight.
```

**ใช้ต่อ:** ตัดเป็นลูปกับ #10 ได้

---

### 08 — MYTH-BUST · ความเชื่อผิด

**หน้าที่:** คอมเมนต์เยอะ เพราะคนอยากเถียง
**Model:** `marketing_studio_video` · mode `tutorial` · resolution `1080p` · generate_audio `true`
**Elements:** `<<<CH-01>>>` `<<<LOC-02>>>`

```
<<<CH-01>>> stands at the basin in <<<LOC-02>>> facing camera. She raises one finger and
shakes her head once — a clear, deliberate "no" — then turns her forearm to the lens and
runs a thumb along it while she explains, tapping the skin twice to make her point. She
finishes with a small shrug and a direct look into the lens. Steady phone-height framing,
diffused daylight, natural room audio, conversational energy, no studio polish.
```

**ข้อความบนจอ:** `เข้าใจผิด: ผิวมัน = ไม่ต้องบำรุง` → `จริง: ...` — ต้องอิงข้อมูลที่แบรนด์อนุมัติ `[ต้องยืนยัน]`

---

### 09 — 3-STEP · รูทีน 3 ขั้น

**หน้าที่:** save เยอะ เพราะเป็นของที่คนเก็บไว้ทำตาม
**Model:** `flux_3_video` · duration `12` · resolution `1080p` · generate_audio `false`
**Elements:** `<<<CH-01>>>` `<<<LOC-02>>>` `<<<PROD-02>>>`

```
Three clean beats in one sequence, each held long enough to follow. One: <<<CH-01>>> in
<<<LOC-02>>> pats her damp forearm dry with a towel, skin still slightly wet. Two: overhead
macro as she dispenses <<<PROD-02>>> into her palm and rubs both palms together once to warm
it. Three: she works it down her forearm in slow upward strokes toward the elbow, then turns
the arm to show the finished sheen. Locked-off camera on beats one and three, top-down on
beat two. Even diffused daylight, matched exposure across all three beats.
```

**ข้อความบนจอ:** `1 ทาตอนผิวยังหมาด` · `2 อุ่นในมือก่อน` · `3 ลูบขึ้น`

---

### 10 — TREND-LOOP · ลูปไร้รอยต่อ

**หน้าที่:** เกาะเสียงเทรนด์ + ลูปทำให้ยอดวิวทบ
**Model:** `seedance_2_0` · duration `6` · resolution `1080p` · mode `std` · generate_audio `false`
**Elements:** `<<<CH-01>>>` `<<<LOC-03>>>`
**สำคัญ:** ใส่ `start_image` และ `end_image` เป็น **เฟรมเดียวกัน** เพื่อให้ลูปสนิท

```
<<<CH-01>>> stands in <<<LOC-03>>> under hard overhead sun. She lifts one forearm into the
light, turns it once so the sheen travels across the skin, drops the arm, and settles back
into the exact starting pose and expression. The camera makes one slow continuous orbit and
returns to precisely where it began. First and last frame are identical in framing, pose,
and light so the clip loops with no visible seam. Handheld with minimal drift, harsh
natural daylight, no cuts.
```

**เพลง:** ดึงจาก `tiktok_music_trending` ก่อนโพสต์ แล้วตัดจังหวะให้ตรงบีต

---

## 3. ลำดับการรันที่แนะนำ

1. อัปโหลดแพ็กช็อตจริง → `show_reference_elements(action='create')` เป็น `PROD-01`
2. รัน 6 พรอมป์ image ด้านบน → สร้าง `CH-01` `CH-02` `LOC-01..03` `PROD-02`
3. ทดสอบ 3 อันก่อน: **01, 03, 06** — ฮุก / retention / brand asset อย่างละหนึ่ง
4. `virality_predictor` กับตัวที่ผ่าน แล้วค่อยขยายที่เหลือ
5. เครดิตคงเหลือตอนสร้างแพ็กนี้: **747.02** (plan: plus)

## 4. ยังค้าง

- [ ] วิเคราะห์คลิปต้นฉบับ — รอไฟล์หรือลิงก์ YouTube (ดูข้อ 0)
- [ ] เคลมสรรพคุณและระยะเวลาที่แบรนด์อนุมัติ (กระทบ #02, #04, #08)
- [ ] แพ็กช็อตจริงสำหรับ `PROD-01`
- [ ] เสียงเทรนด์ ณ วันโพสต์ สำหรับ #10
