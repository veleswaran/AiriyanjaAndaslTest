import React from "react";
import { importASL } from "../../../utilities/utilities";
import { SearchSpecsGroup } from "./SearchSpecsGroup";

export class SpecsGroupPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = { specsGroup: {} };
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST
        this.POPUP = POPUP
    }

    isValid() {
        const { specsGroup } = this.state;
        return Object.keys(specsGroup).length > 0;
    }

    specsGroupSelected = (data) => {
        const { onSelect } = this.props;
        if (onSelect) onSelect(data);
        this.setState({ specsGroup: data });
    }

    getValue() {
        const { specsGroup } = this.state;
        return specsGroup;
    }

    showSpecsGroup = () => {
        this.POPUP.current?.showPopUp( "Select Specs Group", SearchSpecsGroup, "", { props: { onSelect: this.specsGroupSelected } }, );
    }

    render() {
        const { specsGroup: { name = "" } = {} } = this.state;
        const { css = "", style = {} } = this.props;
        return <div className={"input-group " + css} style={style}>
            <button className="btn btn-primary bi bi-pencil" onClick={this.showSpecsGroup} >+</button>
            <span className="input-group-text">Specs Group:-</span>
            <strong className="input-group-text bg-light">{name}</strong>
        </div>;
    }
}