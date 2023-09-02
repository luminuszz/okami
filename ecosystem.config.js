module.exports = [
  {
    script: './dist/src/main.js',
    name: 'okami-api',
    exec_mode: 'cluster',
    instances: 2,
  },
];
