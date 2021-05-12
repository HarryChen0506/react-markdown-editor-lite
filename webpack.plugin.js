const fs = require('fs');
const path = require('path');

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
        config.entryPoints.set("index", entries[it]);
        config.entryPoints.delete(it);
      }
    }
  });

  onHook('after.build.compile', () => {
    if (fs.existsSync(path.join(__dirname, 'lib'))) {
      fs.renameSync(path.join(__dirname, 'lib'), path.join(__dirname, 'es5'));
    }
    if (fs.existsSync(path.join(__dirname, 'dist'))) {
      fs.renameSync(path.join(__dirname, 'dist'), path.join(__dirname, 'lib'));
    }
    if (fs.existsSync(path.join(__dirname, 'build'))) {
      fs.renameSync(path.join(__dirname, 'build'), path.join(__dirname, 'preview'));
    }
  });
};
