const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
    const { month } = req.query;
    const filePath = path.join(process.cwd(), 'public', 'books', `${month}.txt`);

    if (req.method === 'GET') {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.status(500).json({ error: 'Error reading file' });
            } else {
                res.status(200).send(data);
            }
        });
    } else if (req.method === 'POST') {
        const newBook = `${req.body.name},${req.body.author},${req.body.year},${req.body.category},${req.body.rating}\n`;
        fs.appendFile(filePath, newBook, err => {
            if (err) {
                res.status(500).json({ error: 'Error writing to file' });
            } else {
                res.status(200).json({ message: 'File updated successfully' });
            }
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
