import PropTypes from 'prop-types';
import React from 'react';
import slugify from 'slugify';
import {connectToStores} from 'fluxible-addons-react';
import {navigateAction} from 'fluxible-router';
import {Button, Icon, Modal, Header, Form, Dropdown, Segment, TextArea} from 'semantic-ui-react';
import deleteFollowing from '../../../actions/following/deleteFollowing';
import FocusTrap from 'focus-trap-react';

import UserFollowingsStore from '../../../stores/UserFollowingsStore';

class FollowingModal extends React.Component {
    handleClose(){
        this.props.handleClose();
    }

    handleUnfollow(following) {
        this.context.executeAction(deleteFollowing, {
            id: following.id
        });
    }

    render() {
        let deckFollowings = this.props.UserFollowingsStore.deckFollowings;
        let playlistFollowings = this.props.UserFollowingsStore.playlistFollowings;

        let deckContent = (this.props.UserFollowingsStore.loading) ? '' : (this.props.UserFollowingsStore.deckFollowings.length === 0) ? <div className="ui center aligned basic segment">You are not following any decks. </div> : deckFollowings.map( (fol) => {
            let slug = fol.title && slugify(fol.title).toLowerCase() || '_';
            return (
                <div key={fol.id} className="ui vertical segment">
                    <div className="ui two column stackable grid container">
                        <div className="column">
                            <div className="ui header"><h3><a href={['/deck', fol.followed_id, slug,].join('/')} target='_blank'>{fol.title}</a></h3></div>
                            <div className="meta">{fol.description} {(fol.description) ? '\u00b7' : ''} Owner: <a href={'/user/' + fol.userName} target='_blank'>{fol.displayName || fol.userName}</a> </div>
                        </div>

                        <div className="right aligned column">
                            <div>
                                <button className="ui basic red button" aria-label='Unfollow' name={fol.id} onClick={this.handleUnfollow.bind(this, fol)} >
                                    Unfollow
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });

        let playlistContent = (this.props.UserFollowingsStore.loading) ? '' : (this.props.UserFollowingsStore.playlistFollowings.length === 0) ?  <div className="ui center aligned basic segment">You are not following any playlists.</div> : playlistFollowings.map( (fol) => {
            return (
                <div key={fol.id} className="ui vertical segment">
                    <div className="ui two column stackable grid container">
                        <div className="column">
                            <div className="ui header"><h3><a href={`/playlist/${fol.followed_id}?sort=order`} target='_blank'>{fol.title}</a></h3></div>
                            <div className="meta">{fol.description} {(fol.description) ? '\u00b7' : ''} {fol.decksLength} {(fol.decksLength === 1) ? 'deck' : 'decks'} </div>
                        </div>

                        <div className="right aligned column">
                            <div>
                                <button className="ui basic red button" aria-label='Unfollow' name={fol.id} onClick={this.handleUnfollow.bind(this, fol)} >
                                    Unfollow
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
        return (
            <Modal
                id="FollowingModal"
                dimmer='blurring'
                role='dialog'
                aria-labelledby='followingModalHeader'
                aria-describedby='followingDescription'
                aria-hidden = {!this.props.isOpen}
                tabIndex="0"
                size='small' 
                open={this.props.isOpen}
                onClose={this.props.handleClose}>

                <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true}} active={this.props.isOpen} className="dialog">

                    <Modal.Content>
                        <div className="ui hidden divider" />
                        <h2 className="ui centered header">Decks you are following: </h2>
                        <br/>
                        {deckContent}
                        <br/>
                        <div className="ui hidden divider" />
                        <br/>
                        <h2 className="ui centered header">Playlists you are following: </h2>
                        <br/>
                        {playlistContent}
                    </Modal.Content>

                    <TextArea className="sr-only" id="FollowingDescription" value="Following decks and playlists" tabIndex ='-1'/>
                    <Modal.Actions>
                        <Segment basic textAlign="center">
                            <div>
                                <Button as='button' onClick={this.handleClose.bind(this)} tabIndex='1'><Icon name='close'/>Close</Button>
                            </div>
                        </Segment>
                    </Modal.Actions>
                </FocusTrap>
            </Modal>
        );
    }
}

FollowingModal.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

FollowingModal = connectToStores(FollowingModal,[UserFollowingsStore],(context,props) => {
    return {
        UserFollowingsStore: context.getStore(UserFollowingsStore).getState()
    };
});

export default FollowingModal;
