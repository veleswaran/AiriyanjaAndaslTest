import React from "react";
import { SearchSpecsName } from "./searchSpecsName";
import { Button } from "react-bootstrap";
import { importASL } from "../../../utilities/utilities";
// import { SpecsNameAdd } from "./specsNameAdd";
import { SpecsNameMultiAdd } from "./specsNameMultiAdd";

export class SpecsNamePage extends React.Component {
    specsNameRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    refresh = () => {
        this.specsNameRef?.current.callZero();
    }

    showSpecsNameAdd = () => {
        this.POPUP.current.showPopUp("Add New Specs Name", SpecsNameMultiAdd, "bg-warning", { modalProps: { size: 'md', className: "bg-opacity-75 bg-dark", css: { footer: "visually-hidden" } }, props: { refresh: this.refresh }, onClose: this.refresh });
    }
    render() {
        return (
            <div className="container">
                <div>
                    <button className="btn btn-primary bi bi-plus-lg" onClick={this.showSpecsNameAdd}></button>
                </div>
                <div className="mt-1">
                    <SearchSpecsName ref={this.specsNameRef} />
                </div>
            </div>
        );
    }
}