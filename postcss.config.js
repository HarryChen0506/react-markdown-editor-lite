module.exports = {
  // parser: 'sugarss',
  plugins: [
    require('autoprefixer')({
      "browsers": [
          "defaults",
          "not ie < 11",
          "last 2 versions",
          "> 1%",
          "iOS 7",
          "last 3 iOS versions"
      ]
    })
  ]
}