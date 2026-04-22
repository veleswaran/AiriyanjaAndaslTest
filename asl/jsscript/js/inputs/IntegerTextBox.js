import React from "react";
import { TextBox } from "./TextBox";

export class IntegerTextBox extends React.Component {
    decimalTextRef = React.createRef(null);
    constructor(props) {
        super(props);
    }

    onPaste = (e) => {
        const { positiveOnly = false } = this.props;
        const paste = (e.clipboardData || window.clipboardData).getData('text');
        if (positiveOnly) {
            if (!(/^\d+$/.test(pastedText))) {
                e.preventDefault();
            }
        } else {
            // Allow only valid integer format (optional minus at start, digits only)
            if (!(/^[-]?\d+$/.test(paste))) {
                e.preventDefault();
            }
        }
    }

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
        // Allow minus sign only at the beginning
        if (e.key === '-' && !positiveOnly) {
            const cursorPos = e.target.selectionStart;
            const value = e.target.value;
            if (cursorPos === 0 && !value.includes('-')) {
                return;
            }
        }
        // Block everything else
        e.preventDefault();
    }

    getValue = () => {
        return parseInt(this.decimalTextRef.current.getValue());
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
        const { name, validator, placeholder, onChange, value, disabled = false ,css = "", style = {}} = this.props;
        return (
            <TextBox class={(this.props.class || "")} ref={this.decimalTextRef} type="text" name={name}
                validator={validator} placeholder={placeholder} onChange={onChange}
                value={value} disabled={disabled} onKeyPress={this.onKeyPress} onPaste={this.onPaste}
                css={css} style={style}
            />
        );
    }
}