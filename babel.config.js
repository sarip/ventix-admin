module.exports = {
    presets: [
        'next/babel',
    ],
    plugins: [],
    compact: false, // Prevents Babel from applying compact mode
    overrides: [
        {
            test: /\.js$/,
            compact: false, // Ensures that large files are not compacted
        },
    ],
};
