module.exports = {
    chainWebpack: config => {
        config.output.filename(`[name].[hash].js`);
        config.output.chunkFilename(`[id].[chunkhash:8].js`);
        config.plugins.delete('prefetch');
    },
    publicPath: undefined,
    lintOnSave: false,
    devServer: {
        port: 9000,
        proxy: {
            '^/api': {
                target: 'http://localhost:9090/api'
            }
        }
    },

    outputDir: undefined,
    assetsDir: undefined,
    runtimeCompiler: undefined,
    productionSourceMap: undefined,
    parallel: undefined,
    css: undefined
}
