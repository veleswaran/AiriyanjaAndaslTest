import React from "react";
import { importASL } from "../../utilities/utilities";
import { SearchBeamGroup } from "./searchBeamGroup";

export class BeamGroupPickerMini extends React.Component {
    constructor(props) {
        super(props)
        const { data = {} } = this.props;
        this.state = { data };
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    getValue = () => {
        const { data } = this.state;
        return data;
    }

    onSelect = (data) => {
        this.setState({ data });
        const { onSelect } = this.props;
        if (onSelect) {
            onSelect(data);
        }
    }

    onSelectClick = () => {
        const comProps = {
            onSelect: this.onSelect,
        };
        this.POPUP.current.showPopUp("Select Beam Group", SearchBeamGroup, 'bg-warning', { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" }, props: comProps });
    }

    render() {
        const { css = "" } = this.props;
        const { data } = this.state;
        const { name = "test" } = data;
        return <div className={"input-group " + css}>
            <div className="input-group-text flex-grow-1 d-flex flex-column align-items-start">
                <small className="text-muted">Group Name :</small>
                <span className="small">{name}</span>
            </div>
            <button className="btn btn-sm bi bi-pen btn-outline-secondary" onClick={this.onSelectClick}></button>
        </div>;
    }
}
