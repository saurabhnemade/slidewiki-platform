import PropTypes from 'prop-types';
import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import UserProfileStore from '../../../stores/UserProfileStore';
import UserReviewStore from '../../../stores/UserReviewStore';
import UserProfileReviewDecks from './UserProfileReviewDecks';
import getNextReviewableUser from '../../../actions/userReview/getNextReviewableUser';
import updateTrap from '../../../actions/loginModal/updateTrap';

class UserProfileReviewUser extends React.Component {
    componentDidMount() {
        let userProfileStore = this.props.UserProfileStore;
        if (!((userProfileStore.username !== undefined && userProfileStore.username !== null && userProfileStore.username !== '')
          && (userProfileStore.userid !== undefined && userProfileStore.userid !== null && userProfileStore.userid !== '')
          && (userProfileStore.jwt !== undefined && userProfileStore.jwt !== null && userProfileStore.jwt !== ''))) {
            //prepraring the modal
            this.context.executeAction(updateTrap,{activeTrap:true});
            //hidden the other page elements to readers
            $('#app').attr('aria-hidden','true');
            $('.ui.login.modal').modal('show');
        } else if (!this.props.UserReviewStore.secretCorrect) {
            this.context.executeAction(navigateAction, {
                url: '/Sfn87Pfew9Af09aM'
            });
        }
    }

    componentDidUpdate() {
        if (!this.props.UserReviewStore.secretCorrect) {
            this.context.executeAction(navigateAction, {
                url: '/Sfn87Pfew9Af09aM'
            });
        }
        if (this.props.UserReviewStore.dimmer.approve) {
            swal({
                type: 'success',
                text: 'Do you want to review another?',
                title: 'User approved',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            })
            .then(() => {
                this.context.executeAction(getNextReviewableUser, {
                    secret: this.props.UserReviewStore.secret,
                    jwt: this.props.UserProfileStore.jwt
                });
            },).catch(swal.noop);
        } else if (this.props.UserReviewStore.dimmer.suspend) {
            swal({
                type: 'success',
                text: 'Do you want to review another?',
                title: 'User suspended',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            })
            .then(() => {
                this.context.executeAction(getNextReviewableUser, {
                    secret: this.props.UserReviewStore.secret,
                    jwt: this.props.UserProfileStore.jwt
                });
            },).catch(swal.noop);
        } else if (this.props.UserReviewStore.dimmer.keepreviewing) {
            swal({
                type: 'success',
                text: 'Do you want to review another?',
                title: 'User returned to the queue',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            })
            .then(() => {
                this.context.executeAction(getNextReviewableUser, {
                    secret: this.props.UserReviewStore.secret,
                    jwt: this.props.UserProfileStore.jwt
                });
            },).catch(swal.noop);
        } else if (this.props.UserReviewStore.dimmer.noreviewables) {
            swal({
                type: 'success',
                text: 'There are no users for review.',
                title: 'No users',
                timer: 4000,
                showCloseButton: false,
                showCancelButton: false,
                allowEscapeKey: false,
                showConfirmButton: false
            }).then(() => {});
        }
    }

    render() {
        return (<UserProfileReviewDecks user={this.props.UserProfileStore.user} decks={this.props.UserProfileStore.userDecks} loggedinuser={this.props.UserProfileStore.username} jwt={this.props.UserProfileStore.jwt} />);
    }
}

UserProfileReviewUser.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

UserProfileReviewUser = connectToStores(UserProfileReviewUser, [UserProfileStore,UserReviewStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        UserReviewStore: context.getStore(UserReviewStore).getState()
    };
});

export default UserProfileReviewUser;
