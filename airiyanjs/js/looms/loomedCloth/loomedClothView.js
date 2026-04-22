import React from "react";
import { importASL } from "../../utilities/utilities";
import { convertToIST } from "../../utilities/timeUtils";
import ViewConsumptionPopup from "../consumptions/view/viewConsumptionPopup";
import { getWeftName } from "../utilities/utilities";

export class LoomedClothViewer extends React.Component {

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    viewStyle = () => {
        const { data = {} } = this.props;
        const { consumption = {} } = data;
        this.POPUP.current.showPopUp(`${consumption["title"]} - Style detail`, ViewConsumptionPopup, "bg-warning", { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark", css: { body: "p-0", footer: "visually-hidden" } }, props: { data: consumption } });
    }

    styleFunc = () => {
        const { data = {} } = this.props;
        const { status } = data;
        if (status === "REMOVED" || status === "CANCELLED") {
            return "text-decoration-line-through";
        }
        return "";
    }


    render() {
        const { data = {} } = this.props;
        const { clientLoom = {}, details = [], consumption = {} } = data;

        return (
            <div className="container-fluid p-0">
                <table className={"table table-sm m-0 table-striped table-bordered table-hover " + this.styleFunc()}>
                    <thead>
                        <tr>
                            <th colSpan={2}>Client</th>
                            <th colSpan={2}>
                                <div className="d-flex justify-content-between">
                                    <span className="fw-bold">Style</span>
                                    <button type="button" className="btn btn-sm btn-outline-secondary bi bi-eye-fill" onClick={this.viewStyle}></button>
                                </div>

                            </th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        <tr>
                            <td>Name</td><td>{clientLoom.client.name}</td>
                            <td>Name</td><td>{consumption.title}</td>
                        </tr>
                        <tr>
                            <td>Loom No</td><td>{clientLoom.number}</td>
                            <td>Reed</td><td>{consumption.reed}</td>
                        </tr>
                        <tr>
                            <td>Status</td><td>{data.status}</td>
                            <td>Pick</td><td>{consumption.pick}</td>
                        </tr>
                        <tr>
                            <td>Received At</td><td>{convertToIST(data.createdTime)}</td>
                            <td>Width</td><td>{consumption.width} inch</td>
                        </tr>
                    </tbody>
                    <thead>
                        <tr>
                            <th colSpan={2}>Received Details </th>
                            <th colSpan={2}>Inspected Details </th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        <tr>
                            <td>Loomed Length</td><td>{data.loomedLength} m</td>
                            <td>Actual Length</td><td>{data.actualLength} m</td>
                        </tr>
                        <tr>
                            <td></td><td></td>
                            <td>Proper Length</td><td>{data.properLength} m</td>
                        </tr>
                        <tr>
                            <td></td><td></td>
                            <td>Damaged Length</td><td>{data.damagedLength} m</td>
                        </tr>
                        {
                            data.costType === "PIECE" ?
                                <>
                                    <tr>
                                        <td></td><td></td>
                                        <td>Proper piece</td><td>{data.properPiece ? data.properPiece : "-"}</td>
                                    </tr>
                                    <tr>
                                        <td></td><td></td>
                                        <td>damaged piece</td><td>{data.damagedPiece ? data.damagedPiece : "-"}</td>
                                    </tr>
                                </> : <></>
                        }
                    </tbody>
                    <thead>
                        <tr>
                            <th colSpan={2}>Wage Details </th>
                            <th colSpan={2}>Calculated Wage</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        <tr>
                            <td>Cost</td><td className="text-lowercase">₹ {data.cost} / {data.costType}</td>
                            <td>Credit</td><td className="text-success"><strong>₹ {data.creditAmount}</strong></td>
                        </tr>
                        <tr>
                            <td>Damaged Cost</td><td className="text-lowercase">₹ {data.damageCost} / {data.costType}</td>
                            <td>Debit</td><td>₹ {data.debitAmount}</td>
                        </tr>
                    </tbody>
                </table>
                <table className="table table-sm m-0 table-striped table-hover mb-2">
                    <thead>
                        <tr>
                            <th colSpan={5} className="bg-info-subtle">Consumption Details</th>
                        </tr>
                        <tr>
                            <th colSpan={5}>Beam</th>
                        </tr>
                        <tr>
                            <th>#</th>
                            <th>UID</th>
                            <th>Group</th>
                            <th>Ends</th>
                            <th>Consumes</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {details.filter(d => d.infoType === "BEAM").map((row, i) => (
                            <tr key={row.id}>
                                <td>{i + 1}</td>
                                <td>{row.clientBeam?.beam.uid}</td>
                                <td>{row.clientBeam?.beam.group.name}</td>
                                <td>{row.clientBeam.beam.threadCount}</td>
                                <td>{row.consumes} m</td>
                            </tr>
                        ))}
                    </tbody>
                    <thead>
                        <tr>
                            <th colSpan={5}>Weft</th>
                        </tr>
                        <tr>
                            <th>#</th>
                            <th colSpan={2}>Specification</th>
                            <th colSpan={2}>Consumes</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {details.filter(d => d.infoType === "WEFT").map((row, i) => (
                            <tr key={row.id}>
                                <td>{i + 1}</td>
                                <td colSpan={2}>{getWeftName(row.clientWeft.weft)}</td>
                                <td colSpan={2}>{row.consumes} kg</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}
