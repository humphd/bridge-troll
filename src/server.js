'use strict';

const app = require('./app');
const db = require('./db');

let port = process.env.PORT || 8080;
let server;

const shutdown = () => {
    db.close()
        .then(() => {
            if(server) {
                server.close();
            }
            process.exit(0);
        })
        .catch(() => process.exit(0));
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

db.init()
    .then(() => {
        server = app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    })
    .catch(err => {
        console.error('Database Error', err);
        shutdown();
    });
