import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import DeckEditStore from '../../../stores/DeckEditStore';
import {NavLink, navigateAction} from 'fluxible-router';
import {Button, Icon, Modal, Header} from 'semantic-ui-react';
import FocusTrap from 'focus-trap-react';
import _ from 'lodash';
import hideEditInProgressModal from '../../../actions/deckedit/hideEditInProgressModal';


class EditInProgressModal extends React.Component {

    constructor(props) {
        super(props);
    }

    cancelEditing() {
        this.context.executeAction(hideEditInProgressModal);
    }

    continueEditing() {
        this.context.executeAction(hideEditInProgressModal);
    }

    render() {
        let {shouldShowEditInProgressModal} = this.props.DeckEditStore;
        let headerText = 'This slide is currently being edited';
        let modalDescription = 'This slide is currently being edited by somebody else. Any changes you make may be overwritten.' +
            '                   Are you sure you wish to edit this slide?';
        let buttons =
            <div>
                <Button as='button' onClick={this.continueEditing.bind(this)}>Go to the latest version</Button>
                <Button as='button' onClick={this.cancelEditing.bind(this)}><Icon name='close'/> Close</Button>
            </div>;
        return (
            <Modal dimmer='blurring' size='small' role='dialog' aria-labelledby='editInProgressModalHeader'
                   aria-describedby='editInProgressModalDesc' open={shouldShowEditInProgressModal}
                   onClose={this.cancelEditing.bind(this)}>
                <Header icon='warning sign' content={headerText} id='editInProgressModalHeader'/>
                <Modal.Content>
                    <p id='editInProgressModalDesc'>{modalDescription}</p>
                </Modal.Content>
                <Modal.Actions>
                    <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true}} active={shouldShowEditInProgressModal}>
                        {buttons}
                    </FocusTrap>
                </Modal.Actions>
            </Modal>
        );
    }
}

EditInProgressModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

EditInProgressModal = connectToStores(EditInProgressModal, [DeckEditStore], (context, props) => {
    return {
        DeckEditStore: context.getStore(DeckEditStore).getState()
    };
});
export default EditInProgressModal;