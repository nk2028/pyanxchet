import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

export default {
  input: 'src/index.js',
  output: {
    file: 'pyanxchet.min.js',
    format: 'umd',
    name: 'Pyanxchet',
  },
  plugins: [
    commonjs(),
    nodeResolve(),
    terser(),
  ],
};
