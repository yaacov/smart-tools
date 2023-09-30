/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
import express, { static as staticMiddleware } from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

function asmMiddleware(req, res, next) {
  const filePath = join(__dirname, 'examples', req.path.replace(/\.js$/, '.asm'));
  try {
    const fileContent = readFileSync(filePath, 'utf8');
    res.type('application/javascript').send(fileContent);
  } catch (error) {
    if (error.code === 'ENOENT') {
      next();
    } else {
      next(error);
    }
  }
}

// Serve 'public' directory at '/'
app.use('/', staticMiddleware(join(__dirname, 'public')));

// Serve 'src' directory at '/js/src/'
app.use('/js/src', staticMiddleware(join(__dirname, 'src')));

// Serve 'examples' directory at '/js/examples/'
app.use('/js/examples', asmMiddleware);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log('Press Ctrl-C to stop');
});
