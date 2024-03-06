module.exports = {
    // ...
    resolve: {
        fallback: {
            util: require.resolve('util/'),
            Buffer: require.resolve('buffer/'),
        },
    },
    // ...
};