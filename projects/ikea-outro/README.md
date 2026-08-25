# IKEA Outro — Coffee Station, 5 Styles in 5 Seconds

คลิปปิดท้าย (outro) สำหรับงาน IKEA: เซ็ตเคาน์เตอร์ครัวขาว + ท็อปไม้โอ๊ค + coffee station
ยืนนิ่งเป็นพระเอก ส่วน **background เปลี่ยนสไตล์ตกแต่ง IKEA 5 แบบ ภายใน 5 วินาที** (สไตล์ละ ~1 วิ)

## สเปกที่ใช้จริง

| หัวข้อ | ค่า |
|---|---|
| Engine | Higgsfield |
| Model | `seedance_2_5` (Seedance 2.5, Bytedance) |
| Mode | `omni_reference` + role `start_image` |
| Duration | 5 วินาที |
| Resolution | 720p (720 × 1280) |
| Aspect ratio | 9:16 |
| Bitrate | high |
| Audio | ปิด (`generate_audio: false`) — เว้นไว้ให้ใส่เพลง/SFX เอง |
| Reference image | เซ็ต coffee station ต้นฉบับ (2160 × 3840 PNG) |

## 5 สไตล์ background ที่ไล่ในไทม์ไลน์

1. **Scandinavian minimal** — ผนังขาว, โปสเตอร์กรอบดำบาง, โคมกระดาษขาว
2. **Warm wood & linen** — ผนังไม้โอ๊ค, ตะกร้าหวาย, พรมปอ
3. **Green plant room** — ชั้นลอย, กระถางดินเผา, ไม้เลื้อย
4. **Moody dark** — ผนังชาร์โคล, โคมทองเหลือง, กรอบรูป, เงาลึก
5. **Color pop** — เหลือง/น้ำเงินจัด, ผ้ากราฟิก, สตูลสี

ทุกแบบเว้น **พื้นที่ว่างเหนือเคาน์เตอร์** ไว้วางโลโก้ / end card

## ผลลัพธ์ 3 แบบ

### A — Style Snap (ตัดสลับตามจังหวะ)
กล้องล็อกนิ่ง ดันเข้าช้ามาก, background ตัดเปลี่ยนแบบ snap cut + แฟลชแสงบางๆ ทุก 1 วิ
- job: `4013473a-f680-4e11-94b3-29e5184e8c9a`
- https://d8j0ntlcm91z4.cloudfront.net/user_2wLnuD5kGfy43k7VfCCwovSE0aN/hf_20260825_111650_4013473a-f680-4e11-94b3-29e5184e8c9a.mp4

### B — Room Builds Itself (สต็อปโมชัน ห้องประกอบตัวเอง)
เฟอร์นิเจอร์/ของตกแต่งบินเข้าเฟรมมาประกอบเป็นห้องทีละเลเยอร์ 5 ระลอก จบด้วยถอยกล้องเผยห้องที่เสร็จ
- job: `1840ec2f-31d6-41c5-9889-167198ad5668`
- https://d8j0ntlcm91z4.cloudfront.net/user_2wLnuD5kGfy43k7VfCCwovSE0aN/hf_20260825_111650_1840ec2f-31d6-41c5-9889-167198ad5668.mp4

### C — Orbit Reveal (กล้องโค้ง + แสงกวาดเปลี่ยนห้อง)
กล้องโค้งรอบเคาน์เตอร์ ใช้แสงกวาดหน้าเฟรมเป็นตัวเปลี่ยนสไตล์แบบ seamless จบล็อกหน้าตรงบนผนังโล่ง
- job: `bcf13c11-afc2-4a57-a183-471191cb5158`
- https://d8j0ntlcm91z4.cloudfront.net/user_2wLnuD5kGfy43k7VfCCwovSE0aN/hf_20260825_111650_bcf13c11-afc2-4a57-a183-471191cb5158.mp4

## Prompt ที่ใช้

เก็บไว้ที่ [`prompts.md`](./prompts.md) — ใช้ซ้ำ / แก้ต่อได้เลย

## หมายเหตุการ reproduce

- ต้องอัปโหลดภาพเข้า Higgsfield ก่อน (`media_upload` → PUT bytes → `media_confirm`) แล้วส่ง `media_id` เป็น `start_image`
- ถ้าเจอ error `Preset "..." was recommended instead of submitting a job` ให้ส่งซ้ำพร้อม `declined_preset_id` ตามที่ error บอก
