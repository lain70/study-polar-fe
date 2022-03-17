module.exports = {
    chainWebpack: config => {
        config.output.filename(`[name].[hash].js`);
        config.output.chunkFilename(`[id].[chunkhash:8].js`);
        config.plugins.delete('prefetch');
    },
    publicPath: undefined,
    lintOnSave: false,
    devServer: {
        proxy: {
            '^/api': {
                target: 'http://localhost:9090/api'
            }
        },
        // port: 9091
    },

    outputDir: undefined,
    assetsDir: undefined,
    runtimeCompiler: undefined,
    productionSourceMap: undefined,
    parallel: undefined,
    css: undefined
}