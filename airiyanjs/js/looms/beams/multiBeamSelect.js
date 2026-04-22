import React from "react";
import { importASL, GetAslModules } from "../../utilities/utilities";
import { SearchBeams } from "./searchBeams";

const MultiRender = GetAslModules("MultiRender");

export class MultiBeamSelect extends React.Component {
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
            this.TOAST.current.showWarning("Select Beams", "Beam detail is missing");
            return false;
        }
        return true;
    }

    getValue = () => {
        const allLis = this.multiRef.current.getValue();
        const res = [];
        for (const ls of allLis) {
            const { id, length, loomedLength } = ls;
            res.push({ id, length, loomedLength });
        }
        return res;
    }

    onSelect = (data) => {
        const { id } = data;
        const allLis = this.multiRef.current.getValue();
        let canAdd = true;
        for (const ls of allLis) {
            if (id === ls.id) {
                canAdd = false;
                break;
            }
        }
        if (canAdd) {
            this.multiRef.current.add({ props: { data } });
        } else {
            this.TOAST.current.showWarning("Cannot add", "Beam already added");
        }
    }

    render() {
        const { disabled = false } = this.state;
        const { css = "", style = {} } = this.props;
        return <div className={"card " + css} style={style}>
            <div className="card-header">
                <div className="row">
                    <div className="col ps-1">
                        <h5 className="card-title">Select Beams</h5>
                    </div>
                    <div className="col text-end pe-1">
                        <button disabled={disabled} className="btn btn-sm btn-primary bi bi-plus-circle-fill" onClick={() => {
                            this.POPUP.current?.showPopUp("Select Beams", SearchBeams, "", { modalProps: { fullScreen: true, size: 'xl', className: "bg-opacity-75 bg-dark", css: { body: "p-0 mt-1", footer: "visually-hidden" } }, props: { onSelect: this.onSelect, url: "/service/beam/search/IN_STOCK" } });
                        }}></button>
                    </div>
                </div>
            </div>
            <div className="card-body p-0">
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th className="">Beam UID</th>
                            <th className="">Beam Number</th>
                            <th style={{ "max-width": "300px" }}>Beam Group</th>
                            <th className="text-end">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <MultiRender ref={this.multiRef} component={bmSelectRow} />
                    </tbody>
                </table>
            </div>
        </div>;
    }
}



class bmSelectRow extends React.Component {
    beamRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    getValue = () => {
        const { data } = this.props;
        return data;
    }

    render() {
        const { data = {}, onClose } = this.props;
        const { uid, number, group: { name } } = data;
        return (
            <tr className="align-middle">
                <td className="">{uid}</td>
                <td className="">{number}</td>
                <td>{name}</td>
                <td className="text-end">
                    <button className="btn btn-sm btn-secondary bi bi-x-lg" onClick={onClose}></button>
                </td>
            </tr>
        );
    }
}