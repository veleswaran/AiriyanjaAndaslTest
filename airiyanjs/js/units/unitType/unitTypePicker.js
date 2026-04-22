import React from "react";
import { UnitTypeSearch } from "./unitTypeSearch";
import { importASL } from "../../utilities/utilities";
import { PickerButton } from "../../common/pickerButton";

export class UnitTypePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = { unitType: {} };
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST
        this.POPUP = POPUP
    }

    isValid() {
        const { unitType } = this.state;
        return Object.keys(unitType).length > 0;
    }

    unitTypeSelected = (data) => {
        const { onSelect } = this.props;
        if (onSelect) {
            onSelect(data);
        }
        this.setState({ unitType: data });
    }

    setValue(data) {
        this.setState({ unitType: data });
    }

    getValue() {
        const { unitType } = this.state;
        return unitType;
    }

    showUnitType = () => {
        this.POPUP.current?.showPopUp(
            "Select Unit Type",
            UnitTypeSearch,
            "",
            { props: { onSelect: this.unitTypeSelected } },
        );
    }

    render() {
        const { unitType: { name = "" } = {} } = this.state;
        const { css = "", style = {} } = this.props;
        return <div className={"input-group " + css} style={style}>
            <button className="btn btn-primary bi bi-pencil" onClick={this.showUnitType} >+</button>
            <span className="input-group-text">Unit Type name :-</span>
            <strong className="input-group-text bg-light">{name}</strong>
        </div>;
    }
}

export class UnitTypePickerTView extends React.Component {
    buttonRef = React.createRef(null)
    constructor(props) {
        super(props);
        this.state = { unitType: {}, validClass: "" };
    }

    isValid = () => {
        const vld = this.buttonRef.current.isValid();
        this.setState({ validClass: vld ? "" : "text-danger" });
        return vld;
    }

    getValue = () => {
        return this.buttonRef.current.getValue();
    }

    selected = (data) => {
        const { onSelect } = this.props;
        this.setState({ unitType: data });
        onSelect?.(data);
        this.isValid();
    }

    setValue = (data) => {
        this.setState({ unitType: data });
        this.buttonRef.current.setValue(data);
    }

    render() {
        const { title = "Unit :" } = this.props;
        const { unitType: { name = "" } = {}, validClass } = this.state;
        return <tr>
            <td colspan="3">
                <div class="d-flex">
                    <span className={"fw-bold " + validClass}>{title}</span>
                    <div class="flex-fill ms-2">{name}</div>
                    <td><PickerButton cssPlus="btn-sm" ref={this.buttonRef} searchComponent={UnitTypeSearch} onSelect={this.selected} modalProps={{ size: "xl" }} title="Select Unit Type" /></td>
                </div>
            </td>
        </tr>
    }
}
