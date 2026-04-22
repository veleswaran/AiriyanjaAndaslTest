import React from "react";
import { GetAslModules, importASL } from "../../utilities/utilities";
import { convertToIST } from "../../utilities/timeUtils";
import { RESULT_SUCCESS } from "../../globals/constants";

const PostButton = GetAslModules("PostButton");

export class BillSearchRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = { status: props.data?.status || "" };
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    onViewBill = (id, type) => {
        window.open(`/sales/viewbill?billid=${id}&type=${type}`, "_blank");
    };

    actionRendered = () => {
        const { others = {} } = this.props;
        const { needSelect = false, onSelect, onClose } = others;
        const { id, category } = this.props?.data;
        const { status } = this.state;

        const cancelProps = {
            url: `/service/bill/${category}/cancel`,
            onError: () => {
                this.TOAST.current.showFailed("Something went wrong", "Unable to change the state");
            },
            onSuccess: (data) => {
                if (data.result === RESULT_SUCCESS) {
                    this.TOAST.current.showSuccess("Success", "Bill cancelled successfully");
                    this.setState({ status: "CANCELLED" });
                    return;
                }
                this.TOAST.current.showFailed("Error", data.message);
            },
            valueGetter: () => ({ id }),
        };

        const approveProps = {
            url: `/service/bill/${category}/make_live`,
            onError: () => {
                this.TOAST.current.showFailed("Something went wrong", "Unable to change the state");
            },
            onSuccess: (data) => {
                if (data.result === RESULT_SUCCESS) {
                    this.TOAST.current.showSuccess("Success", "Bill approved successfully");
                    this.setState({ status: "ACTIVE" });
                    return;
                }
                this.TOAST.current.showFailed("Unsuccess", data.message);
            },
            valueGetter: () => ({ id }),
        };

        const buttons = [];

        if (needSelect) {
            buttons.push(<button className="btn btn-sm btn-outline-primary" onClick={() => { onSelect(this.props.data); onClose(); }}>Select</button>);
        } else {
            if (status === "ACTIVE") {
                buttons.push(
                    <PostButton size="sm" key="cancel" {...cancelProps} needConfirmation confirmMessage="Are you sure to Cancel this bill?" css="ms-1" varient="outline-danger">
                        Cancel
                    </PostButton>
                );
            } else if (status === "DRAFT") {
                buttons.push(
                    <>
                        <PostButton size="sm" key="approve" {...approveProps} needConfirmation confirmMessage="Are you sure to Approve this bill?" css="ms-1" varient="outline-success">
                            Approve
                        </PostButton>
                        <PostButton size="sm" key="cancel" {...cancelProps} needConfirmation confirmMessage="Are you sure to Cancel this bill?" css="ms-1" varient="outline-danger">
                            Cancel
                        </PostButton>
                    </>
                );
            }
        }
        return (<><button className="btn btn-sm btn-outline-secondary me-1" onClick={() => this.onViewBill(id, category)}>View</button>{buttons}</>);
    };

    render() {
        const { data = {}, serial } = this.props;
        const { billClient, billNumber, createdTime, totalCost } = data;
        const { status } = this.state;

        return (
            <tr>
                <th>{serial}</th>
                <td>{billNumber}</td>
                <td>{billClient?.billingName}</td>
                <td>{convertToIST(createdTime)}</td>
                <td>{totalCost}</td>
                <td>{status}</td>
                <td>{this.actionRendered()}</td>
            </tr>
        );
    }
}
