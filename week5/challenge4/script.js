// เลือกทุกลิงก์ที่อยู่ใน <nav>
const navLinks = document.querySelectorAll("nav a");

// ใส่ event listener ให้แต่ละลิงก์
navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
        event.preventDefault(); // ป้องกันการกระโดดไปที่ #
        alert(this.textContent); // ใช้ this เพื่ออ้างอิงข้อความของลิงก์ที่ถูกคลิก
    });
});