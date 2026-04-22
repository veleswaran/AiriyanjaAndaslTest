import React from "react";
import { RESULT_SUCCESS } from "../../../globals/constants";
import { getQueryParam, importASL } from "../../../utilities/utilities";
import { ADDRESS_GROUP, CONTACT_GROUP, LOCATION_GROUP } from "../../../clients/utilities";
import { objectToArray } from "../../../utilities/objectUtils";
import { convertToIST } from "../../../utilities/timeUtils";

import("../../../css/print.css");

export class PrintClothChallan extends React.Component {
    constructor(props) {
        super(props)
        this.state = { data: null };
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
        const { challanId = 0 } = getQueryParam();
        const url = "/service/clothchallan/get";
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: challanId })
        }
        ).then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        }).then(this.processSuccess).catch(this.processError);
    }

    processError = (err) => {
        this.TOAST.current.showFailed("Somthing went wrong", "Unable to get challan details, try again later");
    }

    processSuccess = (rData) => {
        const { result, message, data = {} } = rData;
        if (result === RESULT_SUCCESS) {
            this.setState({ data });
        } else {
            this.TOAST.current?.showFailed("Unable get challan details", message || "Unknown error");
        }
    }

    render() {
        const { data } = this.state;
        if (data !== null) {
            return <PrintView data={data} />;
        }
        return "Loading...";
    }
}


class PrintView extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { data } = this.props;
        const { cloths = [], totalPayableCost, totalDamageCost, deduction, finalCost, deductionPercent, status } = data
        return <table className={"table table-bordered table-sm table-striped table-hover" + (status === 'CANCELLED' ? " text-decoration-line-through" : "")}>
            <thead>
                <tr><th className="text-center fs-3" colSpan={20}>Cloth Receipt</th></tr>
                <tr>
                    <td colSpan={20} className="p-0">
                        <ViewClientDetail data={data} />
                    </td>
                </tr>
                <tr className="text-center">
                    <td>#</td><td>Loom No</td><td colSpan={4}>Length</td><td colSpan={2}>Piece</td><td colSpan={2}>Cost</td><td colSpan={2}>Wage</td>
                </tr>
                <tr className="text-center">
                    <td></td> <td></td><td>Received</td><td>Actual</td><td>proper</td><td>Damaged</td><td>Proper</td><td>Damaged</td><td>For Good</td><td>For Damage</td><td>Credit</td><td>Debit</td>
                </tr>
            </thead>
            <tbody>
                {
                    cloths.map((cloth, index) => {
                        const { clientLoom, cost, costType, damageCost, loomedLength, actualLength, properLength, damagedLength, properPiece, damagedPiece, creditAmount, debitAmount, status } = cloth;
                        if (status === "RECEIVED" || status === "INSPECTED") {
                            return <tr key={index} className="text-center">
                                <th>{index + 1}</th>
                                <td>{clientLoom.number || "-"}</td>
                                <td>{loomedLength || "-"}</td>
                                <td>{actualLength || "-"}</td>
                                <td>{properLength || "-"}</td>
                                <td>{damagedLength || "-"}</td>
                                <td>{properPiece || "-"}</td>
                                <td>{damagedPiece || "-"}</td>
                                <td>{cost || "-"} / <span className="text-lowercase small">{costType}</span></td>
                                <td>{damageCost || "-"} / <span className="text-lowercase small">{costType}</span></td>
                                <td>{creditAmount || "-"}</td>
                                <td>{debitAmount || "-"}</td>
                            </tr>
                        }
                    })
                }
            </tbody>
            <tfoot>
                <tr className="text-center fw-semibold">
                    <td colSpan={2}></td>
                    <td colSpan={4}></td>
                    <td colSpan={2}></td>
                    <td colSpan={2} className="text-end">Total</td>
                    <td className="text-center">{totalPayableCost}</td>
                    <td className="text-center">{totalDamageCost}</td>
                </tr>
                <tr className="text-center fw-semibold">
                    <td colSpan={2}></td>
                    <td colSpan={4}></td>
                    <td colSpan={2}></td>
                    <td colSpan={2} className="text-end">Deduction {`(${deductionPercent}%)`}</td>
                    <td className="text-center">{deduction}</td>
                    <td className="text-center"></td>
                </tr>
                <tr className="text-center fw-bold">
                    <td colSpan={2}></td>
                    <td colSpan={4}></td>
                    <td colSpan={2}></td>
                    <td colSpan={2} className="text-end">final Amount</td>
                    <td className="text-center">{finalCost}</td>
                    <td className="text-center"></td>
                </tr>
            </tfoot>
        </table>
    }
}

class ViewClientDetail extends React.Component {
    constructor(props) {
        super(props)
    }

    buildClientData = (billClient = {}) => {
        const { detailData: data = {}, billingName = "" } = billClient
        const res = [];
        res.push(<td className="fw-semibold" colSpan={3}>{billingName}</td>)
        const address = objectToArray(data, ADDRESS_GROUP);
        const location = objectToArray(data, LOCATION_GROUP);
        if (address) {
            for (let index = 0; index < address.length; index++) {
                const element = address[index];
                if (index === 0) {
                    res.push([<td>Address</td>, <td>:</td>, <td>{element}</td>]);
                } else {
                    if (element !== "") {
                        res.push([<td></td>, <td>:</td>, <td>{element}</td>]);
                    }
                }

            }
        }
        if (location) {
            res.push([<td>Location</td>, <td>:</td>, <td className="text-capitalize">{location.join(" , ")}</td>]);
        }
        CONTACT_GROUP.forEach(key => {
            if (data[key]) {
                res.push([<td className="text-capitalize">{key.toLowerCase()}</td>, <td>:</td>, <td>{data[key]}</td>]);
            }
        });
        return res;
    }

    buildChallanDetail = () => {
        const { data: { number, createdTime = "", challanDate, status } = {} } = this.props;
        const res = [
            [<td>Number</td>, <td>:</td>, <td>{number}</td>],
            [<td>Date</td>, <td>:</td>, <td>{convertToIST(challanDate)}</td>],
            [<td>Entry time</td>, <td>:</td>, <td>{convertToIST(createdTime)}</td>],
            [<td>Status</td>, <td>:</td>, <td>{status}</td>],
        ];
        return res;
    }

    getEmpty = (current, max) => {
        return new Array(max - current).fill([<td></td>, <td></td>, <td></td>]);
    }

    render() {
        const { data = {} } = this.props;
        const { client: { details = [] } = {} } = data
        let billedTo = this.buildClientData(details[0]);
        let challanDetail = this.buildChallanDetail();
        const maxSize = Math.max(billedTo.length, challanDetail.length);
        billedTo.push(...this.getEmpty(billedTo.length, maxSize));
        challanDetail.push(...this.getEmpty(challanDetail.length, maxSize));
        const rows = [];
        for (let index = 0; index < maxSize; index++) {
            const row = <tr>{billedTo[index]}{challanDetail[index]}</tr>
            rows.push(row);
        }
        return (
            <table className="table table-sm m-0 table-striped table-group-divider table-bordered">
                <thead>
                    <tr>
                        <th colSpan={3}>From :</th>
                        <th colSpan={3}>Details :</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }
}
