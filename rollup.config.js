import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';

export default {
  /* https://engineering.mixmax.com/blog/rollup-externals */
  external: ['react', 'react-dom'],
  /*
   * Then in the host HTML page:
   *   <script crossorigin="anonymous" src="//cdn.jsdelivr.net/combine/npm/react@16.8.6/umd/react.development.min.js,npm/react-dom@16.8.6/umd/react-dom.development.min.js"></script>
   */
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
  ]
};
