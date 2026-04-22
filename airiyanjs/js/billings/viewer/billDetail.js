import React from "react";
import { addSeperator, objectToArray } from "../../utilities/objectUtils";
import { ADDRESS_GROUP, LOCATION_GROUP, CONTACT_GROUP, MAJOR_ADDRESS_GROUP, MAIN_LOCATION_GROUP, CONTACT_GROUP_FOR_LOOM } from "../../clients/utilities";
import { convertToIST, convertToISTDate } from "../../utilities/timeUtils";

export class BillDetail extends React.Component {
    constructor(props) {
        super(props)
    }

    buildClientData = (billClient = {}) => {
        const { businessData: { category = "" } = {} } = this.props;
        const { detailData = {}, billingName = "" } = billClient
        const res = [];
        res.push(<td className="fw-semibold" colSpan={3}>{billingName}</td>)
        const address = objectToArray(detailData, MAJOR_ADDRESS_GROUP);
        const location = objectToArray(detailData, MAIN_LOCATION_GROUP);
        if (address) {
            for (let index = 0; index < address.length; index++) {
                const element = address[index];
                if (index === 0) {
                    res.push([<td>Address</td>, <td className="text-center">:</td>, <td>{element}</td>]);
                } else {
                    if (element !== "") {
                        res.push([<td></td>, <td className="text-center"></td>, <td>{element}</td>]);
                    }
                }
            }
        }
        if (location) {
            res.push([<td></td>, <td className="text-center"></td>, <td className="text-capitalize">{location.join(" , ")}</td>]);
        }
        const cg = category === "loom" ? CONTACT_GROUP_FOR_LOOM : CONTACT_GROUP;
        cg.forEach(key => {
            if (detailData[key]) {
                if (key === "GST") {
                    res.push([<td>GST</td>, <td className="text-center">:</td>, <td>{detailData[key]}</td>]);
                } else {
                    res.push([<td className="text-capitalize">{key.toLowerCase()}</td>, <td className="text-center">:</td>, <td>{detailData[key]}</td>]);
                }
            }
        });
        return res;
    }

    buildBillDetail = () => {
        const { data: { billNumber = "-", category, createdTime, billDate, status, vehicle, previousBill, transportation, eway } = {} } = this.props;
        let invtext = "";
        switch (category) {
            case "SALES":
                invtext = "Invoice";
                break;
            case "SALES_DC":
                invtext = "DC";
                break;
            case "PURCHASE":
                invtext = "Invoice";
                break;
            case "PURCHASE_DC":
                invtext = "DC";
                break;
            case "CREDIT_NOTE":
                invtext = "Credit Note";
                break;
            case "DEBIT_NOTE":
                invtext = "Debit Note";
                break;
        }
        const res = [
            [<td>{invtext} No</td>, <td className="text-center">:</td>, <td>{billNumber}</td>],
            [<td>{invtext} Date</td>, <td className="text-center">:</td>, <td>{(["PURCHASE", "PURCHASE_DC"].includes(category) && billDate) ? convertToISTDate(billDate) : convertToIST(createdTime)}</td>]
        ];
        if (previousBill) {
            const { billNumber: preBillNumber, createdTime: preCreatedTime } = previousBill;
            res.push([<td>Previous Bill No</td>, <td className="text-center">:</td>, <td>{preBillNumber}</td>]);
            res.push([<td>Previous Bill Date</td>, <td className="text-center">:</td>, <td>{convertToIST(preCreatedTime)}</td>]);
        }
        if (transportation) {
            const { vehicleNo, clientDetail } = transportation;
            if (vehicleNo) {
                res.push([<td>Vehicle</td>, <td className="text-center">:</td>, <td className="text-uppercase">{vehicleNo}</td>]);
            } else if (clientDetail) {
                const { billingName } = clientDetail;
                res.push([<td>Transporter</td>, <td className="text-center">:</td>, <td>{billingName}</td>]);
            }
            if (eway) {
                const { number } = eway;
                res.push([<td>E-Way Bill</td>, <td className="text-center">:</td>, <td>{number}</td>]);
            }
        }
        return res;
    }

    getEmpty = (current, max) => {
        return new Array(max - current).fill([<td></td>, <td></td>, <td></td>]);
    }

    render() {
        const { data = {} } = this.props;
        const { billClient, shipClient, category = "" } = data
        let billedTo = this.buildClientData(billClient);
        let shippedTo = this.buildClientData(shipClient);
        let billDetail = this.buildBillDetail();
        const maxSize = Math.max(billedTo.length, shippedTo.length, billDetail.length);
        billedTo.push(...this.getEmpty(billedTo.length, maxSize));
        shippedTo.push(...this.getEmpty(shippedTo.length, maxSize));
        billDetail.push(...this.getEmpty(billDetail.length, maxSize));
        const rows = [];
        for (let index = 0; index < maxSize; index++) {
            const row = <tr>{billedTo[index]}{shippedTo[index]}{billDetail[index]}</tr>
            rows.push(row);
        }
        const isPurchase = (category === "PURCHASE" || category === "PURCHASE_DC");
        return (
            <table className="table table-sm m-0 table-striped table-group-divider table-bordered">
                <thead>
                    <tr>
                        <th colSpan={3}>{isPurchase ? "Billed From :" : "Billed To :"}</th>
                        <th colSpan={3}>{isPurchase ? "Shipped From :" : "Shipped To :"}</th>
                        <th colSpan={3}>Other Details :</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }
}