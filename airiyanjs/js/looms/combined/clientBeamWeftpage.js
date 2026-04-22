import React from "react";
import { useOutletContext } from "react-router-dom";
import { ClientPicker } from "../../clients/clientPicker";
import { SearchClientBeams } from "../clientBeams/searchClientBeams";
import { SearchClientWeft } from "../clientWeft/searchClientWeft";



export class ClientBeamWeftPageClass extends React.Component {
    clientRef = React.createRef(null);
    clientBeamSearch = React.createRef(null);
    clientWeftSearch = React.createRef(null);
    constructor(props) {
        super(props)
    }

    onSelected = (selected, client) => {
        const { clientId } = selected;
        this.clientBeamSearch.current.setClientId(clientId);
        this.clientWeftSearch.current.setClientId(clientId);
    }

    render() {
        const { baseUrl = "/service/client", clientType = "PURCHASE", businessData = {} } = this.props;
        return <div>
            <div className="row m-0">
                <div className="col">
                    <ClientPicker ref={this.clientRef} url={`${baseUrl}/${clientType}/search`} baseUrl={baseUrl} clientType={clientType} businessData={businessData} onSelect={this.onSelected} />
                </div>
            </div>
            <div className="row m-0">
                <div className="col">
                    <SearchClientBeams ref={this.clientBeamSearch} needSearch={false} />
                </div>
                <div className="col">
                    <SearchClientWeft ref={this.clientWeftSearch} needSearch={false} />
                </div>
            </div>
        </div>
    }
}

export const ClientBeamWeftPage = (props) => {
    const { businessData } = useOutletContext();
    return <ClientBeamWeftPageClass {...props} businessData={businessData} />
}