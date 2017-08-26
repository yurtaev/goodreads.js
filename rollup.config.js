import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'

export default {
  moduleName: 'goodreads.js',
  entry: 'src/index.js',
  context: 'window',
  format: 'umd',
  plugins: [
    babel({
      exclude: 'node_modules/**', // only transpile our source code
    }),
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules',
      },
    }),
    commonjs({
      namedExports: {
        'node_modules/xml2js/lib/xml2js.js': ['xml2js'],
        'node_modules/ramda/index.js': Object.keys(require('ramda')),
      },
    }),
  ],
  dest: 'dist/goodreads.js',
  sourceMap: true,
  external: ['ramda', 'xml2js'],
}
