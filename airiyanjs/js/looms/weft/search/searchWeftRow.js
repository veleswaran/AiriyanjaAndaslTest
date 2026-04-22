import React from "react";
import { Button } from "react-bootstrap";
import { RESULT_SUCCESS } from "../../../globals/constants";
import { GetAslModules } from "../../../utilities/utilities";
import { StockChanger } from "../../../common/components/stockChanger/StockChanger";

export class SearchWeftRow extends React.Component {
    editRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    onSuccess = (rData) => {
        const { data: { stock } = {}, result, message } = rData;
        if (result === RESULT_SUCCESS) {
            const { data = {} } = this.props;
            data.stock = stock;
            this.editRef.current.setValue(stock);
            this.editRef.current.onCancel();
            this.setState({ upid: uuidv4() });
            this.TOAST.current?.showSuccess("Success", "Edited Sucessfully");
        } else {
            this.TOAST.current?.showFailed("Unable edit", message || "Unknown error");
        }
    }

    editGetVal = () => {
        const { data: { id } = {} } = this.props;
        const numeric = this.editRef.current?.getValue();
        return { id, numeric };
    }

    editValidator = () => {
        const numeric = this.editRef.current?.getValue();
        if (!numeric || numeric <= 0) {
            this.TOAST.current?.showWarning("invalid value", "Stock value is invalid");
            return false;
        }
        return true;
    }

    getConsumeEdit = () => {
        const { data = {}, others = {} } = this.props;
        const { specDetails = [], stock } = data
        const { needSelect = false } = others;
        if (!needSelect) {
            const postConstructor = (data, stockVal) => {
                const { id } = data;
                const { numeric, string } = stockVal;
                return { id, numeric, string };
            }
            const processLabel = (data) => {
                const { stock } = data;
                return stock + " Kg"
            }
            const onSuccess = (newData, OldData) => {
                OldData.stock = newData.stock;
            }
            const specName = specDetails.map(spc => { return spc.name + " " + spc.specGroup.name }).join(", ");
            const increment = {
                url: "/service/weft/stock/add",
                buttonText: "Add Stock",
                title: "Add stock for " + specName,
                postConstructor
            }
            const decrement = {
                url: "/service/weft/stock/reduce",
                buttonText: "Reduce Stock",
                title: "Reduce stock for " + specName,
                postConstructor
            }
            return <StockChanger unitName="Kg" processLabel={processLabel} increment={increment} decrement={decrement} data={data} needEdit={true} onSuccess={onSuccess} />;
        }
        return stock + " Kg";
    }

    render() {
        const { serial, data = {}, preProcessData: { keys = [] } = {}, others = {} } = this.props;
        const { needSelect = false, onSelect, onClose } = others;
        const { stock = 0, specDetails = [] } = data;
        const preRows = [];
        const specMap = new Map();
        for (const spec of specDetails) {
            const { specGroup: { name: sName } = {}, name = "" } = spec;
            specMap.set(sName, name);
        }
        for (const key of keys) {
            preRows.push(<td>{specMap.has(key) ? specMap.get(key) : ""}</td>);
        }
        let action = "";
        if (needSelect) {
            action = <Button variant="primary" onClick={() => {
                if (onSelect) {
                    onSelect(data)
                }
                if (onClose) {
                    onClose();
                }
            }}>select</Button>
        }
        return (
            <tr>
                <td>{serial}</td>
                {preRows}
                <td style={{ "width": "180px" }}>{this.getConsumeEdit()}</td>
                <td>{action}</td>
            </tr>
        );
    }
}