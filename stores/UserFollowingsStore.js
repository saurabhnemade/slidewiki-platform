import {BaseStore} from 'fluxible/addons';
import slugify from 'slugify';

class UserFollowingsStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.followings = undefined;
        this.selectedFollowingId = null;
        this.loading = true;
    }
    showLoading(payload){
        this.loading = true;
        this.emitChange();
    }
    loadFollowings(payload) {
        // // format the results of the service
        // this.recommendations = payload.recommendations.map( (deck) => {
        //
        //     // get the active revision of the deck
        //     let activeRevision = deck.revisions[deck.revisions.length-1];
        //     return {
        //         deckID: deck._id,
        //         title: activeRevision.title,
        //         firstSlide: activeRevision.firstSlide,
        //         theme: activeRevision.theme,
        //         updated: deck.lastUpdate,
        //         description: deck.description,
        //         creationDate: deck.timestamp,
        //         noOfLikes: deck.noOfLikes,
        //         recommendationWeight: deck.recommendationWeight,
        //         slug: activeRevision.title && slugify(activeRevision.title).toLowerCase() || '_',
        //     };
        // });

        this.loading = false;

        this.emitChange();
    }
    getFollowing(payload) {
        if (payload.followings.length > 0) {
            this.selectedFollowingId = payload.followings[0].id;
        } else {
            this.selectedFollowingId = null;
        }
        this.emitChange();
    }
    createFollowing(payload) {
        if (payload.id !== undefined && payload.id !== null) {
            this.selectedFollowingId = payload.id;
        } else {
            this.selectedFollowingId = null;
        }
        
        this.emitChange();
    }
    deleteFollowing(payload) {
        this.selectedFollowingId = null;
        this.emitChange();
    }
    getState() {
        return {
            followings: this.followings,
            selectedFollowingId: this.selectedFollowingId,
            loading: this.loading
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.followings = state.followings;
        this.selectedFollowingId = state.selectedFollowingId;
        this.loading = state.loading;
    }
}

UserFollowingsStore.storeName = 'UserFollowingsStore';
UserFollowingsStore.handlers = {
    'LOAD_USER_FOLLOWINGS_SUCCESS': 'loadFollowings',
    'SHOW_FOLLOWINGS_LOADING': 'showLoading',
    'GET_FOLLOWING_SUCCESS': 'getFollowing',
    'CREATE_FOLLOWING_SUCCESS': 'createFollowing',
    'DELETE_FOLLOWING_SUCCESS': 'deleteFollowing'
};

export default UserFollowingsStore;
