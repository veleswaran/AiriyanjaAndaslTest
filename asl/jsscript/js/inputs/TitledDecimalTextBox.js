import React from "react";
import { TitledTextBox } from "./TitledTextBox";

export class TitledDecimalTextBox extends React.Component {
    decimalTextRef = React.createRef(null);
    constructor(props) {
        super(props);
    }

    onPaste = (e) => {
        const { positiveOnly = false } = this.props;
        const pastedText = (e.clipboardData || window.clipboardData).getData('text').trim();
        // Regex: optional minus, digits, optional decimal and digits
        const decimalRegex = positiveOnly
            ? /^\d+(\.\d+)?$/           // e.g. 123, 45.67
            : /^-?\d+(\.\d+)?$/;        // e.g. -123, -0.5, 3.14

        if (!decimalRegex.test(pastedText)) {
            e.preventDefault(); // Block invalid paste
        }
    };

    onKeyPress = (e) => {
        const { positiveOnly = false } = this.props;
        const isModifierKey = e.ctrlKey || e.metaKey || e.altKey;
        // Allow all modifier shortcuts (e.g. Ctrl+C, Ctrl+V, Cmd+R)
        if (isModifierKey) return;
        // Allow navigation and editing keys
        const allowedKeys = [
            'Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab', 'Enter', 'Home', 'End'
        ];
        if (allowedKeys.includes(e.key)) return;
        // Allow fu nction keys (F1–F12)
        if (/^F\d{1,2}$/.test(e.key)) return;
        // Allow digits
        if (/^\d$/.test(e.key)) return;
        const cursorPos = e.target.selectionStart;
        const value = e.target.value;
        // Allow minus sign only at the beginning
        if (e.key === '-' && !positiveOnly) {
            if (cursorPos === 0 && !value.includes('-')) {
                return;
            }
        }
        if (e.key === '.') {
            if (!value.includes('.') && cursorPos !== 0) return;
        }
        // Block everything else
        e.preventDefault();
    }

    getValue = () => {
        return Number(this.decimalTextRef.current.getValue());
    }

    setValue = (value) => {
        this.decimalTextRef.current.setValue(value);
    }

    setValid = (valid) => {
        return this.decimalTextRef.current.setValid(valid);
    }

    isValid = () => {
        return this.decimalTextRef.current.isValid();
    }

    render() {
        const { name, validator, placeholder, step, onChange, value, disabled = false } = this.props;
        return (
            <TitledTextBox class={(this.props.class || "")} ref={this.decimalTextRef} type="text" name={name}
                validator={validator} placeholder={placeholder} step={(step || ".01")} onChange={onChange}
                value={value} disabled={disabled} onKeyPress={this.onKeyPress} onPaste={this.onPaste}
            />
        );
    }
}