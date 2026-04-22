import React from "react";
import { SearchWeft } from "./search/searchWeft";
import { GetAslModules, importASL } from "../../utilities/utilities";


const MultiRender = GetAslModules("MultiRender");
const TitledDecimalTextBox = GetAslModules("TitledDecimalTextBox");


export class WeftSelect extends React.Component {
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
            this.TOAST.current.showWarning("Select weft details", "Weft detail is missing");
            return false;
        }
        return this.multiRef.current.isValid();
    }

    getValue = () => {
        const allLis = this.multiRef.current.getValue();
        const res = [];
        for (const ls of allLis) {
            const { data: { id }, consumes } = ls;
            res.push({ weftId: id, consumes });
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
            this.TOAST.current.showWarning("Cannot add", "Weft already added");
        }
    }

    render() {
        const { disabled = false } = this.state;
        const { css = "", style = {}, title = "Select Weft consumption" } = this.props;
        return <div className={"card " + css} style={style}>
            <div className="card-header">
                <div className="row">
                    <div className="col ps-1">
                        <h5 className="card-title">{title}</h5>
                    </div>
                    <div className="col text-end pe-1">
                        <button disabled={disabled} className="btn btn-sm btn-primary bi bi-plus-circle-fill" onClick={() => {
                            this.POPUP.current?.showPopUp("Select Weft", SearchWeft, "", { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" }, props: { onSelect: this.onSelect } });
                        }}></button>
                    </div>
                </div>
            </div>
            <div className="card-body p-0">
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th className="table-secondary">Weft Details</th>
                            <th style={{ "max-width": "300px" }}>Weight in Kg</th>
                            <th className="text-end">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <MultiRender ref={this.multiRef} component={wtSelectRow} />
                    </tbody>
                </table>
            </div>
        </div>;
    }
}

class wtSelectRow extends React.Component {
    valueRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    getValue = () => {
        const { data } = this.props;
        return { data, consumes: this.valueRef.current.getValue() };
    }

    isValid = () => {
        return this.valueRef.current.isValid();
    }

    pickValidator = (data) => {
        if (data === null || data < 0.001) {
            return false;
        }
        return true;
    }

    render() {
        const { data = {}, onClose } = this.props;
        const { specDetails = [] } = data;
        const names = [];
        for (const { name, specGroup: { name: sgName } = {} } of specDetails) {
            names.push(<span>{sgName + " : " + name + " "}</span>);
        }
        return (
            <tr className="align-middle">
                <td className="table-secondary">{names}</td>
                <td>
                    <TitledDecimalTextBox ref={this.valueRef} placeholder="quantity (Kg)" validator={this.pickValidator} />
                </td>
                <td className="text-end">
                    <button className="btn btn-sm btn-secondary bi bi-x-lg" onClick={onClose}></button>
                </td>
            </tr>
        );
    }
}