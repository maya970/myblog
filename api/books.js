const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
    const filePath = path.join(process.cwd(), 'public', 'books.txt');

    if (req.method === 'GET') {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.status(500).json({ error: 'Error reading file' });
            } else {
                res.status(200).send(data);
            }
        });
    } else if (req.method === 'POST') {
        let newBook = `${req.body.name},${req.body.author},${req.body.year},${req.body.category},${req.body.rating}\n`;

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err && err.code !== 'ENOENT') {
                res.status(500).json({ error: 'Error reading file' });
                return;
            }

            let books = data ? data.split('\n') : [];
            if (!books.includes(newBook.trim())) {
                books.push(newBook.trim());
                fs.writeFile(filePath, books.join('\n'), 'utf8', (err) => {
                    if (err) {
                        res.status(500).json({ error: 'Error writing file' });
                    } else {
                        res.status(200).json({ message: 'Book added successfully' });
                    }
                });
            } else {
                res.status(400).json({ error: 'Book already exists' });
            }
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
