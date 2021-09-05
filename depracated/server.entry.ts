import createApp from './vue-ssr-app';

export default function (opts: any) {
    const { app } = createApp(opts);

    return {
        app,
    };
}
