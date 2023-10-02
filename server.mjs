// Disabling some ESLint rules for this file
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */

import express, { static as staticMiddleware } from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { promises as fsPromises } from 'fs';

const PORT = 3000;

// Getting the directory name and file name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Defining paths to various directories
const publicDir = join(__dirname, 'public');
const srcDir = join(__dirname, 'src');
const examplesDir = join(__dirname, 'examples');

const app = express();

// Setting up middleware to serve static files from various directories
app.use('/', staticMiddleware(publicDir));
app.use('/js/src', staticMiddleware(srcDir));
app.use('/js/examples', staticMiddleware(examplesDir));

// Function to get all files with .asm extension in a specified directory
const getAsmFiles = async (dir) => {
  const files = await fsPromises.readdir(dir);
  return files.filter((file) => file.endsWith('.asm'));
};

// Defining a route to serve a text file containing the names of all .asm files in the examples directory
app.get('/js/examples/examples.txt', async (req, res) => {
  try {
    const asmFiles = await getAsmFiles(examplesDir);
    res.type('text/plain');
    res.send(asmFiles.join('\n'));
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log('Press Ctrl-C to stop');
});
