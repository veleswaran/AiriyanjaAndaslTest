import React from "react";
import { ClientAdd } from "./clientAdd";
import { importASL } from "../utilities/utilities";
import { ClientSearch } from "./clientSearch";
import { useOutletContext } from "react-router-dom";
import { AddGstClient } from "./adder/addGstClient";

export class ClientPage extends React.Component {
    searchRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    onClientAdded = () => {
        this.searchRef.current.callZero();
    }

    showClientAdd = (addFromGST) => {
        const { popUpTitle = "Add Client", gstMandatory = false, baseUrl, clientType } = this.props
        let url = `${baseUrl}/${clientType}`;
        if (addFromGST) {
            url = `${url}/addfrmgst`;
        } else {
            url = `${url}/add`;
        }

        this.POPUP.current.showPopUp(popUpTitle, addFromGST ? AddGstClient : ClientAdd, "bg-warning", { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" }, props: { url, onSuccess: this.onClientAdded, gstMandatory: gstMandatory || addFromGST } });
    }

    render() {
        let { url, title = "", businessData = {} } = this.props;
        const { gst } = businessData;
        const addButtons = [<li><button className="dropdown-item bi bi-plus" onClick={() => this.showClientAdd(false)}>Directly</button></li>
        ];
        if (gst) {
            addButtons.push(<li><button className="dropdown-item bi bi-plus" onClick={() => this.showClientAdd(true)}>From GST</button></li>);
        }
        return <div className="mx-1">
            <div className="text-center h4 p-1 m-0">{title}</div>
            {/* <div className="mb-1 gap-1 d-flex"> {addButtons} </div> */}
            <div className="mb-1">
                <div className="dropdown">
                    <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">Add Client</button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        {addButtons}
                    </ul>
                </div>
            </div>
            <ClientSearch ref={this.searchRef} url={url} />
        </div>;
    }
}

export const purchaseClientPage = function (props) {
    const { businessData } = useOutletContext();
    return <ClientPage {...props} url="/service/client/PURCHASE/search" clientType="PURCHASE" baseUrl="/service/client" title="Manage Purchase Clients" popUpTitle="Add Purchase Client" businessData={businessData} />
};

export const salesClientPage = function (props) {
    const { businessData } = useOutletContext();
    return <ClientPage {...props} url="/service/client/SALES/search" clientType="SALES" baseUrl="/service/client" title="Manage Sales Clients" popUpTitle="Add Sales Client" businessData={businessData} />
};

export const transporterClientPage = function (props) {
    const { businessData } = useOutletContext();
    return <ClientPage {...props} url="/service/client/TRANSPORTER/search" clientType="TRANSPORTER" baseUrl="/service/client" title="Manage Transport Clients" popUpTitle="Add Transporter" gstMandatory={true} businessData={businessData} />
};
