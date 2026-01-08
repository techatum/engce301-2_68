// เลือกทุกลิงก์ที่อยู่ใน <nav>
const navLinks = document.querySelectorAll("nav a");

// ใส่ event listener ให้แต่ละลิงก์
navLinks.forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault(); // ป้องกันการกระโดดไปที่ #
    alert("clicked!");
  });
});