import becca = require('../becca/becca');
import eu = require('./etapi_utils');
import passwordEncryptionService = require('../services/encryption/password_encryption');
import etapiTokenService = require('../services/etapi_tokens');
import { RequestHandler, Router } from 'express';

function register(router: Router, loginMiddleware: RequestHandler[]) {
    eu.NOT_AUTHENTICATED_ROUTE(router, 'post', '/etapi/auth/login', loginMiddleware, (req, res, next) => {
        const {password, tokenName} = req.body;

        if (!passwordEncryptionService.verifyPassword(password)) {
            throw new eu.EtapiError(401, "WRONG_PASSWORD", "Wrong password.");
        }

        const {authToken} = etapiTokenService.createToken(tokenName || "ETAPI login");

        res.status(201).json({
            authToken
        });
    });

    eu.route(router, 'post', '/etapi/auth/logout', (req, res, next) => {
        const parsed = etapiTokenService.parseAuthToken(req.headers.authorization);

        if (!parsed || !parsed.etapiTokenId) {
            throw new eu.EtapiError(400, eu.GENERIC_CODE, "Cannot logout this token.");
        }

        const etapiToken = becca.getEtapiToken(parsed.etapiTokenId);

        if (!etapiToken) {
            // shouldn't happen since this already passed auth validation
            throw new Error(`Cannot find the token '${parsed.etapiTokenId}'.`);
        }

        etapiToken.markAsDeletedSimple();

        res.sendStatus(204);
    });
}

export = {
    register
}
