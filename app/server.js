const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data', 'students.json');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const getStudentsData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data || '[]');
    } catch (e) {
        return [];
    }
};

const saveStudentsData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
};

// C1: GET /
app.get('/', (req, res) => {
    const students = getStudentsData();
    let rows = students.map(s => `<tr><td>${s.id}</td><td>${s.name}</td><td>${s.class}</td></tr>`).join('');
    res.send(`<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><title>DG1 – Đinh Trung – 2412111032</title><link rel="stylesheet" href="/style.css"></head><body><h1>DG1 – Đinh Trung – 2412111032</h1><table><thead><tr><th>MSSV</th><th>Họ và Tên</th><th>Lớp</th></tr></thead><tbody>${rows}</tbody></table></body></html>`);
});

// C2: GET APIs
app.get('/api/health', (req, res) => {
    res.json({ status: "ok", student: "2412111032" });
});

app.get('/api/students', (req, res) => {
    let students = getStudentsData();
    const { lop } = req.query;
    if (lop) {
        students = students.filter(s => s.class.toLowerCase() === lop.toLowerCase());
    }
    res.json(students);
});

app.get('/api/students/:id', (req, res) => {
    const students = getStudentsData();
    const student = students.find(s => s.id === req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
});

// C3: POST /api/students
app.post('/api/students', (req, res) => {
    const { name, class: studentClass, diem } = req.body;
    if (!name || (!studentClass && !req.body.class && !req.body.lop) || diem === undefined || diem === null || diem === '') {
        return res.status(400).json({ error: "Thieu truong du lieu bat buoc" });
    }
    const score = Number(diem);
    if (isNaN(score) || score < 0 || score > 10) {
        return res.status(400).json({ error: "Diem phai nam trong khoang tu 0 den 10" });
    }
    const students = getStudentsData();
    const newId = "SV" + Date.now().toString().slice(-6);
    const newStudent = {
        id: newId,
        name: name,
        class: studentClass || req.body.class || req.body.lop,
        diem: score
    };
    students.push(newStudent);
    saveStudentsData(students);
    res.status(201).json(newStudent);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
