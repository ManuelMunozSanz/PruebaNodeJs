const fs = require("node:fs/promises");
const path = require("node:path");
const process = require("node:process");

let folder = process.argv[2] ?? ".";

async function ls(folder) {
  console.log("carpeta: ", folder);

  let files;
  try {
    files = await fs.readdir(folder);
  } catch {
    console.error(`❌ No se pudo leer el directorio ${folder}`);
    process.exit(1);
  }
  const filesInfoPromises = files.map(async (file) => {
    const filePath = path.join(folder, file);
    let stats;
    let isDir = true;
    try {
      stats = await fs.stat(filePath);
      isDir = stats.isDirectory();
    } catch (err) {
      console.error("No se puede leer el archivo", file);
    }

    const name = file;
    const size = stats.size;
    const date = stats.mtime.toISOString().slice(0, 10);
    return ` ${name.padEnd(20)} ${size.toString().padEnd(10)} ${date} `;
  });

  const filesInfo = await Promise.all(filesInfoPromises);
  filesInfo.forEach((fileInfo) => {
    console.log(fileInfo);
  });
}

ls(folder);
