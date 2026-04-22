import React from "react";
import { importASL } from "../../utilities/utilities";
import { SearchBeamGroup } from "./searchBeamGroup";


export class BeamGroupPicker extends React.Component {
    constructor(props) {
        super(props)
        this.state = { data: {} };
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
        const { autoId, name = "", specDetails = [] } = data;
        const specs = [];
        for (const spec of specDetails) {
            const { name, specGroup: { name: groupName = "" } = {} } = spec;
            specs.push(<tr><td>{groupName}</td><td>{name}</td></tr>);
        }
        let head = "";
        if (data && Object.keys(data).length > 0) {
            head = <tr>
                <th>Name</th>
                <th>{name}</th>
            </tr>;
        }
        return (
            <table className={"table table-striped table-bordered " + css}>
                <thead>
                    <tr>
                        <th>Select Beam Group</th>
                        <th className="text-end">
                            <button className="btn btn-primary" type="button" onClick={this.onSelectClick}>Select</button>
                        </th>
                    </tr>
                    {head}
                </thead>
                <tbody>
                    {specs}
                </tbody>
            </table>
        );
    }
}
