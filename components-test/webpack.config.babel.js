"use strict";

/**
 * To learn more about how to use Easy Webpack
 * Take a look at the README here: https://github.com/easy-webpack/core
 **/
const easyWebpack = require('@easy-webpack/core');
const generateConfig = easyWebpack.default;
const get = easyWebpack.get;
const path = require('path');
const fs = require('fs');
// get env parameters
const ENV = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() || 'development';
const CDN_URL = process.env.CDN_URL || '';
const COMMIT_HASH = process.env.COMMIT_HASH || '[chunkhash]';

const AureliaWebpackPlugin = require('aurelia-webpack-plugin');
const babelCore = require("babel-core");
let clearRequire = require('webpack-clear-require');
let CopyWebpackPlugin = require('copy-webpack-plugin');
let config;

var webpackLib = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var StringReplacePlugin = require("string-replace-webpack-plugin");

// basic configuration:
const title = 'Overpass';
const baseUrl = '/';
const rootDir = path.resolve();
const srcDir = path.resolve('src');
const outDir = path.resolve('dist');

const coreBundles = {
    external: ['reflect-metadata'],
    bootstrap: [
        'aurelia-bootstrapper-webpack',
        'aurelia-polyfills',
        'aurelia-pal',
        'aurelia-pal-browser',
        'regenerator-runtime',
        'aurelia-ui-virtualization',
        'bluebird',
    ],
    // these will be included in the 'aurelia' bundle (except for the above bootstrap packages)
    aurelia: [
        'aurelia-bootstrapper-webpack',
        'aurelia-binding',
        'aurelia-dependency-injection',
        'aurelia-event-aggregator',
        'aurelia-framework',
        'aurelia-history',
        'aurelia-history-browser',
        'aurelia-loader',
        'aurelia-loader-webpack',
        'aurelia-pal',
        'aurelia-pal-browser',
        'aurelia-path',
        'aurelia-polyfills',
        'aurelia-route-recognizer',
        'aurelia-router',
        'aurelia-task-queue',
        'aurelia-templating',
        'aurelia-templating-binding',
        'aurelia-templating-router',
        'aurelia-templating-resources',
        'aurelia-dialog',
        'aurelia-validatejs',
        'aurelia-validation',
    ]
};

var babelSettings = {
    "presets": ["es2015", "stage-1"],
    "babelrc": false,
    "compact": false,
    "plugins": [
        "syntax-decorators",
        //"transform-decorators"
        "transform-decorators-legacy",
        "transform-class-properties",
        "transform-es2015-modules-umd",
        //"name-amd-module"
    ]
};

var babelSettings2 = {
    "presets": ["es2015", "stage-1"],
    "babelrc": false,
    "compact": false,
    "plugins": [
        "transform-class-properties",
    ]
};


var assetsLoader = "url-loader?limit=1000";
if ("production" === ENV) {
    assetsLoader = 'file-loader?emitFile=false&name='+CDN_URL+'[folder]/[name].[ext]'
}
console.log(assetsLoader);
const baseConfig = {
    entry: {
        'extern': coreBundles.external,
        'app': [/* this is filled by the aurelia-webpack-plugin */],
        'aurelia-bootstrap': coreBundles.bootstrap,
        'aurelia': coreBundles.aurelia.filter(pkg => coreBundles.bootstrap.indexOf(pkg) === -1 && coreBundles.external.indexOf(pkg) === -1)
    },
    resolve: {
        root: path.resolve(__dirname, 'src'),
        alias: {
            services: "services"
        },
        fallback: path.join(__dirname, "node_modules")
    },
    resolveLoader: {
        fallback: path.join(__dirname, "node_modules")
    },
    plugins: [
        new webpackLib.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new CopyWebpackPlugin([
            // Copy directory contents to {output}/ 
            {from: 'dist-global', to: 'dist-global'},
            {from: 'lib', to: 'lib'}

        ], {

            // By default, we only copy modified files during 
            // a watch or webpack-dev-server build. Setting this 
            // to `true` copies all files. 
            copyUnmodified: true
        }),
        function()
        {
            this.plugin("done", function(stats)
            {
                if ("production" === ENV) {
                    if (stats.compilation.errors && stats.compilation.errors.length) {
                        // write error log only in production env
                        console.log(stats.compilation.errors);
                        fs.writeFileSync("./error.log", 1);
                        process.exit(1);
                    }
                }
            });
        },
        new ExtractTextPlugin("styles.css")
    ],
    noParse: [
        /(\/dist\/)/,
    ],
    devtool: "#inline-source-map",
    module: {
        loaders: [
            {test: /\.json$/, loader: 'json-loader'},

            {
                test: /\.js?$/, loader: 'babel',
                query: babelSettings,
                exclude: /(node_modules|bower_components|workers|lib)/,
                include: [
                    srcDir
                ]
            },
            {
                test: /\.js?$/, loader: 'babel',
                query: babelSettings2,
                exclude: [
                    srcDir
                ]
            },
            {
                test: /\.css$/,
                // exclude: /node_modules/,
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: 'css-loader?root=overpass-cdn/assets'
                })
            },
            {
                test: /\.scss$/,
                // exclude: /node_modules/,
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: 'css-loader?root=overpass-cdn/assets!sass-loader'
                })
            },
            {
                test: /\.(png|jpg|otf|svg|ttf|eot|woff)$/,
                loader: assetsLoader
            },
            {test: /\.css?$/, loader: 'raw', include: /aurelia-dialog/}
        ]
    },
    output: {
        path: outDir
    },
    node: {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        "child_process": "empty"
    }
};

// advanced configuration:
switch (ENV) {
    case 'production':
        config = generateConfig(
            baseConfig,

            require('@easy-webpack/config-env-production')
            ({compress: true}),

            require('@easy-webpack/config-aurelia')
            ({root: rootDir, src: srcDir, title: title, baseUrl: baseUrl}),

            require('@easy-webpack/config-babel')(),
            require('@easy-webpack/config-html')(),

/*            require('@easy-webpack/config-css')
            ({filename: 'styles.css', allChunks: true, sourceMap: false}),
*/
            // require('@easy-webpack/config-sass')(),

            // require('@easy-webpack/config-fonts-and-images')(),
            /*require('@easy-webpack/config-global-bluebird')(),*/
            require('@easy-webpack/config-global-jquery')(),

            require('@easy-webpack/config-global-regenerator')(),
            require('@easy-webpack/config-generate-index-html')
            ({minify: true}),

            require('@easy-webpack/config-copy-files')
            ({patterns: [{from: 'favicon.ico', to: 'favicon.ico'}]}),

            require('@easy-webpack/config-common-chunks-simple')
            ({appChunkName: 'app', firstChunk: 'aurelia-bootstrap'}),

            require('@easy-webpack/config-uglify')
            ()
        );

        config.output.filename = '[name].'+ COMMIT_HASH +'.bundle.js';
        config.output.sourceMapFilename = '[name].'+ COMMIT_HASH +'.bundle.map';
        config.output.chunkFilename = '[id].'+ COMMIT_HASH +'.chunk.js';

        break;

    case 'test':
        config = generateConfig(
            baseConfig,

            require('@easy-webpack/config-env-development')
            ({devtool: 'inline-source-map'}),

            require('@easy-webpack/config-aurelia')
            ({root: rootDir, src: srcDir, title: title, baseUrl: baseUrl}),

            require('@easy-webpack/config-babel')(),
            require('@easy-webpack/config-html')(),

            /*require('@easy-webpack/config-css')
            ({filename: 'styles.css', allChunks: true, sourceMap: false}),
*/
            // require('@easy-webpack/config-fonts-and-images')(),
            require('@easy-webpack/config-global-bluebird')(),
            require('@easy-webpack/config-global-jquery')(),
            require('@easy-webpack/config-global-regenerator')(),
            require('@easy-webpack/config-generate-index-html')(),

            require('@easy-webpack/config-test-coverage-istanbul')()
        );
        break;

    default:
    case 'development':
        process.env.NODE_ENV = 'development';
        config = generateConfig(
            baseConfig,

            require('@easy-webpack/config-env-development')(),

            require('@easy-webpack/config-aurelia')
            ({root: rootDir, src: srcDir, title: title, baseUrl: baseUrl}),

            require('@easy-webpack/config-babel')(),
            require('@easy-webpack/config-html')(),

            /*require('@easy-webpack/config-css')
            ({filename: 'styles.css', allChunks: true, sourceMap: false}),
U*/
            // require('@easy-webpack/config-fonts-and-images')(),
            //require('@easy-webpack/config-global-bluebird')(),
            require('@easy-webpack/config-global-jquery')(),
            // require('@easy-webpack/config-sass')(),
            require('@easy-webpack/config-global-regenerator')(),
            require('@easy-webpack/config-generate-index-html')
            ({minify: false}),

            require('@easy-webpack/config-copy-files')
            ({patterns: [{from: 'favicon.ico', to: 'favicon.ico'}]}),

            require('@easy-webpack/config-common-chunks-simple')
            ({appChunkName: 'app', firstChunk: 'aurelia-bootstrap'})
        );
        break;
}

module.exports = config;
