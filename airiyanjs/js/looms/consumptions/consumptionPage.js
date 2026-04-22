import React from "react";
import { SearchConsumption } from "./search/searchConsumption";
import { importASL } from "../../utilities/utilities";
import { AddConsumption } from "./addConsumptions";


export class ConsumptionPage extends React.Component {
    searchRef = React.createRef(null);
    constructor(props) {
        super(props)
        this.state = {}
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    onAddClick = () => {

    }

    onSuccess = () => {
        this.searchRef.current.callZero();
    }

    render() {
        return <div className="gap-2">
            <div className="mb-1">
                <button className="btn btn-primary bi bi-plus-circle-fill" onClick={() => {
                    this.POPUP.current?.showPopUp("Add Style", AddConsumption, "", { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" }, props: { onSuccess: this.onSuccess } });
                }}> Add Style</button>
            </div>
            <div>
                <SearchConsumption ref={this.searchRef} />
            </div>
        </div>
    }
}