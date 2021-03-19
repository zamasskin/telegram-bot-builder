import fs from 'fs-extra';
import path from 'path';
import {uploadPath, rootPath} from './settings';

async function start() {
  await fs.remove(path.resolve(uploadPath, 'assert'));
  await fs.copy(
    path.resolve(rootPath, 'assert'),
    path.resolve(uploadPath, 'assert')
  );
}

start();
