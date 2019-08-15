const webpack = require('webpack');

function hasArgument(name) {
  for (const it of process.argv) {
    if (it === `-${name}`) {
      return true;
    }
  }
  return false;
}

module.exports = config => {
  // 这里可以进行 webpack config 的配置的最终覆盖
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
  config.externals = {
    react: "window.React",
    "react-dom": "window.ReactDOM"
  };
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
  return config;
};
