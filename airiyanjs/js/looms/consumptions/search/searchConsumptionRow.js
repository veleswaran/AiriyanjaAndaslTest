import React from "react";
import { uuidv4 } from "../../../utilities/uuidv4";
import { Button } from "react-bootstrap";
import { importASL } from "../../../utilities/utilities";
import ViewConsumptionPopup from "../view/viewConsumptionPopup";


export class SearchConsumptionRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = { uid: uuidv4() };
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    viewDetails = () => {
        const { data = {} } = this.props;
        const { title = "" } = data;
        this.POPUP.current.showPopUp(`${title} - Style detail`, ViewConsumptionPopup, "bg-warning", { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark", css: { body: "p-0", footer: "visually-hidden" } }, props: { data } });
    }

    render() {
        const { uid } = this.state;
        const { serial, data = {}, others = {} } = this.props;
        const { needSelect = false, onSelect, onClose } = others;
        const { title = "", pick = "", sampledLength = "", width = "", reed = "", cost = "", damageCost = "-", costType = "", beams = [], wefts = [] } = data;
        const bms = [];
        for (const { requiredNumber, requiredThread, requredWidth, beamGroup: { name } } of beams) {
            bms.push(
                <tr>
                    <td>{name}</td>
                    <td>{requiredNumber}</td>
                    <td>{requiredThread}</td>
                    <td>{requredWidth}</td>
                </tr>
            )
        }
        const wfts = [];
        for (const { consumes, weft: { specDetails = [] } } of wefts) {
            const names = [];
            for (const { name, specGroup: { name: sgName } = {} } of specDetails) {
                names.push(<span><strong>{sgName + ": "}</strong> {name + " "}</span>);
            }
            wfts.push(
                <tr>
                    <td>{names}</td>
                    <td>{consumes}</td>
                </tr>
            )
        }
        let action = [
            <button type="button" className="btn btn-sm btn-outline-secondary me-1" onClick={this.viewDetails} >view</button>
        ];
        if (needSelect) {
            action.push(<Button size="sm" variant="primary" onClick={() => {
                if (onSelect) {
                    onSelect(data)
                }
                if (onClose) {
                    onClose();
                }
            }}>select</Button>);
        }
        return [
            <tr key={uid + "_1"}>
                <td>{serial}</td>
                <td>{title}</td>
                <td>{pick}</td>
                <td>{sampledLength}</td>
                <td>{width}</td>
                <td>{reed}</td>
                <td>{costType}</td>
                <td>{cost}</td>
                <td>{damageCost}</td>
                <td>{action}</td>
            </tr>
        ]
    }
}