import React from "react";
import { GetAslModules, importASL } from "../../utilities/utilities";
import { SearchBeamGroup } from "../beamgroups/searchBeamGroup";

const MultiRender = GetAslModules("MultiRender");
const TitledIntegerTextBox = GetAslModules("TitledIntegerTextBox");
const TitledDecimalTextBox = GetAslModules("TitledDecimalTextBox");

export class BeamGroupsSeleter extends React.Component {
    multiRef = React.createRef(null);
    constructor(props) {
        super(props)
        this.state = {};
    }

    async componentDidMount() {
        const { POPUP, TOAST } = await importASL();
        this.POPUP = POPUP;
        this.TOAST = TOAST;
    }

    isValid = () => {
        const allLis = this.multiRef.current.getValue();
        if (allLis.length <= 0) {
            this.TOAST.current.showWarning("Select beam details", "Beam detail is missing");
            return false;
        }
        return this.multiRef.current.isValid();
    }

    getValue = () => {
        const allLis = this.multiRef.current.getValue();
        const res = [];
        for (const ls of allLis) {
            const { data: { id }, requiredNumber, requiredThread, requredWidth } = ls;
            res.push({ beamGroupId: id, requiredNumber, requiredThread, requredWidth });
        }
        return res;
    }

    onSelect = (data) => {
        const { id } = data;
        const allLis = this.multiRef.current.getValue();
        let canAdd = true;
        for (const ls of allLis) {
            if (id === ls.data.id) {
                canAdd = false;
                break;
            }
        }
        if (canAdd) {
            this.multiRef.current.add({ props: { data } });
        } else {
            this.TOAST.current.showWarning("Cannot add", "Beam group already added");
        }
    }

    render() {
        const { disabled = false } = this.state;
        const { css = "", style = {} } = this.props;
        return <div className={"card " + css} style={style}>
            <div className="card-header">
                <div className="row">
                    <div className="col ps-1">
                        <h5 className="card-title">Select Beam Requirement</h5>
                    </div>
                    <div className="col text-end pe-1">
                        <button disabled={disabled} className="btn btn-sm btn-primary bi bi-plus-circle-fill" onClick={() => {
                            this.POPUP.current?.showPopUp("Select Beam Group", SearchBeamGroup, "", { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" }, props: { onSelect: this.onSelect } });
                        }}></button>
                    </div>
                </div>
            </div>
            <div className="card-body p-0">
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th className="table-secondary">Beam Group</th>
                            <th style={{ "max-width": "300px" }}>Required Number</th>
                            <th style={{ "max-width": "300px" }}>Required Thread</th>
                            <th style={{ "max-width": "300px" }}>Required Width</th>
                            <th className="text-end">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <MultiRender ref={this.multiRef} component={bgSelectRow} />
                    </tbody>
                </table>
            </div>
        </div>;
    }
}

class bgSelectRow extends React.Component {
    beamRef = React.createRef(null);
    threadRef = React.createRef(null);
    widthRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    getValue = () => {
        const { data } = this.props;
        return { data, requiredNumber: this.beamRef.current.getValue(), requiredThread: this.threadRef.current.getValue(), requredWidth: this.widthRef.current.getValue() };
    }

    isValid = () => {
        return this.beamRef.current.isValid() && this.threadRef.current.isValid() && this.widthRef.current.isValid();
    }

    pickValidator = (data) => {
        if (data === null || data < 1) {
            return false;
        }
        return true;
    }

    widthValitater = (data) => {
        if (data === null || !(data > 0)) {
            return false;
        }
        return true;
    }


    render() {
        const { data = {}, onClose } = this.props;
        const { name = "" } = data;
        return (
            <tr className="align-middle">
                <td className="table-secondary">{name}</td>
                <td>
                    <TitledIntegerTextBox ref={this.beamRef} placeholder="Number of beams" validator={this.pickValidator} />
                </td>
                <td>
                    <TitledIntegerTextBox ref={this.threadRef} placeholder="Number of thread" validator={this.pickValidator} />
                </td>
                <td>
                    <TitledDecimalTextBox ref={this.widthRef} placeholder="Reqired Width (Inch)" validator={this.widthValitater} />
                </td>
                <td className="text-end">
                    <button className="btn btn-sm btn-secondary bi bi-x-lg" onClick={onClose}></button>
                </td>
            </tr>
        );
    }
}