const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
    const filePath = path.join(process.cwd(), 'public', 'comments.txt');

    if (req.method === 'POST') {
        let bookName = req.body.bookName;

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.status(500).json({ error: 'Error reading file' });
            } else {
                let comments = data.split('\n').filter(comment => comment.startsWith(bookName));
                res.status(200).send(comments.join('\n'));
            }
        });
    } else if (req.method === 'GET') {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.status(500).json({ error: 'Error reading file' });
            } else {
                res.status(200).send(data);
            }
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
