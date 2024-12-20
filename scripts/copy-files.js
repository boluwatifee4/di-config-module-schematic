const fs = require("fs");
const path = require("path");

const filesToCopy = [
  {
    src: "src/collection.json",
    dest: "dist/di-config-module-schematic/collection.json",
  },
  {
    src: "src/di-config-module-schematic/schema.json",
    dest: "dist/di-config-module-schematic/schema.json",
  },
  {
    src: "src/di-config-module-schematic/files",
    dest: "dist/di-config-module-schematic/files",
  },
];

function copyFolderSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  fs.readdirSync(src).forEach((item) => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    if (fs.lstatSync(srcPath).isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

filesToCopy.forEach(({ src, dest }) => {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  if (fs.lstatSync(src).isDirectory()) {
    copyFolderSync(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
  console.log(`Copied ${src} to ${dest}`);
});

// filesToCopy.forEach(({ src, dest }) => {
//   const destDir = path.dirname(dest);
//   if (!fs.existsSync(destDir)) {
//     fs.mkdirSync(destDir, { recursive: true });
//   }
//   fs.copyFileSync(src, dest);
//   console.log(`Copied ${src} to ${dest}`);
// });
