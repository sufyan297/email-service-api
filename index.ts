import Elysia from "elysia";
import { Router } from "./src/routes";
import { logger } from "@tqman/nice-logger";
import swagger from "@elysiajs/swagger";
import jwt from "@elysiajs/jwt";
import bearer from '@elysiajs/bearer';
import { cors } from '@elysiajs/cors'
import DataSource from "./libs/Datasource";

const app = new Elysia()
    .use(cors({
        origin: '*',
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
    }))
    .use(bearer())
    .use(jwt({
        secret: process.env.TOKEN_SECRET ?? 'secret',
        exp: Math.floor(Date.now() / 1000) + (84600 * 30)
    }));

export type AppInstance = typeof app;



app
    .use(logger({ mode: 'live', withTimestamp: true }))
    .use(swagger({
        path: '/swagger',
        documentation: {
            info: { title: 'Email Service API', description: 'API Documentation For Email Service', version: '1' }
        }
    }));


Router(app);

const PORT = process.env.PORT || 3100;

app.listen(PORT, async () => {
    await DataSource.init();
    console.log(
        `Server is running at ${app.server?.hostname}:${app.server?.port}`
    )
});
