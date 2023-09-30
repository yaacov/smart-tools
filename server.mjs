/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
import express, { static as staticMiddleware } from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Serve 'public' directory at '/'
app.use('/', staticMiddleware(join(__dirname, 'public')));

// Serve 'src' directory at '/js/src/'
app.use('/js/src', staticMiddleware(join(__dirname, 'src')));

// Serve 'examples' directory at '/js/examples/'
app.use('/js/examples', staticMiddleware(join(__dirname, 'examples')));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log('Press Ctrl-C to stop');
});
