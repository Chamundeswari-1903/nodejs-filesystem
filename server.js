const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');


const outputFolder = "./Output";


if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

const PORT = 3000;

app.use(express.json());

// Define routes

app.listen(PORT, () => {
  console.log(`Server is running: http://localhost:${PORT}`);
});


app.post("/createfile", (req, res) => {
  const currentTime = new Date();
  const year = currentTime.getFullYear().toString();
  const month = (currentTime.getMonth() + 1).toString().padStart(2, '0');
  const date = currentTime.getDate().toString().padStart(2, '0');
  const hrs = currentTime.getHours().toString().padStart(2, '0');
  const mins = currentTime.getMinutes().toString().padStart(2, '0');
  const secs = currentTime.getSeconds().toString().padStart(2, '0');

  const dateTimeForFileName = `${year}-${month}-${date}-${hrs}-${mins}-${secs}.txt`;

  const filePath = path.join(outputFolder, dateTimeForFileName);

  fs.writeFile(filePath, currentTime.toISOString(), (err) => {
    if (err) {
      res.status(500).send(`Error creating file: ${err}`);
      return;
    }

    res.send(`File created successfully at: ${filePath}`);
  });
});


app.get('/getfiles', (req, res) => {
  fs.readdir(outputFolder, (err, files) => {
    if (err) {
      res.status(500).send(`Error occurred while reading files: ${err}`);
      return;
    }
    
    console.log("List of files:\n", files);
    
    const textFiles = files.filter((file) => path.extname(file) === ".txt");
    
    res.json(textFiles);
  });
});
