import React from "react";
import { importASL, GetAslModules } from "../../utilities/utilities";
import { SearchClientBeams } from "./searchClientBeams";

const MultiRender = GetAslModules("MultiRender");

export class MultiClientBeamSelect extends React.Component {
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
            const { id, receivedLength, loomedLength } = ls;
            res.push({ id, receivedLength, loomedLength });
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

    clear = () => {
        this.multiRef.current?.clear();
    }

    render() {
        const { disabled = false } = this.state;
        const { css = "", style = {}, clientId = "", url = "/service/clientbeam/client/search/", urlGetter, queryGetter } = this.props;
        return <div className={"card " + css} style={style}>
            <div className="card-header">
                <div className="row">
                    <div className="col ps-1">
                        <h5 className="card-title">Select client Beams</h5>
                    </div>
                    <div className="col text-end pe-1">
                        <button disabled={disabled} className="btn btn-sm btn-primary bi bi-plus-circle-fill" onClick={() => {
                            const finalUrl = urlGetter ? urlGetter() : (url + clientId);
                            const query = queryGetter ? queryGetter() : {};
                            this.POPUP.current?.showPopUp("Select Beams", SearchClientBeams, "", { modalProps: { fullScreen: true, size: 'xl', className: "bg-opacity-75 bg-dark" }, props: { onSelect: this.onSelect, url: finalUrl, query } });
                        }}></button>
                    </div>
                </div>
            </div>
            <div className="card-body p-0">
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th className="">Beam UID</th>
                            <th>Beam Group</th>
                            <th>Thread</th>
                            <th>Width</th>
                            <th>Received Length</th>
                            <th>Loomed Length</th>
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
        const { beam = {}, loomedLength, receivedLength } = data;
        const { uid, group: { name } = {}, threadCount, width } = beam;
        return (
            <tr className="align-middle">
                <td>{uid}</td>
                <td>{name}</td>
                <td>{threadCount}</td>
                <td>{width}</td>
                <td>{receivedLength}</td>
                <td>{loomedLength}</td>
                <td className="text-end">
                    <button className="btn btn-sm btn-secondary bi bi-x-lg" onClick={onClose}></button>
                </td>
            </tr>
        );
    }
}