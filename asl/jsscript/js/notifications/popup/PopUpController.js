import React from "react";
import { MultiRender } from "../../commonComponents/MultiRender";
import { DefaultPopUp } from "./DefaultPopUp";
import { createRoot } from "react-dom/client";

export class PopUpController extends React.Component {
    constructor(props) {
        super(props);
        this.renderRef = React.createRef(null);
    }
    show = (heading, message, callBack) => {
        this.showPopUp(heading, message, 'bg-white', { modalProps: { className: "bg-opacity-75 bg-dark" }, onClose: callBack });
    }

    showSuccess = (heading, message, callBack) => {
        this.showPopUp(heading, message, 'bg-success', { modalProps: { className: "bg-opacity-75 bg-dark" }, onClose: callBack });
    }

    showFailed = (heading, message, callBack) => {
        this.showPopUp(heading, message, 'bg-danger', { modalProps: { className: "bg-opacity-75 bg-dark" }, onClose: callBack });
    }

    showMessage = (heading, message, callBack) => {
        this.showPopUp(heading, message, 'bg-primary', { modalProps: { className: "bg-opacity-75 bg-dark" }, onClose: callBack });
    }

    showWarning = (heading, message, callBack) => {
        this.showPopUp(heading, message, 'bg-warning', { modalProps: { className: "bg-opacity-75 bg-dark" }, onClose: callBack });
    }

    showPopUp = (heading, body, variant, params = {}, component) => {
        const { component: propComponent = DefaultPopUp } = this.props
        this.renderRef.current.add(
            {
                component: component || propComponent,
                props: { ...params, heading, body, variant, isPopUp: true }
            }
        )
    }

    render() {
        return (
            <div>
                <MultiRender ref={this.renderRef} />
            </div>
        );
    }
}

export var POPUP;

export function addPopUpController(element) {
    const controllerRef = React.createRef(null);
    const root = createRoot(element);
    root.render(<PopUpController ref={controllerRef} />);
    POPUP = controllerRef;
}