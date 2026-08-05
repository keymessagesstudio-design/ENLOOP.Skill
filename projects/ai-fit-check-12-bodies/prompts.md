# Prompt ทั้งหมด — AI Fit Check 12 หุ่น

โมเดล `gpt_image_2` (OpenAI) · `resolution: 4k` · `quality: high`

---

## A. Base Body Sheet — 12 หุ่นในภาพเดียว

ใช้เป็น **ฐานหุ่น** สำหรับเอาไปแต่งตัวในขั้นถัดไป ไม่ใช่ภาพที่เอาไปลงเอง

> ### ⚠️ ชุดฐานต้องเป็น activewear ไม่ใช่ชุดชั้นใน
>
> ลองสั่งเป็น **เกาะอก + กางเกงในสีเนื้อ** ตามที่ตั้งใจไว้ก่อน — GPT Image 2 ตีกลับ
> ทั้ง 5 ภาพด้วยสถานะ `nsfw` ทั้งที่เขียนกรอบเป็น fit-model chart, non-sexualized,
> adults only แล้ว ฟิลเตอร์จับที่ "ผู้หญิงหลายคน + ชุดชั้นใน" ไม่ได้จับที่คำอธิบายรอบ ๆ
> เลี่ยงด้วยการเขียนสรรพคุณเพิ่มไม่ได้
>
> **ตัวแทนที่ใช้งานได้:** `plain matte light grey seamless sleeveless athletic
> crop top and matching plain matte light grey seamless fitted mid-thigh bike
> shorts` — รัดรูปเท่ากัน เห็นเส้นสายหุ่นครบเท่ากัน แต่อ่านว่าเป็นชุดออกกำลังกาย
> ฟิลเตอร์จึงปล่อยผ่าน และยังทำหน้าที่เดิมคือเป็นฐานเปล่าที่ไม่มีสไตล์ของตัวเอง
> มากวนตอนเอาไปแต่งตัว

### A1 — แถวเดียว 12 คน เรียงตามความสูง (`16:9`)

```
A professional garment-fitting body-type reference chart, catalog documentation
style, non-sexualized, adults only. Twelve different adult Thai women stand side
by side in one straight horizontal row on the same ground line, evenly spaced,
all facing the camera straight on, arms relaxed at their sides, feet
shoulder-width apart, neutral closed-mouth expressions, looking at the camera.
Every woman wears the identical plain matte nude beige seamless strapless
bandeau top and matching plain matte nude beige high-waist briefs, exactly like
a fit-model mannequin lineup. Bare feet. No other clothing, no shoes, no
jewelry, no props, no text, no numbers, no watermark.

From left to right the twelve bodies are, in this exact order, and their
relative heights in the frame must be accurate to the stated heights:
1) 148 cm 52 kg, very short frame, short legs, short torso, soft round lower
   belly, short black bob with bangs.
2) 150 cm 40 kg, extremely slim and petite, narrow sloping shoulders, flat
   chest, very thin arms and legs, long straight black hair.
3) 155 cm 58 kg, slightly chubby average build, soft rounded stomach, softly
   rounded upper arms, shoulder-length black bob.
4) 157 cm 68 kg, apple-shaped, round full belly carrying most weight at the
   midsection, narrow hips, slim toned legs, shoulder-length dark brown hair
   with blunt bangs.
5) 158 cm 52 kg, hourglass, full bust, clearly nipped-in narrow waist, wide
   rounded hips, long dark brown wavy hair.
6) 158 cm 65 kg, postpartum body, soft loose lower belly, full heavy bust,
   undefined softer waist, shoulder-length black hair tied back.
7) 160 cm 62 kg, pear-shaped, narrow shoulders and small bust with noticeably
   wider hips and full thighs, short black pixie cut.
8) 160 cm 72 kg, curvy full-figured, thick upper arms, full bust, round soft
   belly, full thighs, long black hair in a ponytail.
9) 162 cm 85 kg, plus-size, full round body, very full bust, large soft belly,
   thick arms and thighs, fuller face and neck, long black hair worn loose.
10) 165 cm 47 kg, tall and very slim, long limbs, long torso, narrow hips, flat
    stomach, long wavy dark brown hair.
11) 168 cm 60 kg, athletic broad-shouldered, visible shoulder and arm muscle
    definition, straight waist, muscular thighs, black hair in a high bun.
12) 175 cm 63 kg, very tall and lean, extremely long arms and legs, narrow
    frame, small bust, very long straight dark brown hair.

Each woman is a clearly distinct individual with her own face. Background:
seamless plain light grey studio cyclorama, completely empty. Lighting: soft
even frontal softbox, flat and shadowless, identical across the whole row.
Camera: eye level, straight on, every woman fully visible head to toe with a
small even margin above the tallest head and below the feet. Photorealistic,
realistic untouched skin texture, natural unaltered body proportions, no
slimming, no beauty retouching.
```

**เรียงตามความสูงมีเหตุผล** — ไล่ 148 → 175 ทำให้ภาพอ่านออกทันทีว่าเป็นชาร์ตเทียบไซส์
และช่วยให้โมเดลวางสัดส่วนความสูงถูก เพราะมี gradient ให้เกาะ

### A2 — กริด 3 แถว × 4 คอลัมน์ (`3:2`)

โครงเดียวกับ A1 แต่จัดเป็นกริด และเรียงตามชุดที่จะใช้ในคลิป (แถว 1 = เซ็ต A, แถว 2 = เซ็ต B,
แถว 3 = เซ็ต C) ดูเวอร์ชันเต็มใน git history ของไฟล์นี้หรือใน `README.md` §3

### A3–A5 — แยกเป็น 3 ภาพ ภาพละ 4 คน (`16:9`)

ประกันความเสี่ยง: 12 คนในภาพเดียวมักได้หุ่นที่กลืนกัน เพราะโมเดลต้องแบ่งความละเอียดกัน
4 คนต่อภาพให้ความแม่นสูงกว่ามาก และตรงกับผัง 4 ช่องของคลิปพอดี

โครงเหมือน A1 เปลี่ยนแค่รายชื่อหุ่น:
- **A3 (เซ็ต A):** 150/40 · 160/72 · 158/52 · 162/85
- **A4 (เซ็ต B):** 165/47 · 160/62 · 148/52 · 168/60
- **A5 (เซ็ต C):** 155/58 · 157/68 · 175/63 · 158/65

---

## B. Prompt แต่งตัว (ขั้นที่ 2)

รับภาพฐานจาก A มาเป็น reference แล้วใส่เสื้อผ้าจริง ใช้โมเดลที่รับ media input
(`gpt_image_2` หรือ `nano_banana_pro`) ส่ง **2 media**: ภาพหุ่นฐาน + ภาพสินค้าจริง

```
Dress the woman in the first reference image in the exact garment shown in the
second reference image. Keep her body, height, proportions, face, hair, pose,
the grey studio background, and the lighting completely unchanged. Reproduce
the garment's colour, print, cut, sleeve length and hem length exactly as in
the product photo, with the fabric draping naturally over her actual body
shape. Add plain black wide-leg trousers and plain white sneakers. Full body
head to toe, photorealistic, no slimming, no beauty retouching, no text.
```

> **ทำไมต้องแต่งตัวขั้นภาพ ไม่ใช่ขั้นวิดีโอ** — โมเดลวิดีโอไม่ได้ออกแบบมาให้ "ใส่เสื้อ" ให้คน
> มันจะแปลงทั้งเฟรมและได้เสื้อคนละตัวกับสินค้า ขั้นตอนที่คุมได้คือ แต่งตัวในภาพนิ่งก่อน
> ตรวจว่าลาย/สี/ทรงตรงสินค้าจริง แล้วค่อยเอาภาพที่ผ่านแล้วไปทำวิดีโอ

---

## C. Prompt วิดีโอ (ขั้นที่ 3)

image-to-video คลิปละ 4 วินาที ใช้ prompt เดียวกันทั้ง 12 คลิป

```
The woman turns slowly through one smooth full 360-degree rotation over four
seconds and returns to facing camera. Camera locked, no zoom, no pan.
Background completely static. The shirt moves naturally with her body.
```

หมุน 360° เพราะมันตอบคำถามที่ภาพนิ่งตอบไม่ได้ คือ "ด้านหลังกับด้านข้างเป็นยังไง"
และต้องเป็น prompt เดียวกันทุกคลิป ไม่งั้นการเทียบหุ่นเสียความหมาย
