export const profile = {
  nickname: { en: "Pun", th: "ปุณณ์" },
  legalName: { en: "Theerased Unta", th: "ธีระเศรษฐ์ อุ่นต๊ะ" },
  location: "Bangkok",
  email: "hello@example.com",
  social: {
    github: "https://github.com/",
    instagram: "https://instagram.com/",
  },
  portraitPlaceholder: true,
  codeSkills: {
    en: [
      "HTML, CSS, JavaScript",
      "React, Next.js",
      "Currently learning: 3D and creative coding",
      "CubeSat software threads & CTF practice",
    ],
    th: [
      "HTML, CSS, JavaScript",
      "React, Next.js",
      "กำลังเรียน: 3D และ creative coding",
      "สายซอฟต์แวร์ CubeSat และการซ้อม CTF",
    ],
  },
  photoSkills: {
    en: [
      "Street, portrait, travel",
      "Lightroom edits",
      "Currently learning: film and cinematic video",
      "AstroShutter night / sky frames",
    ],
    th: [
      "สตรีท พอร์ตเทรต ท่องเที่ยว",
      "แต่งใน Lightroom",
      "กำลังเรียน: ฟิล์มและวิดีโอแนว cinematic",
      "เฟรมกลางคืน / ท้องฟ้าจาก AstroShutter",
    ],
  },
  timeline: [
    {
      year: "2022",
      en: "Started coding — small tools I wished existed.",
      th: "เริ่มเขียนโค้ด — สร้างเครื่องมือเล็ก ๆ ที่อยากมี",
    },
    {
      year: "2023",
      en: "Picked up a camera; street and golden-hour walks.",
      th: "เริ่มถือกล้อง — เดินถ่ายสตรีทและ golden hour",
    },
    {
      year: "2024",
      en: "Joined CubeSat work and started CTF practice.",
      th: "ร่วมงาน CubeSat และเริ่มซ้อม CTF",
    },
    {
      year: "2025",
      en: "AstroShutter experiments — longer exposures, quieter nights.",
      th: "ทดลอง AstroShutter — เปิดหน้ากล้องยาวขึ้น คืนที่เงียบขึ้น",
    },
    {
      year: "2026",
      en: "Building this portfolio: code by day, light by dusk.",
      th: "สร้างพอร์ตโฟลิโอนี้: โค้ดตอนกลางวัน แสงตอนเย็น",
    },
  ],
  funFacts: [
    {
      en: "Debugs with snacks nearby",
      th: "ดีบักต้องมีของกินข้าง ๆ",
      rotate: -4,
    },
    {
      en: "Chases Bangkok golden hour",
      th: "ไล่ตาม golden hour กรุงเทพฯ",
      rotate: 3,
    },
    {
      en: "CTF flags > sleep sometimes",
      th: "บางที CTF สำคัญกว่านอน",
      rotate: -2,
    },
  ],
} as const;
