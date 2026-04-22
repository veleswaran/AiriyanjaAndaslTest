import React from "react";
import { uuidv4 } from "../utilities/uuidv4";

export class TitledTextArea extends React.Component {
    constructor(props) {
        super(props);
        const { value = "", disabled = false } = this.props;
        this.state = { value, uuid: uuidv4(), validClass: "", disabled };
    }

    changeValue = (evt) => {
        this.state.value = evt.target.value;
        if (this.props.onChange) {
            this.props.onChange(evt.target.value, evt.target);
        }
        this.isValid();
    }

    getValue = () => {
        return this.state.value;
    }

    setValue = (value) => {
        this.setState({ value });
    }

    setValid = (valid) => {
        this.setState({ validClass: valid ? "is-valid" : "is-invalid" });
    }

    setDisabled = (disabled) => {
        this.setState({ disabled });
    }

    isValid = () => {
        const { validator } = this.props;
        const { value } = this.state;
        var res = true;
        if (validator) {
            res = validator(value) ? res : false;
        }
        this.setState({ validClass: res ? "is-valid" : "is-invalid" });
        return res;
    }

    render() {
        const { uuid, validClass, disabled } = this.state;
        const { rows, cols, placeholder, name, value } = this.props;

        return (<div class="form-floating mt-1" >
            <textarea key={uuid}
                class={validClass + " form-control " + (this.props.class || "")} value={value}
                disabled={disabled} name={name} placeholder={placeholder} rows={rows}
                cols={cols} onChange={this.changeValue} id={uuid}
            />
            <label for={uuid} > {placeholder}</label>
        </div>
        );
    }
}