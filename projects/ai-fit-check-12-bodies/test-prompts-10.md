# 10 รูปแบบ prompt สำหรับ A/B เทส — เสื้อตัวเดียว หุ่นต่างกัน

ทุก prompt รับ **2 reference** ขึ้นไป: ภาพนางแบบที่เจนไว้แล้ว + ภาพเสื้อผ้าจริงที่คุณอัปโหลด
เจนได้ด้วย `gpt_image_2` หรือ `nano_banana_pro` (ตัวหลังมักถ่ายทอดลายผ้าแม่นกว่า)

## แกนคงที่ที่ห้ามตัดออก

ทุก prompt ฝัง 3 ประโยคนี้ไว้แล้ว เพราะมันคือจุดที่งานประเภทนี้พังบ่อยที่สุด:

1. `Reference image 1 = the model. Reference image 2 = the garment.` — ระบุว่าอันไหนคืออะไร
   ไม่งั้นโมเดลเดาสลับกัน
2. `Reproduce the garment ... exactly ... unchanged` — กันไม่ให้ AI ออกแบบเสื้อใหม่
   ซึ่งจะทำให้ของที่ลูกค้าได้ไม่ตรงคลิป
3. `do not slim, do not retouch` — ถ้าไม่ล็อก โมเดลจะทำให้ทุกคนผอมลงเท่ากัน
   แล้วคลิปเทียบหุ่นก็หมดความหมายทันที

**ตัวแปรที่ต้องคุมตอนเทส:** เปลี่ยนทีละรูปแบบ อย่าเปลี่ยนเสื้อไปด้วย ไม่งั้นแยกไม่ออกว่า
ผลต่างมาจากฟอร์แมตหรือมาจากสินค้า

---

## 1. เรียงแถวเทียบตรง ๆ (Lineup)

**ทดสอบ:** การเทียบแบบตรงไปตรงมาที่สุด อ่านง่ายที่สุด
**ควรชนะเมื่อ:** คนดูต้องการคำตอบเร็ว และหุ่นต่างกันชัดจนไม่ต้องอธิบาย

```
Reference image 1 = the models. Reference image 2 = the garment.
Dress every woman from image 1 in the garment from image 2. Reproduce the
garment's colour, print, cut, sleeve length, hem length and buttons exactly as
in image 2, unchanged. Keep each woman's body, height, proportions, face and
hair exactly as in image 1 — do not slim, do not retouch, do not equalise their
body types. The fabric must drape according to each woman's actual shape, so
the same garment visibly sits differently on each of them.
They stand side by side in one straight row on the same ground line, evenly
spaced, facing the camera straight on, arms relaxed at their sides, feet
shoulder-width apart, neutral friendly expressions. Add plain black wide-leg
trousers and plain white sneakers to all of them.
Background: seamless plain light grey studio cyclorama, empty. Lighting: soft
even frontal softbox, flat and identical across the row. Camera: eye level,
straight on, everyone fully visible head to toe.
Photorealistic, sharp, no text, no logos, no watermark.
```
`16:9` · 4K

---

## 2. กริด 2×2 ตรงฟอร์แมตคลิป

**ทดสอบ:** ฟอร์แมตจริงที่จะใช้ในคลิป ได้เห็นเลยว่า 4 ช่องอยู่ด้วยกันแล้วอ่านออกไหม
**ควรชนะเมื่อ:** จะเอาไปตัดเป็นคลิป 4 ช่องอยู่แล้ว อยากเห็นผลลัพธ์สุดท้ายก่อนลงทุนทำวิดีโอ

```
Reference image 1 = the models. Reference image 2 = the garment.
Create a 2x2 grid of four separate vertical panels with thin white dividing
lines. Each panel contains one of the women from image 1, standing alone, full
body head to toe, centred in her panel.
Dress every woman in the garment from image 2. Reproduce the garment's colour,
print, cut, sleeve length, hem length and buttons exactly as in image 2,
unchanged. Keep each woman's body, height, proportions, face and hair exactly as
in image 1 — do not slim, do not retouch. The fabric drapes according to each
woman's actual shape.
Every panel uses identical framing scale, identical pose (standing straight on,
arms at sides, feet shoulder-width apart), identical seamless plain light grey
background, and identical soft even frontal lighting, so only the body differs.
Add plain black wide-leg trousers and plain white sneakers to all of them.
Photorealistic, sharp, no text, no logos, no watermark.
```
`9:16` · 4K

---

## 3. เดี่ยว เฟรมล็อกเป๊ะ (Control shot)

**ทดสอบ:** ความคมชัดสูงสุดต่อคน เพราะไม่ต้องแบ่งความละเอียดให้ใคร
**ควรชนะเมื่อ:** ชีตรวมออกมาแล้วหุ่นกลืนกัน — วิธีนี้แม่นกว่าเสมอ แค่ต้องเจน 12 ครั้ง

```
Reference image 1 = the model. Reference image 2 = the garment.
Dress the woman from image 1 in the garment from image 2. Reproduce the
garment's colour, print, cut, sleeve length, hem length and buttons exactly as
in image 2, unchanged. Keep her body, height, proportions, face and hair exactly
as in image 1 — do not slim, do not retouch. The fabric drapes according to her
actual body shape, so the fit reads honestly: note where the shoulder seam
lands, where the sleeve ends on her arm, and where the hem falls on her hip.
Add plain black wide-leg trousers and plain white sneakers.
Pose: standing centred, facing camera straight on, arms relaxed at her sides,
feet shoulder-width apart, neutral friendly expression.
Background: seamless plain light grey studio cyclorama, empty. Lighting: soft
even frontal softbox, no harsh shadows. Camera: 50mm lens, eye level, full body
head to toe with a small even margin above the head and below the feet.
Photorealistic, sharp, no text, no logos, no watermark.
```
`9:16` · 4K — ใช้ prompt เดียวกันทั้ง 12 ครั้ง เปลี่ยนแค่ reference image 1

---

## 4. ครอปช่วงลำตัว โฟกัสจุดฟิต

**ทดสอบ:** ตัดหน้าและขาออก เหลือแค่ข้อมูล — ไหล่ อก เอว ชายเสื้อ
**ควรชนะเมื่อ:** คนดูเลื่อนผ่านเร็ว ภาพเต็มตัวเล็กเกินจะเห็นรายละเอียด

```
Reference image 1 = the model. Reference image 2 = the garment.
Dress the woman from image 1 in the garment from image 2. Reproduce the
garment's colour, print, cut, sleeve length and hem length exactly as in image
2, unchanged. Keep her body proportions exactly as in image 1 — do not slim, do
not retouch.
Frame a tight medium shot from the top of her shoulders down to mid-thigh, so
the shoulder seam, the sleeve opening around her arm, the way the fabric falls
across her torso, and the exact point where the hem lands on her hip are all
clearly visible and fill the frame. Her head is cropped out above the chin.
Add plain black wide-leg trousers.
Background: seamless plain light grey, empty. Lighting: soft even frontal
softbox. Camera: straight on at chest height, no tilt.
Photorealistic, sharp, high detail on fabric texture and seams, no text, no
logos, no watermark.
```
`9:16` หรือ `4:5` · 4K

---

## 5. ชาร์ตความสูงมาตราส่วนจริง

**ทดสอบ:** ความสูงที่วัดได้จริง ไม่ใช่แค่ "ดูสูงกว่า"
**ควรชนะเมื่อ:** กลุ่มลูกค้าถามเรื่องส่วนสูงเยอะ (คนเตี้ยกลัวเสื้อยาวเกิน คนสูงกลัวเสื้อสั้น)

```
Reference image 1 = the models. Reference image 2 = the garment.
Create a height-comparison chart. All women from image 1 stand side by side on
one shared ground line, rendered at one consistent scale so their relative
heights are accurate and directly measurable against each other, shortest on the
left rising to tallest on the right. Behind them runs a plain light grey wall
with faint evenly spaced horizontal measurement lines.
Dress every woman in the garment from image 2. Reproduce the garment's colour,
print, cut, sleeve length, hem length and buttons exactly as in image 2,
unchanged. Keep each woman's body, height, proportions, face and hair exactly as
in image 1 — do not slim, do not retouch.
Add plain black wide-leg trousers and plain white sneakers to all of them.
Pose: standing straight on, arms at sides, feet together. Lighting: soft even
frontal, flat and identical across the row. Camera: eye level, straight on, no
perspective distortion, everyone fully visible head to toe.
Photorealistic, sharp, no text, no numbers, no logos, no watermark.
```
`16:9` · 4K

---

## 6. ห้องลองเสื้อ กระจกบานใหญ่

**ทดสอบ:** ลดความเป็นแคตตาล็อก เพิ่มความเป็นเรื่องจริง
**ควรชนะเมื่อ:** ฟีดเต็มไปด้วยภาพสตูดิโอสะอาด ๆ จนคนเลื่อนผ่าน อยากได้ภาพที่ดูเหมือนคนจริงถ่ายเอง

```
Reference image 1 = the model. Reference image 2 = the garment.
Dress the woman from image 1 in the garment from image 2. Reproduce the
garment's colour, print, cut, sleeve length, hem length and buttons exactly as
in image 2, unchanged. Keep her body, height, proportions, face and hair exactly
as in image 1 — do not slim, do not retouch.
She stands in a bright clean fitting room in front of a large full-length
mirror, looking at her own reflection while holding the hem of the garment out
slightly to one side with one hand, the way someone checks a fit. Warm wood
frame around the mirror, soft cream curtain behind her, a small wooden stool in
the corner. Add plain black wide-leg trousers.
Both she and her reflection are clearly visible and consistent with each other.
Lighting: soft warm overhead fitting-room light plus gentle fill, natural
looking. Camera: eye level, slightly off centre, full body head to toe.
Photorealistic, candid feel, sharp, no text, no logos, no watermark.
```
`9:16` · 4K

---

## 7. ท่าเดิน ผ้าเคลื่อนไหว

**ทดสอบ:** เสื้อตอนขยับ ไม่ใช่ตอนยืนนิ่ง — ผ้าไหมกับผ้าคอตตอนตกต่างกันมาก
**ควรชนะเมื่อ:** สินค้าเป็นผ้าลื่นหรือทรงพลิ้ว ที่ภาพยืนนิ่งขายไม่ออก

```
Reference image 1 = the model. Reference image 2 = the garment.
Dress the woman from image 1 in the garment from image 2. Reproduce the
garment's colour, print, cut, sleeve length, hem length and buttons exactly as
in image 2, unchanged. Keep her body, height, proportions, face and hair exactly
as in image 1 — do not slim, do not retouch.
Capture her mid-stride walking directly toward the camera, one foot lifted, the
garment caught in motion — the hem lifting and swinging slightly to one side,
the sleeves moving away from her arms, the fabric showing how it actually falls
and flows on her particular body. Natural relaxed expression, arms swinging
loosely. Add plain black wide-leg trousers and plain white sneakers.
Background: seamless plain light grey studio cyclorama, empty. Lighting: soft
even frontal softbox. Camera: eye level, straight on, full body head to toe,
crisp motion with no blur.
Photorealistic, sharp, no text, no logos, no watermark.
```
`9:16` · 4K

---

## 8. หมุนรอบตัว 3 มุม (Turnaround)

**ทดสอบ:** หน้า–ข้าง–หลัง ในภาพเดียว ตอบคำถาม "ด้านหลังเป็นยังไง"
**ควรชนะเมื่อ:** ลูกค้าคอมเมนต์ถามด้านหลังบ่อย หรือเสื้อมีดีเทลด้านหลัง

```
Reference image 1 = the model. Reference image 2 = the garment.
Dress the woman from image 1 in the garment from image 2. Reproduce the
garment's colour, print, cut, sleeve length, hem length and buttons exactly as
in image 2, unchanged. Keep her body, height, proportions, face and hair exactly
as in image 1 — do not slim, do not retouch.
Show the same woman three times across the frame in one continuous row: on the
left facing the camera front on, in the middle turned to her exact side profile,
on the right facing directly away showing the full back of the garment. Same
woman, same garment, same standing pose, same distance from camera, same
lighting in all three — only the rotation changes.
Add plain black wide-leg trousers and plain white sneakers.
Background: seamless plain light grey studio cyclorama, empty and continuous
across the whole frame. Lighting: soft even frontal softbox, flat and identical.
Camera: eye level, full body head to toe for all three.
Photorealistic, sharp, no text, no logos, no watermark.
```
`16:9` · 4K

---

## 9. โลเคชั่นจริง ไม่ใช่สตูดิโอ

**ทดสอบ:** บริบทช่วยขายหรือแย่งความสนใจ
**ควรชนะเมื่อ:** สินค้าผูกกับซีน (เสื้อคอฮาวาย + ฉากซัมเมอร์) ที่ฉากช่วยเล่าว่าใส่ไปไหน

```
Reference image 1 = the models. Reference image 2 = the garment.
Dress every woman from image 1 in the garment from image 2. Reproduce the
garment's colour, print, cut, sleeve length, hem length and buttons exactly as
in image 2, unchanged. Keep each woman's body, height, proportions, face and
hair exactly as in image 1 — do not slim, do not retouch.
They stand side by side in one row against a bright whitewashed stucco wall with
a pale polished concrete floor, crisp monstera leaf shadows thrown across the
wall by hard midday sun coming from the left, a woven rattan chair in the far
right corner. Relaxed natural standing poses, warm friendly expressions.
Add plain black wide-leg trousers and plain white sneakers to all of them.
Every woman is lit by the same hard sunlight from the left with matching shadow
direction and matching shadow hardness, so they all belong in the same scene.
Camera: eye level, straight on, everyone fully visible head to toe.
Photorealistic, vivid summer colour grade, sharp, no text, no logos, no
watermark.
```
`16:9` หรือ `9:16` · 4K

---

## 10. แผนที่จุดฟิต มีป้ายชี้

**ทดสอบ:** อธิบายให้ชัดว่าต่างกันตรงไหน แทนที่จะให้คนดูสังเกตเอง
**ควรชนะเมื่อ:** คนดูไม่รู้ว่าต้องดูอะไร — ป้ายชี้เปลี่ยนภาพสวยให้เป็นข้อมูล

```
Reference image 1 = the models. Reference image 2 = the garment.
Dress every woman from image 1 in the garment from image 2. Reproduce the
garment's colour, print, cut, sleeve length, hem length and buttons exactly as
in image 2, unchanged. Keep each woman's body, height, proportions, face and
hair exactly as in image 1 — do not slim, do not retouch.
They stand side by side in one row, facing the camera straight on, arms slightly
away from the body so the garment's silhouette is fully readable. Add plain
black wide-leg trousers.
Overlay a clean flat-design annotation layer in a thin dark grey line weight:
around each woman draw three small circles marking her shoulder seam, her sleeve
opening, and the point where the hem lands, each connected by a thin straight
leader line to a small plain rectangular label box in the empty space above or
below her. The label boxes contain these exact English words only, one per box:
SHOULDER, SLEEVE, HEM. Clean sans-serif capitals, correctly spelled, no other
text anywhere.
Background: seamless plain light grey studio cyclorama, empty, with generous
clear space around the row for the annotation layer. Lighting: soft even
frontal, flat and identical. Camera: eye level, straight on, everyone fully
visible head to toe.
Photorealistic people with a crisp flat vector annotation overlay, sharp, no
logos, no watermark.
```
`16:9` · 4K — ถ้าตัวหนังสือเพี้ยน ให้ตัดคำสั่ง label ออก เหลือแค่วงกลม แล้วพิมพ์ป้ายไทยเองใน CapCut

---

## วิธีเทสให้ได้คำตอบจริง

**ตั้งเกณฑ์ก่อนดูภาพ** ไม่งั้นจะเลือก "อันที่สวยที่สุด" ซึ่งไม่ใช่คำถาม คำถามคือ
*อันไหนทำให้คนดูเห็นความต่างของหุ่นได้เร็วที่สุด*

1. **ทดสอบ 3 วินาที** — เปิดภาพให้คนที่ไม่รู้เรื่องดู 3 วินาที ปิด แล้วถามว่าเห็นอะไร
   ถ้าตอบ "นางแบบสวย" = ตก ถ้าตอบ "คนหุ่นไม่เหมือนกันใส่เสื้อตัวเดียวกัน" = ผ่าน
2. **ทดสอบหาตัวเอง** — ถามว่า "หุ่นคุณใกล้คนไหนที่สุด" ถ้าชี้ได้ภายใน 5 วินาที = ผ่าน
3. **ทดสอบความตรงของสินค้า** — วางภาพที่ได้คู่กับรูปสินค้าจริง ลาย/สี/ความยาวแขน
   ต่างกันเมื่อไหร่ = ตกทันที ต่อให้ภาพสวยแค่ไหน ข้อนี้ veto ทุกข้อ

**อย่าเทสทั้ง 10 พร้อมกัน** — เจน 1, 2, 3 ก่อน (เทียบแถว vs กริด vs เดี่ยว) เพราะสามอันนี้
ตอบคำถามโครงสร้างที่ใหญ่ที่สุด ได้คำตอบแล้วค่อยเอาตัวชนะไปลองผสมกับ 4–10
