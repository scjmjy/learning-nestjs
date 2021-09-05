import { Controller, Get, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
// import createVueApp from './server.entry';
// import { renderToString } from '@vue/server-renderer';
// import { Response } from 'express';
// import path from 'path';
// import fs from 'fs';

// const indexTemplate = fs.readFileSync(
//     path.join(__dirname, '/public/html/index.template.html'),
//     'utf-8',
// );
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    @Render('index')
    index() {
        return { message: 'Hello World!' };
    }
    // @Get('vue-index')
    // async vueIndex(@Res() res: Response) {
    //     const { app } = createVueApp({});
    //     const ctx = {
    //         title: 'NestJS VueJs SSR',
    //         meta: '<meta name="1" content="1"',
    //     };
    //     const content = await renderToString(app, ctx);
    //     const html = indexTemplate
    //         .toString()
    //         .replace('<div id="app">', `<div id="app">${content}`);

    //     res.setHeader('Content-Type', 'text/html');
    //     res.send(html);
    // }
}
