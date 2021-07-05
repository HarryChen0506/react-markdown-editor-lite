const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const folderMap = {
  es: 'esm',
  lib: 'cjs',
  dist: 'lib',
  build: 'preview',
};

module.exports = ({ onGetWebpackConfig, onHook }) => {
  onGetWebpackConfig(config => {
    // 启用静态文件支持
    config.module.rules
      .delete('woff2')
      .delete('ttf')
      .delete('eot')
      .delete('svg');
    config.module
      .rule('url-loader')
      .test(/\.(png|svg|jpg|gif|eot|woff|ttf)$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 20000,
      });

    // UMD 输出，将 output 改为 index
    if (config.output.get('libraryTarget') === 'umd') {
      const entries = config.entryPoints.entries();
      for (const it in entries) {
        config.entryPoints.set('index', entries[it]);
        config.entryPoints.delete(it);
      }
    }
  });

  onHook('before.build.run', () => {
    const folders = [...Object.keys(folderMap), ...Object.values(folderMap)];
    for (const it of folders) {
      fse.rmdirSync(path.join(__dirname, it), { recursive: true });
      console.log('Remove directory ' + it);
    }
  });

  onHook('after.build.compile', () => {
    const toRename = Object.keys(folderMap);
    for (const it of toRename) {
      if (fs.existsSync(path.join(__dirname, it))) {
        fs.renameSync(path.join(__dirname, it), path.join(__dirname, folderMap[it]));
        console.log('Rename ' + it + ' to ' + folderMap[it]);
      }
    }
    const dirs = fs.readdirSync(__dirname);
    console.log('Current files: ', dirs.join(' '));
  });
};
