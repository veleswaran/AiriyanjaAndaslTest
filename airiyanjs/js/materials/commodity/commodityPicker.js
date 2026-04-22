import React from "react";
import { CommoditySearch } from "./commoditySearch";
import { PickerButton } from "../../common/pickerButton";

export class CommodityPicker extends React.Component {
    buttonRef = React.createRef(null)
    constructor(props) {
        super(props);
        this.state = { commodity: {} };
    }

    isValid() {
        return this.buttonRef.current.isValid();
    }

    getValue() {
        return this.buttonRef.current.getValue();
    }

    commoditySelected = (data) => {
        const { onSelect } = this.props;
        this.setState({ commodity: data });
        onSelect?.(data);
    }

    setValue(data) {
        this.setState({ commodity: data });
        this.buttonRef.current.setValue(data);
    }

    render() {
        const { commodity: { name = "" } = {} } = this.state;
        const { css = "", style = {} } = this.props;
        return <div className={"input-group " + css} style={style}>
            <span className="input-group-text">Commodity:-</span>
            <strong className="input-group-text bg-light">{name}</strong>
            <PickerButton ref={this.buttonRef} searchComponent={CommoditySearch} onSelect={this.commoditySelected} modalProps={{ size: "xl" }} title="Select commodity" />
        </div>;
    }
}


export class CommodityPickerTView extends React.Component {
    buttonRef = React.createRef(null)
    constructor(props) {
        super(props);
        this.state = { commodity: {}, validClass: "" };
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
        this.setState({ commodity: data });
        onSelect?.(data);
        this.isValid();
    }

    setValue = (data) => {
        this.setState({ commodity: data });
        this.buttonRef.current.setValue(data);
    }

    render() {
        const { commodity: { name = "" } = {}, validClass } = this.state;
        return <tr>
            <td colspan="3">
                <div class="d-flex">
                    <span className={"fw-bold " + validClass}>Commodity :</span>
                    <div class="flex-fill ms-2">{name}</div>
                    <PickerButton cssPlus="btn-sm" ref={this.buttonRef} searchComponent={CommoditySearch} onSelect={this.selected} modalProps={{ size: "xl" }} title="Select commodity" />
                </div>
            </td>
        </tr>
    }
}