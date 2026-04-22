import React from "react";
import { AddWeft } from "./addWeft";
import { SearchWeft } from "./search/searchWeft";
import { importASL } from "../../utilities/utilities";

export class WeftPage extends React.Component {
    beamGroupRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    refreshSearch = () => {
        this.beamGroupRef.current?.callZero();
    }

    onAddClick = () => {
        this.POPUP.current?.showPopUp("Add new weft", AddWeft, "", { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" }, props: { onSuccess: this.refreshSearch } });
    }

    render() {
        return <div>
            <div>
                <button className="btn btn-primary" onClick={this.onAddClick} >Add Weft</button>
            </div>
            <div className="mt-1">
                <SearchWeft ref={this.beamGroupRef} />
            </div>
        </div>;
    }
}