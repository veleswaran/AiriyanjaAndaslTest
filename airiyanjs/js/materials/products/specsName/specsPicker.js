import React from "react";
import { SearchSpecsName } from "./searchSpecsName";
import { importASL } from "../../../utilities/utilities";

export class SpecsPicker extends React.Component {
    constructor(props) {
        super(props)
        this.state = { data: {} }
    }

    async componentDidMount() {
        const { POPUP } = await importASL();
        this.POPUP = POPUP;
    }

    getValue = () => {
        return this.state.data;
    }

    onSelect = (data) => {
        const { onSelect } = this.props;
        if (onSelect) {
            onSelect(data);
        }
        this.setState({ data });
    }

    showSpecsNamePicker = () => {
        this.POPUP.current?.showPopUp("Select specs Name", SearchSpecsName, "", { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" }, props: { onSelect: this.onSelect } });
    }

    render() {
        const { css = "", style = {} } = this.props;
        const { data = {} } = this.state;
        const { name = "", specGroup: { name: groupName = "" } = {} } = data;
        return (
            <div className={"input-group " + css} style={style}>
                <span className="input-group-text">Pick Specs</span>
                <span className="input-group-text">Name</span>
                <span className="form-control fw-bold">{name}</span>
                <span className="input-group-text">Group Name</span>
                <span className="form-control">{groupName}</span>
                <button className="btn btn-primary bi bi-pen-fill" type="button" onClick={this.showSpecsNamePicker}></button>
            </div>
        );
    }
}