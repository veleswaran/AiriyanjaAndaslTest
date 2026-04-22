import React from "react";
import { useOutletContext } from "react-router-dom";
import { AddClientLoom } from "./addClientLoom";
import { SearchClientLoom } from "./search/searchClientLoom";
import { importASL } from "../../utilities/utilities";

export class ClientLoomPageClass extends React.Component {
    searchRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    refershSearch = () => {
        this.searchRef.current?.callZero();
    }

    render() {
        return <>
            <div className="row m-0">
                <div className="col">
                    <button className="btn btn-primary bi bi-plus-circle-fill" onClick={() => {
                        const { businessData } = this.props;
                        this.POPUP.current?.showPopUp("Add Loom", AddClientLoom, "", { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" }, props: { onSuccess: this.refershSearch, businessData } });
                    }}> Add Loom</button>
                </div>
            </div>
            <SearchClientLoom ref={this.searchRef} />
        </>;
    }
}

export const ClientLoomPage = (props) => {
    const { businessData } = useOutletContext();
    return <ClientLoomPageClass {...props} businessData={businessData} />
}