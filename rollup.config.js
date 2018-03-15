'use strict';

module.exports = {
    input: './src/main.js',
    
    output: {
        file: './hud/dist/bundle.js',
        format: 'iife',
        name: 'hud',
        sourcemap: true,
        banner: '/* eslint-disable */'
    },

    plugins: [
        require('rollup-plugin-buble')()
    ]
};