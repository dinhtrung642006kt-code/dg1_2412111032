const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data', 'students.json');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Câu C1: GET /
app.get('/', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {

            return res.status(500).send('Lỗi đọc dữ liệu sinh viên');
        }
        let students = [];
        try {
            students = JSON.parse(data || '[]');
        } catch (e) {
            students = [];


        }
        
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
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
