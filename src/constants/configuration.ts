export default () => ({
    ...((window as any).asdidpasd || {}),
    host: (window as any).configuration.host,
    isProduction: !!Number((window as any).configuration.production)
});
