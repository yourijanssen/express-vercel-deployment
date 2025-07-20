const express = require("express");
const app = express();

const port = process.env.PORT || 8080;

const sampleData = {
  message: 'Welcome to my Express app on Vercel!',
  data: [
    { id: 1, name: 'John Doe', role: 'Developer' },
    { id: 2, name: 'Jane Smith', role: 'Designer' }
  ]
};

app.get("/", (req, res) => {
  res.send("Subscribe to Arpan Neupane's channel");
});

app.get("/testdata", (req, res) => {
  res.json(sampleData);
});

app.listen(port, () => {
  `Server started on port ${port}`;
});
