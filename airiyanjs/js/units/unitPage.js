import React from "react";
import { UnitTypeSearch } from "./unitType/unitTypeSearch";
import { AddUnits } from "./addUnits";
import { importASL } from "../utilities/utilities";
import { Button } from "react-bootstrap";

export class UnitPage extends React.Component {
    consumableRef = React.createRef(null);
    constructor(props) {
        super(props)
    }
    async componentDidMount(){
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }
    showUnitAdd = () => {
        this.POPUP.current.showPopUp("Add Unit Type", AddUnits,"bg-warning",{ modalProps: { size: 'lg', className: "bg-opacity-75 bg-dark" }});
    }
    render() {
        return (
            <div className="container">
                <div className="row m-0">
                   <div> <Button variant="primary" onClick={this.showUnitAdd}>Add Unit Type</Button> </div>
                    <div className="col mt-2">
                        <UnitTypeSearch ref={this.consumableRef} />
                    </div>
                </div>
            </div>
        );
    }
}