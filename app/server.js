const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data', 'students.json');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Hàm hỗ trợ đọc dữ liệu sinh viên
const getStudentsData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data || '[]');
    } catch (e) {
        return [];
    }
};

// Câu C1: GET /
app.get('/', (req, res) => {
    const students = getStudentsData();
    let rows = students.map(s => `
        <tr>
            <td>${s.id}</td>
            <td>${s.name}</td>
            <td>${s.class}</td>
        </tr>
    `).join('');

    const html = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <title>DG1 – Đinh Trung – 2412111032</title>
        <link rel="stylesheet" href="/style.css">
    </head>
    <body>
        <h1>DG1 – Đinh Trung – 2412111032</h1>
        <table>
            <thead>
                <tr>
                    <th>MSSV</th>
                    <th>Họ và Tên</th>
                    <th>Lớp</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
    </body>
    </html>
    `;
    res.send(html);
});

// ================= CÂU C2 =================

// 1. GET /api/health
app.get('/api/health', (req, res) => {
    res.json({
        status: "ok",
        student: "2412111032"
    });
});

// 2. GET /api/students (hỗ trợ lọc ?lop=)
app.get('/api/students', (req, res) => {
    let students = getStudentsData();
    const { lop } = req.query;

    if (lop) {
        students = students.filter(s => s.class.toLowerCase() === lop.toLowerCase());
    }

    res.json(students);
});

// 3. GET /api/students/:id (trả về 1 SV hoặc 404)
app.get('/api/students/:id', (req, res) => {
    const students = getStudentsData();
    const student = students.find(s => s.id === req.params.id);

    if (!student) {
        return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
});

// Khởi chạy Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
