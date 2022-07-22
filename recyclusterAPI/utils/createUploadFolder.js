const fs = require('fs');

// Create uploads file if not exists
if (!fs.existsSync('./public/uploads/')) {
    fs.mkdirSync('./public/uploads/');
    console.log('Creating uploads folder...');
}