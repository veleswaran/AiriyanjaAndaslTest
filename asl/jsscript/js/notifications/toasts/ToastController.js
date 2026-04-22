import React from "react";
import { DefaultToast } from "./DefaultToast";
import { ToastContainer } from "react-bootstrap";
import { MultiRender } from "../../commonComponents/MultiRender";
import { createRoot } from "react-dom/client";

export class ToastController extends React.Component {
    constructor(props) {
        super(props);
        this.renderRef = React.createRef(null);
    }

    showSuccess = (heading, body) => {
        this.showToast(heading, body, 'Success');
    }

    showFailed = (heading, body) => {
        this.showToast(heading, body, 'Danger');
    }

    showMessage = (heading, body) => {
        this.showToast(heading, body, 'Primary');
    }

    showWarning = (heading, body) => {
        this.showToast(heading, body, 'Warning');
    }

    showToast = (heading, body, variant, component, params = {}) => {
        const { component: propComponent = DefaultToast } = this.props
        this.renderRef.current.add(
            {
                component: component || propComponent,
                props: { ...params, heading, body, variant, isToast: true }
            }
        )
    }

    render() {
        const { className = "", style = {} } = this.props;
        return (
            <ToastContainer className={className ? className : "position-absolute p-3 h-100 overflow-hidden"} position="top-end" style={{ zIndex: 2000, ...style }} >
                <MultiRender ref={this.renderRef} />
            </ToastContainer>
        )
    }
}

export var TOAST;

export function addToastController(element, css = "", style = {}) {
    const controllerRef = React.createRef(null);
    const root = createRoot(element);
    root.render(<ToastController ref={controllerRef} className={css} style={style} />);
    TOAST = controllerRef;
}