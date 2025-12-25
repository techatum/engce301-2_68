// เลือกทุก <p> ที่อยู่ใน div#main
const paragraphs = document.querySelectorAll("#main p");

// วนลูปตรวจสอบข้อความ
paragraphs.forEach(p => {
  if (p.textContent.trim() === "Llamas and Chickens!") {
    p.style.color = "red";
  }
});