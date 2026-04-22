import React from "react";
import { Fade, Toast } from "react-bootstrap";
import { uuidv4 } from "../../utilities/uuidv4";

export class DefaultToast extends React.Component {
    constructor(props) {
        super(props);
        const { key = uuidv4() } = this.props;
        this.state = { key, autohide: true }
    }

    onClose = () => {
        const { key } = this.state;
        const { onClose } = this.props;
        if (onClose) {
            onClose(key);
        }
    }

    handleMouseEnter = () => {
        this.setState({ autohide: false });
    };

    handleMouseLeave = () => {
        this.setState({ autohide: true });
    };

    render() {
        const { key, autohide } = this.state;
        const { variant = "Primary", heading = "", time = "", body = "" } = this.props;
        const bodyTextColor = (["light", "warning",].indexOf(variant.toLowerCase()) > -1) ? "text-dark" : "text-white";
        return (
            <Toast bg={variant.toLowerCase()} key={key} onClose={this.onClose} animation={true} show={true} autohide={autohide} delay={5000}>
                <Toast.Header className="bg-transparent">
                    <strong className={"me-auto " + bodyTextColor}>{heading}</strong>
                    <small>{time}</small>
                </Toast.Header>
                <Toast.Body className={bodyTextColor}>
                    {body}
                </Toast.Body>
            </Toast>
        )
    }
}