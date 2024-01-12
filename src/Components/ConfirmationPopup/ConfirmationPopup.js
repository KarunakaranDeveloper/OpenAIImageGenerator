import React, { Component } from 'react'
import { Modal, Button} from 'react-bootstrap';
import './ConfirmationPopup.css'

class ConfirmationPopup extends Component {
    render() {
        console.log(this.props)
        return (
            <div>
                <Modal centered show={this.props.confirmationPopup.showModal} onHide={this.props.confirmationPopup.handleCloseModal}>
                    
                    <Modal.Body><h2>{this.props.confirmationPopup.confirmationMessage}</h2></Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.props.confirmationPopup.handleCloseModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" className='confirm' onClick={this.props.confirmationPopup.handleConfirmModal}>
                            Yes, Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default ConfirmationPopup;
export { ConfirmationPopup }