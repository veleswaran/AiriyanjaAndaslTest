import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { renderAddress, renderContact } from "./utilities";
import { ClientSearch } from "./clientSearch";
import { importASL } from "../utilities/utilities";


export class ClientPickerCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: {}, enabled: true };
    }

    setEnabled = (enabled) => {
        this.setState({ enabled });
    }

    getValue = () => {
        const { client } = this.state;
        return client;
    }

    clientSelected = (selected, client) => {
        const { onSelect } = this.props;
        this.setState({ client: selected });
        if (onSelect) {
            onSelect(selected);
        }
    }

    showClientPopup = async () => {
        const { url } = this.props;
        const { POPUP } = await importASL();
        const comProps = {
            url,
            onSelect: this.clientSelected,
        };
        POPUP.current.showPopUp("Select client", ClientSearch, 'bg-warning', { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" }, props: comProps });
    }

    clearClient() {
        this.setState({ client: null });
    }

    render() {
        const { client, enabled } = this.state;
        const details = [];
        if (client) {
            const { billingName, detailData } = client;
            details.push(
                <div>
                    <div><strong>Name</strong></div>
                    <div>{billingName}</div>
                </div>
            );
            details.push(
                <div>
                    <div><strong>Address</strong></div>
                    <div>{renderAddress(detailData)}</div>
                </div>
            );
            details.push(
                <div>
                    <div><strong>Other Details</strong></div>
                    <div>{renderContact(detailData)}</div>
                </div>
            );
        }
        return (
            <Container>
                <div>
                    <Button variant="primary" disabled={!enabled} onClick={this.showClientPopup}>Pick Client</Button>
                </div>
                <div>
                    {details}
                </div>
            </Container>
        );
    }
}