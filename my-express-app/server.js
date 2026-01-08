// นำเข้า Express
const express = require('express');

// สร้าง Application
const app = express();

// กำหนด Port
const PORT = 3000;

// สร้าง Route แรก
app.get('/', (req, res) => {
  res.send('Hello World from Express! 🚀');
});

// เริ่ม Server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

