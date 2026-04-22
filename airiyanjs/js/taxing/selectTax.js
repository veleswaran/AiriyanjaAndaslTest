import React from "react";
import { TaxSearch } from "./taxSearch";
import { GetAslModules, importASL } from "../utilities/utilities";
import { uuidv4 } from "../utilities/uuidv4";
import { PickerButton } from "../common/pickerButton";

const TitledDecimalTextBox = GetAslModules("TitledDecimalTextBox");
const MultiRender = GetAslModules("MultiRender");

export class SelectTax extends React.Component {
    multiRef = React.createRef(null);
    constructor(props) {
        super(props)
        this.state = { uuid: uuidv4() };
    }

    async componentDidMount() {
        const { POPUP, TOAST } = await importASL();
        this.POPUP = POPUP;
        this.TOAST = TOAST;
    }

    setDisabled = (disabled) => {
        this.setState({ disabled });
    }

    onUpdate = () => {
        const { onUpdate } = this.props;
        if (onUpdate) {
            onUpdate();
        }
    }

    onSelect = (data) => {
        const { onChange } = this.props;
        const { id } = data;
        const allLis = this.multiRef.current.getValue();
        let canAdd = true;
        for (const ex of allLis) {
            if (id === ex.id) {
                canAdd = false;
                break;
            }
        }
        if (canAdd) {
            this.multiRef.current.add({ props: { data } });
            onChange?.();
        } else {
            this.TOAST.current.showWarning("Cannot add", "Tax is already added");
        }
    }

    getValue = () => {
        return this.multiRef.current.getValue();
    }

    clear = () => {
        this.multiRef.current.clear();
    }

    isValid = () => {
        return this.multiRef.current.isValid();
    }

    setValue = (taxes = []) => {
        this.multiRef.current.clear();
        const seenIds = new Set();
        taxes.forEach(tax => {
            const taxId = tax?.id;
            if (taxId && !seenIds.has(taxId)) {
                seenIds.add(taxId);
                this.multiRef.current.add({ props: { data: tax } });
            }
        });
    }

    render() {
        const { disabled = false, uuid } = this.state;
        const { css: { head = "", body = "" } = {} } = this.props;
        return (<>
            <thead key={uuid + "th"} className={head}>
                <tr>
                    <th>Add Tax</th>
                    <th className="text-end">
                        <PickerButton disabled={disabled} css="btn btn-sm btn-outline-primary bi bi-plus" searchComponent={TaxSearch} onSelect={this.onSelect}
                            modalProps={{ size: "xl", css: { footer: "visually-hidden" } }} title="Select Tax" />
                    </th>
                </tr>
                <tr className="table-group-divider"><th className="text-secondary">Value</th><th className="text-end text-secondary">Action</th></tr>
            </thead>
            <tbody key={uuid + "tb"} className={body}>
                <MultiRender ref={this.multiRef} onUpdate={this.onUpdate} component={TaxRow} />
            </tbody>
        </>);
    }
}

class TaxRow extends React.Component {
    textRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    isValid = () => {
        return this.textRef.current.isValid();
    }

    getValue = () => {
        const { data = {} } = this.props;
        const { id } = data;
        return { id, count: this.textRef.current.getValue() };
    }

    validator = (data) => {
        let nval = Number(data);
        return nval >= 0 && nval <= 100;
    }

    render() {
        const { data = {}, onClose } = this.props;
        const { type } = data;
        return <tr>
            <td>
                <TitledDecimalTextBox ref={this.textRef} value={data.percent} positiveOnly={true} placeholder={type} validator={this.validator} />
            </td>
            <td className="text-end" style={{ verticalAlign: "middle" }}>
                <button className="btn btn-sm btn-outline-danger bi bi-x-lg" onClick={onClose}></button>
            </td>
        </tr>
    }
}
