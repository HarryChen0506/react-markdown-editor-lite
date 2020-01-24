export default function(defaultConfig: any, ...configs: any[]) {
  const res = { ...defaultConfig };
  configs.forEach(conf => {
    // only object
    if (typeof conf !== 'object') {
      return;
    }
    Object.entries(conf).forEach(it => {
      if (it[0] in res) {
        res[it[0]] = it[1];
      }
    });
  });
  return res;
}
