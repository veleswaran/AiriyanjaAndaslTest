import React from "react";
import { SearchPurpose } from "./searchPurpose";
import { AddPurpose } from "./addPurpose";
import { GetAslModules, importASL } from "../../utilities/utilities";
import { percentageValidator } from "../../utilities/validators";

export class PurposePage extends React.Component {
    searchRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    showAddPurpose = () => {
        this.POPUP.current.showPopUp("Add Purpose", AddPurpose, "bg-warning", { modalProps: { size: 'lg', className: "bg-opacity-75 bg-dark", css: { body: "p-1", footer: "visually-hidden" } }, props: { onSuccess: this.onPurposeAdded } });
    }

    onPurposeAdded = () => {
        this.searchRef.current.callZero();
    }

    render() {
        return <div className="container">
            <button className="btn btn-outline-primary bi bi-plus-circle" onClick={this.showAddPurpose}></button>
            <SearchPurpose ref={this.searchRef} css="mt-2" />
        </div>
    }
}