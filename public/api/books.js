const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
    const bookDir = path.join(process.cwd(), 'public', 'books');

    if (req.method === 'GET') {
        fs.readdir(bookDir, (err, files) => {
            if (err) {
                res.status(500).json({ error: 'Error reading directory' });
                return;
            }

            let books = [];
            let fileReadPromises = files.map(file => {
                return new Promise((resolve, reject) => {
                    fs.readFile(path.join(bookDir, file), 'utf8', (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    });
                });
            });

            Promise.all(fileReadPromises)
                .then(contents => {
                    contents.forEach(content => {
                        books = books.concat(content.split('\n').filter(row => row.trim() !== ''));
                    });
                    books = Array.from(new Set(books));
                    res.status(200).send(books.join('\n'));
                })
                .catch(err => {
                    res.status(500).json({ error: 'Error reading files' });
                });
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
