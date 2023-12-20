const rules = [
    {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
    },
    {
        test: /\.(ts|tsx)?$/,
        loader: "babel-loader",
        include: /src/,
        exclude: /node_modules/
    },
    {
        test: /\.svg$/,
        loader: "@svgr/webpack"
    },
    {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2|jpeg)$/,
        loader: "url-loader",
        options: {
            limit: 10000,
            // name: 'assets/images/[name]-[sha512:hash:base64:7].[ext]',
            name: "[name].[ext]",
            outputPath: "images"
        }
    },
    {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto"
    },
    {
        test: /\.html$/,
        use: [
            {
                loader: "html-loader",
                options: {
                    minimize: {
                        removeComments: true,
                        collapseWhitespace: false
                    }
                }
            }
        ]
    }
];

module.exports = rules;
