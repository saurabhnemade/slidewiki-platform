import serviceUnavailable from '../../error/serviceUnavailable';
const clog = require('../../log/clog');

export default function checkUsername(context, payload, done) {
    clog.info(context, payload);
    context.service.read('user.checkusername', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            clog.error(context, payload, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            context.dispatch('CHECK_USERNAME_FAILURE', err);
        } else {
            context.dispatch('CHECK_USERNAME_SUCCESS', res);
        }

        done();
    });
}
