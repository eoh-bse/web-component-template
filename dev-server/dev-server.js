const express = require('express');
const app = express();
const port = 3000;
const basePath = 'build';

const getFile = fileName => `${basePath}/${fileName}`;

app.use(express.static('build'));

app.get('/', (req, res) => {
  res.sendFile(getFile('index.html'));
});

app.listen(port, () => {
  console.log(`Dev Server is running at port ${port}`);
});
