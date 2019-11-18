const webpack = require('webpack');
const dts = require('dts-bundle');
const fs = require('fs');
const glob = require('glob');

function hasArgument(name) {
  for (const it of process.argv) {
    if (it === `-${name}`) {
      return true;
    }
  }
  return false;
}

function tryRemoveDir(dir) {
  fs.rmdir(dir, (err) => {
    if (err === null) {
      tryRemoveDir(dir.substr(0, dir.lastIndexOf('/')));
    }
  });
}

module.exports = config => {
  // 启用静态文件支持
  if (config.module && config.module.rules) {
    config.module.rules.push({
      test: /\.(png|svg|jpg|gif|eot|woff|ttf)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 20000,
        }
      }]
    });
  }
  // 不生成bundle分析
  if (config.mode === 'production' && hasArgument('o')) {
    for (const k in config.plugins) {
      const it = config.plugins[k];
      if (typeof(it) === 'object' && it.__proto__.constructor.name === 'BundleAnalyzerPlugin') {
        config.plugins.splice(k, 1);
        break;
      }
    }
  }
  // 聚合d.ts文件
  if (config.mode === 'production' && config.plugins) {
    config.plugins.push({
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('BundleDTS', () => {
          dts.bundle({
            name: "react-markdown-editor-lite",
            main: "lib/index.d.ts",
            baseDir: "lib",
            out: "temp_dts.tmp",
            newLine: "\n",
            indent: "  ",
            verbose: true,
            outputAsModuleFolder: true
          });
          console.log('bundle dts finished');
          // 移除其他d.ts文件
          glob("./lib/**/*.d.ts", null, function (er, files) {
            files.forEach(it => {
              fs.unlinkSync(it);
              tryRemoveDir(it.substr(0, it.lastIndexOf('/')));
            });
            // 改名回来
            fs.renameSync('./lib/temp_dts.tmp', './lib/index.d.ts');
            // 移除掉文件中的less引用
            let content = fs.readFileSync('./lib/index.d.ts', {
              encoding: "utf8"
            });
            content = content.replace(/(\s*)import '(.*?)\.less';/gi, "");
            fs.writeFileSync('./lib/index.d.ts', content, {
              encoding: "utf8"
            });
          });
        });
      }
    })
  }
  return config;
};
