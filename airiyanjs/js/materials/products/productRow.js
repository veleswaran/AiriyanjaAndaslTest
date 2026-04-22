import React from "react";
import { getIdnColumns, getProductSpec, getSpecsColumns, getTaxColumn } from "./utilities";
import { Button } from "react-bootstrap";
import { StockChanger } from "./search/stockChanger";
import { GetAslModules, importASL } from "../../utilities/utilities";
import { RESULT_SUCCESS } from "../../globals/constants";
import { uuidv4 } from "../../utilities/uuidv4";
import { TaxCell, TaxEditor } from "./search/taxCell";
import { NotesViewer } from "./settings/notesAdder";
import { ProductViewer } from "./productViewer";
import { ProductEdit } from "./productEdit";
import { lowStockSetter } from "./settings/lowStockSetter";


const EditBox = GetAslModules("EditBox");
const TitledDecimalTextBox = GetAslModules("TitledDecimalTextBox");

export class ProductRow extends React.Component {
    editRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    onPriceSuccess = (rData) => {
        const { result, message } = rData;
        if (result === RESULT_SUCCESS) {
            const { data = {} } = this.props;
            const numeric = this.editRef.current?.getValue();
            data.price = numeric;
            this.editRef.current.setValue(numeric);
            this.editRef.current.onCancel();
            this.setState({ upid: uuidv4() });
            this.TOAST.current?.showSuccess("Success", "Price edited Sucessfully");
        } else {
            this.TOAST.current?.showFailed("Unable edit", message || "Unknown error");
        }
    }

    editGetVal = () => {
        const { data: { id } = {} } = this.props;
        const numeric = this.editRef.current?.getValue();
        return { id, numeric };
    }

    getPriceEdit = () => {
        const { data = {} } = this.props;
        const { price } = data;
        const textInputProps = {
            placeholder: "price",
            positiveOnly: true,
        };
        const postProps = {
            url: "/service/product/setprice",
            onError: (err) => { this.TOAST.current.showFailed("Somthing went wrong", "unable to edit price"); },
            onSuccess: this.onPriceSuccess,
            valueGetter: this.editGetVal
        };
        return <EditBox ref={this.editRef} value={price} css="input-group-sm" label={""} textInput={TitledDecimalTextBox} textInputProps={textInputProps} postProps={postProps} />
    }

    conditionalElem = () => {
        const { data = {}, others = {} } = this.props;
        const { price } = data;
        const { needSelect = false, onSelect, onClose, businessData } = others;
        let action = "";
        let priceSection = price;
        if (needSelect) {
            action = <>
                <Button size="sm" variant="primary" onClick={(e) => { onSelect?.(data); e.target.classList.toggle('visually-hidden'); }}>Add</Button>
                <Button size="sm" className="ms-1" variant="secondary" onClick={() => { onSelect?.(data); onClose?.(); }}>select</Button>
            </>;

        } else {
            action = [
                <button key="details" className="btn btn-sm btn-outline-secondary bi bi-gear-wide-connected" onClick={() => {
                    this.POPUP.current.showPopUp(`PID ${data.localId} - Details`, ProductViewer, "bg-warning", { modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark p-0", css: { body: "p-0 mb-1", footer: "visually-hidden" } }, props: { data } });
                }} />,
                <button key="copy" className="btn btn-sm btn-outline-primary bi bi-copy ms-1" onClick={() => {
                    this.POPUP.current.showPopUp(`Copy ${data.localId} Product`, ProductEdit, "bg-warning", { modalProps: { size: 'lg', className: "bg-opacity-75 bg-dark", css: { footer: "visually-hidden" } }, props: { data, onSuccess: others.onSuccess, businessData } });
                }} title="Copy Product" />
            ];
            priceSection = this.getPriceEdit();
        }

        return { action, priceSection };
    }

    render() {
        const { preProcessData: { specsKeys } = {}, data = {}, serial, others = {} } = this.props;
        const { localId, type, unit: { name: unitName } = {} } = data;
        const { needSelect = false } = others;
        const { productName, specsColumn } = getProductSpec(data);
        const { action, priceSection } = this.conditionalElem();
        return <tr>
            <th>{serial}</th>
            <td>{localId}</td>
            <td>{productName}</td>
            {getSpecsColumns(specsKeys, specsColumn)}
            <td>{unitName}</td>
            <td><StockChanger data={data} needEdit={!needSelect} /></td>
            <td style={{ "width": "180px" }}>{priceSection}</td>
            <TaxCell data={data} needEdit={!needSelect} />
            <td className="text-end">{action}</td>
        </tr>
    }
}