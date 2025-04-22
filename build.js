const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Terser = require('terser');
const CleanCSS = require('clean-css');
const htmlMinifier = require('html-minifier').minify;

function generateHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(fileBuffer).digest('hex').slice(0, 8);
}

async function minifyAndCopyAssets() {
  try {
    const publicPath = path.join(__dirname, 'public');
    const distPath = path.join(__dirname, 'dist');
    const indexPath = path.join(publicPath, 'index.html');
    const jsPath = path.join(publicPath, 'index.js');
    const cssPath = path.join(publicPath, 'styles.css');
    const dataPath = path.join(publicPath, 'assets', 'data.json');
    const dataMin1dPath = path.join(publicPath, 'assets', 'dataMin1d.json');

    const jsHash = generateHash(jsPath);
    const cssHash = generateHash(cssPath);
    const dataHash = generateHash(dataPath);
    const dataMin1dHash = generateHash(dataMin1dPath);

    const newJsName = `index.${jsHash}.js`;
    const newCssName = `styles.${cssHash}.css`;
    const newDataName = `data.${dataHash}.json`;
    const dataMin1dName = `data.${dataMin1dHash}.json`;

    if (fs.existsSync(distPath)) fs.rmSync(distPath, { recursive: true });
    fs.mkdirSync(distPath, { recursive: true });

    fs.copyFileSync(dataPath, path.join(distPath, newDataName));
    fs.copyFileSync(dataMin1dPath, path.join(distPath, dataMin1dName));

    let jsOriginal = fs.readFileSync(jsPath, 'utf-8');
    jsOriginal = jsOriginal.replace('/assets/data.json', `/${newDataName}`)
                           .replace('/assets/dataMin1d.json', `/${dataMin1dName}`);

    const jsMinified = await Terser.minify(jsOriginal);
    fs.writeFileSync(path.join(distPath, newJsName), jsMinified.code);

    const cssOriginal = fs.readFileSync(cssPath, 'utf-8');
    const cssMinified = new CleanCSS().minify(cssOriginal).styles;
    fs.writeFileSync(path.join(distPath, newCssName), cssMinified);

    let htmlContent = fs.readFileSync(indexPath, 'utf-8')
      .replace('index.js', newJsName)
      .replace('styles.css', newCssName)
      .replace('./assets/', '')
      .replace('/assets/', '')
      .replace('assets/', '');

    htmlContent = htmlMinifier(htmlContent, { collapseWhitespace: true, removeComments: true });
    fs.writeFileSync(path.join(distPath, 'index.html'), htmlContent);

    fs.copyFileSync(path.join(publicPath, 'assets', 'icon.png'), path.join(distPath, 'icon.png'));
    fs.copyFileSync(path.join(publicPath, 'assets', 'menger.mp3'), path.join(distPath, 'menger.mp3'));

    console.log(`✔ Archivos minificados y reemplazados: ${newJsName}, ${newCssName}, ${newDataName}, ${dataMin1dName}`);

  } catch (error) {
    console.error('Error durante el proceso de minificación y copia de archivos:', error);
  }
}

minifyAndCopyAssets();
