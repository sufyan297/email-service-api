import { DataSourceOptions, createConnection } from 'typeorm';
import path from 'path';

export default class DataSource {

    private static datasource : DataSourceOptions = {
        type: 'mysql',
        host: process.env.DB_HOST,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT) ?? 3306,
        database: process.env.DB_DATABASE_NAME,
        logging: true,
        entities: [path.join(__dirname, '../src/models/**/*.{ts,js}')],
    };

    static async init() {
        return new Promise((resolve, reject) => {
            createConnection(this.datasource)
                .then((data) => {
                    let { username, password , ...options  } =  data.options as any;
                    console.log('Database Connected : ',options);
                    resolve(true);
                })
                .catch((err) => {
                    console.error('[Error Connecting To Database] :', err);
                    reject(err)
                })
        })
    }

}