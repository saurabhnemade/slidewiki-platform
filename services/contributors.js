import {Microservices} from '../configs/microservices';
import rp from 'request-promise';

import {fillInUserInfo} from '../lib/services/user';

const log = require('../configs/log').log;

export default {
    name: 'contributors',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params ? params.params : params;
        let selector = {'sid': args.sid, 'stype': args.stype, 'spath': args.spath};
        if (resource === 'contributors.list') {
            //request specific content item from deck service
            rp.get({
                uri: `${Microservices.deck.uri}/${selector.stype}/${selector.sid}/contributors`,
                qs: { language: args.language },
                json: true,
            }).then(fillInUserInfo).then((contributors) => {
                // when all user data is fetched successfully return from service
                callback(null, {contributors: contributors, selector: selector});
            }).catch((err) => {
                console.log(err);
                callback(err);
            });
        }
    }
};
