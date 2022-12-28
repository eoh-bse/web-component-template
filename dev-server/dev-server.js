import express from "express";
import path from "path";

const app = express();
const port = 3000;
const basePath = "build";

const getFile = fileName => path.resolve(path.join(basePath, fileName));

app.use(express.static(basePath));

app.get("/", (req, res) => {
  res.sendFile(getFile("index.html"));
});

app.get("/:path", (req, res) => {
  res.sendFile(getFile(`${req.path}.html`));
});

app.listen(port, () => {
  console.info(`Dev Server is running at port ${port}`);
});
