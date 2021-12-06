import { mapOrForMaybe } from 'option-t/lib/Maybe/mapOr';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';

let GIT_REVISION = mapOrForMaybe(process.env.GIT_REVISION, 'unknown', String);
const BUILD_DATE = mapOrForMaybe(process.env.BUILD_DATE, 'unknown', String);

/* eslint-disable no-undef */
if (bazel_stamp_file) {
  const stamp = require('fs')
    .readFileSync(bazel_stamp_file, { encoding: 'utf-8' })
    .split('\n')
    .find((s) => s.startsWith('GIT_REVISION'));
  if (stamp) {
    GIT_REVISION = stamp.split(' ')[1].trim();
  }
}
/* eslint-enable no-undef */

console.log(`
=========== rollup configuration vars ============
GIT_REVISION: ${GIT_REVISION}
BUILD_DATE: ${BUILD_DATE}
======================================
`);

export default {
  plugins: [
    resolve({
      mainFields: ['es2015', 'module', 'jsnext:main', 'main'],
      preferBuiltins: false,
      browser: true,
      // rollup does not have 'extensions' option,
      // so we need to specify this option at here to import mjs file.
      extensions: ['.mjs', '.js', '.jsx'],
    }),
    commonjs(),
    replace({
      exclude: ['node_modules/**'],
      delimiters: ['', ''],
      values: {
        'process.env.GIT_REVISION': JSON.stringify(GIT_REVISION),
        'process.env.BUILD_DATE': JSON.stringify(BUILD_DATE),
      },
    }),
  ],
};
