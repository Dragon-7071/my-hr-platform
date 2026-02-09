const express = require('express');
const path = require('path');
const app = express();

// Порт Play2go берет из системы, если его нет — ставим 3000
const PORT = process.env.PORT || 3000;

// Указываем, что готовые файлы будут лежать в папке dist
app.use(express.static(path.join(__dirname, 'dist')));

// Все запросы перенаправляем на index.html внутри dist
app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});