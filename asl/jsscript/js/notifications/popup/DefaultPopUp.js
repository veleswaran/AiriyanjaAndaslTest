import React from "react";
import { Modal } from "react-bootstrap";
import { AutoRender } from "../../utilities/rendering";
import { uuidv4 } from "../../utilities/uuidv4";


export class DefaultPopUp extends React.Component {
    constructor(props) {
        super(props);
        const { key = uuidv4() } = this.props;
        this.state = { key, }
    }

    onClose = () => {
        const { key } = this.state;
        const { onClose } = this.props;
        if (onClose) {
            onClose(key);
        }
    }

    render() {
        const { key } = this.state;
        const { variant = "bg-primary", heading = "", body = "", footer = "", modalProps = {}, callBack, isPopUp = false, props } = this.props;
        const { backgroundClass = "", centered = false, size = "", fullScreen = false, className = "", css: { header: headercss = "", body: bodycss = "", footer: footercss = "" } = {} } = modalProps;
        const prp = { ...props, variant, callBack, onClose: this.onClose, isPopUp };
        return (
            <Modal key={key} show={true} animation={true} onHide={this.onClose} fullscreen={fullScreen} centered={centered} size={size} backdropClassName={backgroundClass} className={className}>
                <Modal.Header className={headercss} closeButton={true}>{AutoRender(heading, prp)}</Modal.Header>
                <Modal.Body className={bodycss}>{AutoRender(body, prp)}</Modal.Body>
                <Modal.Footer className={footercss}>{AutoRender(footer, prp)}</Modal.Footer>
            </Modal>
        );
    }
}