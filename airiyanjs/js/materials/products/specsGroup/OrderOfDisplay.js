import React from "react";
import { GetAslModules, importASL } from "../../../utilities/utilities";
import { OrderRow } from "./OrderRow";
import { SearchSpecsGroup } from "./SearchSpecsGroup";
import { RESULT_SUCCESS } from "../../../globals/constants";

const MultiRender = GetAslModules("MultiRender");
const PostButton = GetAslModules("PostButton");

export class OrderOfDisplay extends React.Component {
    orderRowsRef = React.createRef(null);
    constructor(props) {
        super(props)
        this.state = { disabled: false };
    }

    async componentDidMount() {
        const { POPUP, TOAST } = await importASL();
        this.POPUP = POPUP;
        this.TOAST = TOAST;
    }

    onSgSelect = (data) => {
        const { id } = data;
        const allLis = this.orderRowsRef.current.getValue();
        let canAdd = true;
        for (const ex of allLis) {
            if (id === ex.id) {
                canAdd = false;
                break;
            }
        }
        if (canAdd) {
            this.orderRowsRef.current.add({ props: { data } });
        } else {
            this.TOAST.current.showWarning("Already exist", "Selected specs group already added");
        }
    }

    showSGsearch = () => {
        this.POPUP.current?.showPopUp("Select specs group", SearchSpecsGroup, "", { props: { onSelect: this.onSgSelect } });
    }

    valueGetter = () => {
        const allLis = this.orderRowsRef.current.getValue();
        const res = []
        for (const ex of allLis) {
            res.push(ex.id)
        }
        return { values: res };
    }

    validator = () => {
        const allLis = this.orderRowsRef.current.getValue();
        return allLis.length > 0;
    }

    onDisabled = (disabled) => {
        this.setState({ disabled });
    }

    onSuccess = (responseData) => {
        const { result, message } = responseData;
        if (result === RESULT_SUCCESS) {
            this.TOAST.current.showSuccess("Success", "Specs group order is saved");
            this.orderRowsRef.current.clear();
        } else {
            this.TOAST.current?.showFailed("Somthing went wrong", message || "Unknow Error");
        }
    }

    onError = (err) => {
        this.TOAST.current?.showFailed("Somthing went wrong", "Unable to add the order");
    }

    render() {
        const { disabled } = this.state;
        return (
            <div class="card">
                <div class="card-header">
                    <div className="row">
                        <div className="col align-content-around"><span>Set order of specs display</span></div>
                        <div className="col text-end"><button disabled={disabled} className="btn btn-secondary" onClick={this.showSGsearch}>+</button></div>
                    </div>
                </div>
                <div class="card-body">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <MultiRender ref={this.orderRowsRef} component={OrderRow} />
                        </tbody>
                    </table>
                </div>
                <div className="card-footer text-end">
                    <PostButton
                        url="/service/specs_group/set_display_order"
                        onDisabled={this.onDisabled}
                        valueGetter={this.valueGetter}
                        validator={this.validator}
                        onSuccess={this.onSuccess}
                        onError={this.onError}>
                        Add
                    </PostButton>
                </div>
            </div>
        );
    }
}