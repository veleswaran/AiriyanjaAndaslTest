import React from "react";
import { IdentifierSearch } from "./identifierSearch";
import { GetAslModules, importASL } from "../../utilities/utilities";
import { uuidv4 } from "../../utilities/uuidv4";
import { PickerButton } from "../../common/pickerButton";
import { alphaNumericValidator, numberValidator } from "../../utilities/validators";

const TitledTextBox = GetAslModules("TitledTextBox");
const MultiRender = GetAslModules("MultiRender");

export class SelectIdentifier extends React.Component {
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
            this.TOAST.current.showWarning("Cannot add", "Identifier already added");
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

    setValue = (identifiers = []) => {
        this.multiRef.current.clear();
        identifiers.forEach(idnt => {
            this.onSelect(idnt)
        });
    }

    render() {
        const { disabled = false, uuid } = this.state;
        const { css: { head = "", body = "" } = {} } = this.props;
        return (<>
            <thead key={uuid + "th"} className={head}>
                <tr>
                    <th>Select identifier</th>
                    <th className="text-end">
                        <PickerButton disabled={disabled} css="btn btn-sm btn-outline-primary bi bi-plus" searchComponent={IdentifierSearch} onSelect={this.onSelect}
                            modalProps={{ size: "xl", css: { footer: "visually-hidden" } }} title="Select identifier" />
                    </th>
                </tr>
                <tr className="table-group-divider"><th className="text-secondary">Value</th><th className="text-end text-secondary">Action</th></tr>
            </thead>
            <tbody key={uuid + "tb"} className={body}>
                <MultiRender ref={this.multiRef} onUpdate={this.onUpdate} component={IdentifierRow} />
            </tbody>
        </>);
    }
}

class IdentifierRow extends React.Component {
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
        return { id, name: this.textRef.current.getValue() };
    }

    validator = (data) => {
        const { data: { dataType } = {} } = this.props;
        if (data === null || data === '' || data.trim() === '' || data.trim() !== data || data.length > 100) {
            return false;
        }
        switch (dataType) {
            case "NUMBER":
                return numberValidator(data);
            case "ALPHA_NUMERIC":
                return alphaNumericValidator(data);
        }
        return true;
    }

    render() {
        const { data = {}, onClose } = this.props;
        const { name } = data;
        return <tr>
            <td>
                <TitledTextBox ref={this.textRef} value={data.data} placeholder={name} validator={this.validator} />
            </td>
            <td className="text-end" style={{ verticalAlign: "middle" }}>
                <button className="btn btn-sm btn-outline-danger bi bi-x-lg" onClick={onClose}></button>
            </td>
        </tr>
    }
}
