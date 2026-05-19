console.log('Starting server...');
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import accountsController from './accounts/accounts.controller';
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
console.log('swaggerUi type:', typeof swaggerUi, 'serve:', typeof swaggerUi.serve, 'setup:', typeof swaggerUi.setup);

const app = express();

// request logger for debugging
app.use((req: any, res: any, next: any) => {
    console.log('REQ', req.method, req.path);
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

app.get('/test', (req, res) => res.json({ message: 'Server is working!' }));
app.get('/hello', (req, res) => res.send('hello'));
app.use('/accounts', accountsController);
app.use('/api-docs', ...swaggerUi.serve);
app.get('/api-docs', (req: any, res: any) => {
    try {
        // swaggerUi.generateHTML is available in newer swagger-ui-express versions
        if (typeof swaggerUi.generateHTML === 'function') {
            return res.send(swaggerUi.generateHTML(swaggerDocument));
        }
        // fallback to setup middleware
        return swaggerUi.setup(swaggerDocument)(req, res);
    } catch (e) {
        return res.status(500).send('Failed to render API docs');
    }
});

// error handler
app.use((err: any, req: any, res: any, next: any) => {
    switch (true) {
        case typeof err === 'string':
            const is404 = err.toLowerCase().endsWith('not found');
            const statusCode = is404 ? 404 : 400;
            return res.status(statusCode).json({ message: err });
        case err.name === 'UnauthorizedError':
            return res.status(401).json({ message: 'Unauthorized' });
        default:
            return res.status(500).json({ message: err.message });
    }
});

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => {
    console.log('Server listening on port ' + port);
    // debug: list registered routes
    try {
        const routes: string[] = [];
        if (app._router && Array.isArray(app._router.stack)) {
            app._router.stack.forEach((r: any) => {
                try {
                    if (r && r.route && r.route.path) routes.push(JSON.stringify(r.route.path));
                    else if (r && r.name === 'router' && r.handle && Array.isArray(r.handle.stack)) {
                        r.handle.stack.forEach((s: any) => {
                            if (s && s.route && s.route.path) routes.push(JSON.stringify(s.route.path));
                        });
                    }
                } catch (e) {
                    // ignore individual entries
                }
            });
        }
        console.log('Registered routes:', routes);
    } catch (e) {
        console.error('Failed to list routes', e);
    }
});
