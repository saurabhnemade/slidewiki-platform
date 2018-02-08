import {shortTitle} from '../../configs/general';
import slideIdTypeError from '../error/slideIdTypeError';
import serviceUnavailable from '../error/serviceUnavailable';
import { AllowedPattern } from '../error/util/allowedPattern';
import DeckTreeStore from '../../stores/DeckTreeStore';
const log = require('../log/clog');

export default function loadSlideView(context, payload, done) {
    log.info(context);
    if (!(AllowedPattern.SLIDE_ID.test(payload.params.sid) || payload.params.sid === undefined)) {
        context.executeAction(slideIdTypeError, payload, done);
        return;
    }
    console.log('send to load');
    context.dispatch('LOAD_SLIDE_CONTENT_LOAD', {loadingIndicator: 'true'});
    //context.dispatch('LOAD_SLIDE_CONTENT_LOAD');
    //console.log('get content');

    context.service.read('slide.content', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            return;
        } else {
            context.dispatch('LOAD_SLIDE_CONTENT_SUCCESS', res);
        }
        let deckTitle = context.getStore(DeckTreeStore).getState().deckTree.get('title');
        let pageTitle = shortTitle + ' | ' + deckTitle + ' | ' + res.slide.revisions[0].title;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle,
            frozen: true,
            allowUnfreeze: true,
        });
        done();
    });
}
