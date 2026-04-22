import React from "react";
import { GetAslModules } from "../../utilities/utilities";
import { objectToArray } from "../../utilities/objectUtils";
import { ADDRESS_GROUP, CONTACT_GROUP, LOCATION_GROUP } from "../../clients/utilities";
import { convertToIST } from "../../utilities/timeUtils";

const MultiRender = GetAslModules("MultiRender");

export class ViewDc extends React.Component {
    rowsRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const { data = {} } = this.props;
        const { details = [] } = data;
        for (const detail of details) {
            this.rowsRef.current.add({ props: { detail } })
        }
    }

    render() {
        const { data = {} } = this.props;
        const { type } = data;
        return <table className="align-middle table table-striped table-bordered table-sm">
            <thead>
                <tr>
                    <td colSpan={5} className="text-center">
                        <h4><strong>{type === "RETURN" ? "Return Challen" : "Delivery Challen"}</strong></h4>
                    </td>
                </tr>
                <tr>
                    <td colSpan={5} className="p-0">
                        <ViewClientDetail data={data} />
                    </td>
                </tr>
                <tr>
                    <th className="text-center">#</th>
                    <th>Type</th>
                    <th>Details</th>
                    <th>Quantity</th>
                </tr>
            </thead>
            <tbody>
                <MultiRender ref={this.rowsRef} component={ViewDcRow} />
            </tbody>
        </table>
    }

}

class ViewDcRow extends React.Component {
    constructor(props) {
        super(props)
    }


    getBeamRow = () => {
        const { serial, detail = {} } = this.props;
        const { type, units, beamDetail: { threadCount = 0, uid, group: { name: bgName } = {}, number = "-" } = {}, clientBeamDetail = {} } = detail;
        return <tr>
            <td>{serial}</td>
            <td>{type}</td>
            <td>{"uid/number : " + uid + "/" + number + ", Group : " + bgName + ", Ends: " + threadCount}</td>
            <td>{units + " metre"}</td>
        </tr>
    }

    getWeftRow = () => {
        const { serial, detail = {} } = this.props;
        const { type, units, weftDetail: { specDetails = [] } = {}, clientWeftDetail = {} } = detail;
        const names = [];
        for (const { name, specGroup: { name: sgName } = {} } of specDetails) {
            names.push(<span>{sgName + " : " + name + " "}</span>);
        }
        return <tr>
            <td>{serial}</td>
            <td>{type}</td>
            <td>{names}</td>
            <td>{units + " Kg"}</td>
        </tr>
    }

    getEmptyBeamRow = () => {
        const { serial, detail = {} } = this.props;
        const { type, units } = detail;
        return <tr>
            <td>{serial}</td>
            <td>{type}</td>
            <td>{ }</td>
            <td>{units + " No"}</td>
        </tr>
    }

    render() {
        const { serial, detail = {} } = this.props;
        const { type, units, beamDetail = {}, clientBeamDetail = {} } = detail;
        switch (type) {
            case "BEAM":
                return this.getBeamRow();
                break;
            case "WEFT":
                return this.getWeftRow();
                break;
            case "EMPTY_BEAM":
                return this.getEmptyBeamRow();
                break;
        }
        return <tr>
            <td>{serial}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
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

    buildBillDetail = () => {
        const { data: { number, status, type, createdTime = "" } = {} } = this.props;
        const res = [
            [<td>No</td>, <td>:</td>, <td>{number}</td>],
            [<td>Date</td>, <td>:</td>, <td>{convertToIST(createdTime)}</td>],
            [<td>Status</td>, <td>:</td>, <td>{status}</td>],
        ];
        return res;
    }

    getEmpty = (current, max) => {
        return new Array(max - current).fill([<td></td>, <td></td>, <td></td>]);
    }

    render() {
        const { data = {} } = this.props;
        const { clientDetail } = data
        let billedTo = this.buildClientData(clientDetail);
        let billDetail = this.buildBillDetail();
        const maxSize = Math.max(billedTo.length, billDetail.length);
        billedTo.push(...this.getEmpty(billedTo.length, maxSize));
        billDetail.push(...this.getEmpty(billDetail.length, maxSize));
        const rows = [];
        for (let index = 0; index < maxSize; index++) {
            const row = <tr>{billedTo[index]}{billDetail[index]}</tr>
            rows.push(row);
        }
        return (
            <table className="table table-sm m-0 table-striped table-group-divider table-bordered">
                <thead>
                    <tr>
                        <th colSpan={3}>To :</th>
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