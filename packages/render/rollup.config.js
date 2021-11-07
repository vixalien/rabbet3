import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'templates/lnks/page.js',
  output: {
    dir: 'dist',
    format: 'cjs'
  },
  plugins: [commonjs()]
};