import React from "react";
import { IdentifierSearch } from "./identifierSearch";
import { IdentifierAdd } from "./identifierAdd";
import { Button } from "react-bootstrap";
import { importASL } from "../../utilities/utilities";

export class IdentifierPage extends React.Component {
    identifierRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }
    showIdentifierAdd = () => {
        this.POPUP.current.showPopUp("Add New Identifier", IdentifierAdd, "bg-warning", { modalProps: { size: 'md', className: "bg-opacity-75 bg-dark", css: { footer: "visually-hidden" } } });
    }
    render() {
        return (
            <div className="container">
                <div> <button className="btn btn-primary bi bi-plus-lg" onClick={this.showIdentifierAdd}></button> </div>
                <div className="mt-1">
                    <IdentifierSearch ref={this.identifierRef} />
                </div>
            </div>
        );
    }
}