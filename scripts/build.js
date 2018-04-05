const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const path = require('path');
const rollup = require('rollup');

const cwd = process.cwd();
const { name, moduleName } = require(path.join(cwd, 'package.json'));

const build = opts => {
  rollup
    .rollup({
      input: opts.input || 'src/index.js',
      external: [
        'react',
        'react-proptypes',
        'react-proptype-conditional-require',
        'cuid',
        'classnames'
      ],
      plugins: [
        babel({
          exclude: 'node_modules/**',
          plugins: ['external-helpers']
        }),
        nodeResolve({
          jsnext: true
        }),
        commonjs({
          include: 'node_modules/**',
          namedExports: {
            './node_modules/react/react.js': [
              'cloneElement',
              'createElement',
              'PropTypes',
              'Children',
              'Component'
            ]
          }
        }),
        replace({
          'process.env.NODE_ENV': JSON.stringify('production')
        })
      ]
    })
    .then(bundle => {
      const format = opts.format || 'umd';
      const formatMod = opts.formatMod || format;
      const exports = opts.exports || 'named';
      const dest = `dist/${name}.${formatMod}.js`;

      console.log(dest);
      bundle.write({
        exports,
        format,
        name: moduleName || name,
        file: dest
      });
    })
    .catch(err => {
      console.error(err);
    });
};

build({
  format: 'umd'
});

build({
  format: 'es',
  formatMod: 'esm'
});

build({
  format: 'cjs'
});
