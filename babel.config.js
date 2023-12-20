module.exports = (api) => {
    api.cache.using(() => process.env.NODE_ENV);
    const isDev = process.env.NODE_ENV.toLocaleLowerCase().includes('dev');

    return {
        presets: [
            "@babel/preset-env",
            "@babel/preset-react",
            "@babel/preset-typescript"
        ],
        ...{
            plugins: [
                "macros",
                [
                    "babel-plugin-styled-components",
                    {
                        transpileTemplateLiterals: false,
                        ssr: false
                    }
                ],
                "@babel/plugin-proposal-class-properties"
            ].concat(
                isDev ? [
                    [
                        "react-refresh/babel",
                        {
                            skipEnvCheck: true
                        }
                    ]
                ] : []
            )
        }
    };
};
