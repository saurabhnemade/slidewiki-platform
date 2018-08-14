import PropTypes from 'prop-types';
import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import {navigateAction} from 'fluxible-router';
import {Button, Icon, Modal, Header, Image, Segment, TextArea, Menu, Popup, Dimmer, Loader} from 'semantic-ui-react';
import FocusTrap from 'focus-trap-react';
import {FormattedMessage, defineMessages} from 'react-intl';
import { fetchUserDecks } from '../../../../actions/user/userprofile/fetchUserDecks';
import DeckCollectionStore from '../../../../stores/DeckCollectionStore';
import DecksList from './DecksList';

class AddDecksModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeItem: 'myDecksTab',
            isOpen: false,
            selectedDecks: this.props.selectedDecks.slice()
        };

        this.messages = this.getIntlMessages();
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }
    componentWillReceiveProps(newProps){
        if (this.props !== newProps) {
            this.setState({
                selectedDecks: newProps.selectedDecks.slice(),
            });
        }
    }
    handleMenuClick(e, { id }){
        this.setState({ activeItem: id });
    }
    handleOpen(){
        this.context.executeAction(fetchUserDecks, { params: {} });

        this.setState({
            isOpen: true,
        });
    }
    handleClose(){
        this.setState({
            isOpen: false,
            // selectedDecks: this.props.selectedDecks,
        });
    }
    handleSave() {
        this.props.handleAdd(this.state.selectedDecks);
        this.handleClose();
    }
    getIntlMessages(){
        return defineMessages({
            modalTitle: {
                id: 'AddDecksToCollectionModal.title',
                defaultMessage: 'Add decks to playlist'
            }, 
            fromMyDecksTitle: {
                id: 'AddDecksToCollectionModal.fromMyDecks',
                defaultMessage: 'From My Decks'
            }, 
            fromSlidewikiTitle: {
                id: 'AddDecksToCollectionModal.fromSlidewiki',
                defaultMessage: 'From Slidewiki'                
            },
            buttonAdd: {
                id: 'AddDecksToCollectionModal.button.add',
                defaultMessage: 'Add'
            }, 
            buttonClose: {
                id: 'AddDecksToCollectionModal.button.close',
                defaultMessage: 'Close'
            }, 

        });
    }
    handleOnDeckClick(deck){
        let newState = Object.assign({}, this.state);

        let index = this.state.selectedDecks.findIndex( (d) => d.deckID === deck.deckID);
        if (index < 0) {

            // add selected deck
            newState.selectedDecks.push(deck);
        } else {

            // if already selected, then remove it
            newState.selectedDecks.splice(index, 1);
        }

        this.setState(newState);
    }
    render() {
        let button = <Button floated="right" size="small" primary positive as="button"
            type="button"
            aria-label={this.context.intl.formatMessage(this.messages.modalTitle)}
            aria-hidden={this.state.isOpen}
            onClick={this.handleOpen}
            tabIndex={ this.state.isOpen ? -1 : 0} >
            {this.context.intl.formatMessage(this.messages.modalTitle)}
        </Button>;
        let trigger = <Popup trigger={button} />;

        let decks = this.props.DeckCollectionStore.decks;
        let content;

        if (!decks) {
            content = <Segment id="panelMyDecksContent">
                <Dimmer active inverted>
                    <Loader inverted>Loading</Loader>
                </Dimmer>
                <Image src="http://semantic-ui.com/images/wireframe/paragraph.png" />
            </Segment>;
        } else {
            content = <DecksList handleOnDeckClick={this.handleOnDeckClick.bind(this)} loggedInDisplayName={this.props.loggedInDisplayName} decks={decks} selectedDecks={this.state.selectedDecks} />;
        }
        return (
            <Modal 
                trigger={trigger}
                id="newCollectioModal"
                dimmer='blurring' 
                size='small' 
                role='dialog' 
                aria-labelledby='addNewCollectionHeader'
                aria-describedby='addNewCollectionDescription'
                aria-hidden = {!this.state.isOpen}
                tabIndex="0"
                open={this.state.isOpen}
                onClose={this.handleClose}>

                <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true}} active={this.state.isOpen} className="header">
                    <Modal.Header  as="h1" content={this.context.intl.formatMessage(this.messages.modalTitle)} id='addNewCollectionHeader'/>
                    <Modal.Content>
                       <TextArea className="sr-only" id="addNewCollectionDescription" value="Create a new deck collection" tabIndex ='-1'/>
                        <Menu attached='top' tabular role="tablist">
                           <Menu.Item name={this.context.intl.formatMessage(this.messages.fromMyDecksTitle)} id="myDecksTab" active={this.state.activeItem === 'myDecksTab'} aria-selected={this.state.activeItem === 'myDecksTab'} onClick={this.handleMenuClick.bind(this)} role="tab" tabIndex="0" />
                           <Menu.Item name={this.context.intl.formatMessage(this.messages.fromSlidewikiTitle)} id="slidewikiTab" active={this.state.activeItem === 'slidewikiTab'} aria-selected={this.state.activeItem === 'slidewikiTab'} onClick={this.handleMenuClick.bind(this)} role="tab" tabIndex="0" />
                         </Menu>
                         { content }
                    </Modal.Content>

                    <Modal.Actions>
                        <Segment basic textAlign="center">
                            <div>
                                <Button primary as='button' onClick={this.handleSave}><Icon name='plus'/><FormattedMessage {...this.messages.buttonAdd} /></Button>
                                <Button as='button' onClick={this.handleClose}><Icon name='close'/><FormattedMessage {...this.messages.buttonClose} /></Button>
                            </div>
                        </Segment>
                    </Modal.Actions>
                </FocusTrap>
            </Modal>
        );
    }
}

AddDecksModal.contextTypes = {
    executeAction: PropTypes.func.isRequired, 
    intl: PropTypes.object.isRequired
};

AddDecksModal = connectToStores(AddDecksModal, [DeckCollectionStore], (context, props) => {
    return {
        DeckCollectionStore: context.getStore(DeckCollectionStore).getState(),
    };
});

export default AddDecksModal;