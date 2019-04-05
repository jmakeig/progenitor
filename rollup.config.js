import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
// import babel from 'rollup-plugin-babel';

export default {
  external: ['react', 'react-dom'],
  input: 'experimentation/hier.js',
  output: {
    file: 'experimentation/bundle.js',
    format: 'iife',
    sourcemap: true,

    globals: {
      react: 'React',
      'react-dom': 'ReactDOM'
    }
  },

  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    nodeResolve({
      browser: true,
      jsnext: true,
      main: true
    }),
    commonjs({
      include: 'node_modules/**'
    })
    // babel({
    //   exclude: 'node_modules/**',
    // }),
  ]
};
