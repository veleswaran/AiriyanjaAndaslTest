import React from "react";
import { Button } from "react-bootstrap";
import { importASL } from "../../utilities/utilities";
import { SearchClothChallan } from "./challan/searchClothChallan";
import { AddClothChallan } from "./challan/addClothChallan";

export class LoomedClothPage extends React.Component {
    loomedClothRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    onAddSuccess = () => {
        this.loomedClothRef.current?.callZero();
    }

    showClothChallanAdd = () => {
        this.POPUP.current.showPopUp("Add Loomed Cloth Challan", AddClothChallan, "bg-warning", { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" }, props: { onSuccess: this.onAddSuccess } });
    }

    render() {
        return <div>
            <div><Button variant="primary" onClick={this.showClothChallanAdd}>Add Receipt</Button></div>
            <div className="mt-1">
                <SearchClothChallan ref={this.loomedClothRef} />
            </div>
        </div>;
    }
}