import React from "react";
import { AddressViewer } from "../../../clients/addressViewer";
import { importASL } from "../../../utilities/utilities";
import { SearchConsumption } from "../../consumptions/search/searchConsumption";
import { Button } from "react-bootstrap";
import { RESULT_SUCCESS } from "../../../globals/constants";
import { AssignBeams } from "../assignBeams";
import { SearchClientBeams } from "../../clientBeams/searchClientBeams";


export class SearchClientLoomRow extends React.Component {
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    viewAddress = () => {
        const { data = {} } = this.props;
        const { client = {} } = data;
        const comProps = {
            data: client
        };
        this.POPUP.current.showPopUp(client.name, AddressViewer, 'bg-warning',
            {
                footer: "Notes: " + client.notes, modalProps: { size: 'lg', className: "bg-opacity-75 bg-dark" },
                props: comProps
            });
    }

    viewConsumption = () => {
        const { data = {} } = this.props;
        const { consumption = {} } = data;
        const { title } = consumption;
        let query = { onlyName: title };
        this.POPUP.current.showPopUp("Details of : " + title, SearchConsumption, 'bg-warning',
            {
                modalProps: { size: 'lg', className: "bg-opacity-75 bg-dark" },
                props: { query }
            });
    }

    onSuccess = (data) => {
        const { others = {} } = this.props;
        const { refresh } = others;
        const { result, message = "" } = data;
        if (result === RESULT_SUCCESS) {
            this.POPUP.current?.showSuccess("Success", "Style changed sucessfully", () => {
                if (refresh) {
                    refresh();
                }
            });
        } else if (result === RESULT_UNSUCCESS) {
            this.TOAST.current?.showMessage("Un Success", message);
        } else {
            this.TOAST.current?.showFailed("Unknown Error", message || "Something went wrong");
        }
    }

    onError = (err) => {
        this.TOAST.current?.showFailed("Error", "Something went wrong");
    }

    onStyleSelect = (sdata) => {
        const { data = {} } = this.props;
        const { id: clientLoomId, client: { id: clientId } = {} } = data;
        const { id: consumptionId } = sdata;
        const payload = { clientId, clientLoomId, consumptionId };
        fetch("/service/client_loom/changeconsumption", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }
        ).then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        }).then(this.onSuccess).catch(this.onError);
    }

    render() {
        const { serial, data = {}, others = {} } = this.props;
        const { needSelect = false, onSelect, onClose } = others;
        const { number, specsDetail = [], client: { name: cName } = {}, consumption = {}, id: loomId, clientId } = data;
        const { title: consumptionName } = consumption;
        const names = [];
        for (const { name, specGroup: { name: sgName } = {} } of specsDetail) {
            names.push(<span><strong>{sgName + ": "}</strong> {name + " "}</span>);
        }
        let action = [];
        if (needSelect) {
            action.push(<Button variant="primary" onClick={() => {
                if (onSelect) {
                    onSelect(data)
                }
                if (onClose) {
                    onClose();
                }
            }}>select</Button>);
        } else {
            if (consumptionName) {
                action.push(<button className="btn btn-sm btn-outline-primary ms-1 rounded-0" onClick={() => {
                    this.POPUP.current.showPopUp("Assign Beams for " + cName + " Loom " + number, AssignBeams, 'bg-warning',
                        {
                            modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" },
                            props: { clientLoom: data }
                        });
                }}>Assign Beams</button>);
                action.push(
                    <button className="btn btn-sm btn-outline-info ms-1 rounded-0" onClick={this.viewConsumption}>View Style</button>
                );
                action.push(<button className="btn btn-sm btn-outline-primary ms-1 rounded-0" onClick={() => {
                    this.POPUP.current.showPopUp("View running beam for " + cName + " Loom " + number, SearchClientBeams, 'bg-warning',
                        {
                            modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" },
                            props: { query: { clientId, loomId }, needSearch: false }
                        });
                }}>View Beams</button>);
            }
            action.push(
                <button className="btn btn-sm btn-outline-dark ms-1 rounded-0" onClick={() => {
                    this.POPUP.current.showPopUp("Change style for " + cName + " Loom " + number, SearchConsumption, 'bg-warning',
                        {
                            modalProps: { size: 'lg', className: "bg-opacity-75 bg-dark" },
                            props: { onSelect: this.onStyleSelect }
                        });
                }}>Change Style</button>
            );
        }
        return <tr>
            <td>{serial}</td>
            <td>
                <button className="btn btn-sm btn-outline-info bi bi-view-stacked me-1" onClick={this.viewAddress}></button>
                {cName}
            </td>
            <td>{number}</td>
            <td>{names.length > 0 ? names : "-"}</td>
            <td>{consumptionName || "-"}</td>
            <td className="text-end" style={{ "max-width": "150px" }}>{action}</td>
        </tr>;
    }
}

