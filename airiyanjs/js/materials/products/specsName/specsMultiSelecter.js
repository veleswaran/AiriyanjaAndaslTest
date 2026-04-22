import React from "react";
import { SearchSpecsName } from "./searchSpecsName";
import { GetAslModules, importASL } from "../../../utilities/utilities";
import { SpecsSelectRow } from "./selecters/specsSelectRow";

const MultiRender = GetAslModules("MultiRender");

export class SpecsMultiSelecter extends React.Component {
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

    setDisabled = (disabled) => {
        this.setState({ disabled });
    }

    onUpdate = () => {
        const { onUpdate } = this.props;
        if (onUpdate) {
            onUpdate();
        }
    }

    onSelect = (data) => {
        const { onChange } = this.props;
        const { specGroup: { id } } = data;
        const allLis = this.multiRef.current.getValue();
        let canAdd = true;
        for (const ex of allLis) {
            if (id === ex.specGroup.id) {
                canAdd = false;
                break;
            }
        }
        if (canAdd) {
            this.multiRef.current.add({ props: { data } });
        } else {
            this.TOAST.current.showWarning("Cannot add", "One of the specs from the same group already added");
        }
    }

    getValue = () => {
        return this.multiRef.current.getValue();
    }

    clear = () => {
        this.multiRef.current.clear();
    }

    render() {
        const { disabled = false } = this.state;
        const { css = "", style = {}, title = "Select Specs" } = this.props;
        return (
            <div className={"card " + css} style={style}>
                <div className="card-header">
                    <div className="row">
                        <div className="col ps-1">
                            <h6 className="card-title">{title}</h6>
                        </div>
                        <div className="col text-end pe-1">
                            <button disabled={disabled} className="btn btn-sm btn-primary bi bi-plus-circle-fill" onClick={() => {
                                this.POPUP.current?.showPopUp("Select specs Name", SearchSpecsName, "", { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" }, props: { onSelect: this.onSelect } });
                            }}></button>
                        </div>
                    </div>
                </div>
                <div className="card-body p-0">
                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th className="table-secondary">Group</th>
                                <th>Name</th>
                                <th className="text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <MultiRender ref={this.multiRef} onUpdate={this.onUpdate} component={SpecsSelectRow} />
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

