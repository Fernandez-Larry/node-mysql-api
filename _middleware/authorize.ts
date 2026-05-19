const { expressjwt } = require('express-jwt');
const db = require('../_helpers/db');

export default function authorize(roles: any = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        expressjwt({ secret: process.env.JWT_SECRET || 'SUPER_SECRET_KEY_REPLACE_ME_IN_PRODUCTION', algorithms: ['HS256'] }),
        async (req: any, res: any, next: any) => {
            const account = await db.Account.findByPk(req.auth.id);

            if (!account || (roles.length && !roles.includes(account.role))) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            req.auth.role = account.role;
            const refreshTokens = await account.getRefreshTokens();
            req.auth.ownsToken = (token: any) => !!refreshTokens.find((x: any) => x.token === token);
            next();
        }
    ];
}
