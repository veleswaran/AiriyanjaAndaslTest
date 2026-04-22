import React from "react";

import { PostButton } from "../buttons/PostButton"

export class EditBox extends React.Component {
    textRef = React.createRef(null)
    constructor(props) {
        super(props)
        const { value } = props;
        this.state = { editing: false, value, isDisabled: false };
    }

    onEditClick = () => {
        this.setState({ editing: true });
    }

    onCancel = () => {
        this.setState({ editing: false });
    }

    onDisabled = (isDisabled) => {
        this.setState({ isDisabled });
    }

    getValue = () => {
        return this.textRef.current?.getValue();
    }

    setValue = (value) => {
        this.setState({ value });
    }

    render() {
        const { label, textInput, textInputProps = {}, postProps, css } = this.props;
        const { value, editing, isDisabled } = this.state;
        let content = [];
        if (editing) {
            content = [
                React.createElement(textInput, { ref: this.textRef, ...textInputProps, value }),
                <button disabled={isDisabled} className="btn btn-secondary btn-md bi bi-x" onClick={this.onCancel}></button>,
                <PostButton {...postProps} css="btn btn-primary btn-md bi bi-check" onDisabled={this.onDisabled} />
            ];
        } else {
            content = [
                <div className="input-group-text">{value + (label ? " " + label : "")}</div>,
                <button className="btn btn-secondary bi bi-pencil-fill" onClick={this.onEditClick}></button>
            ];
        }
        return (
            <div className={css ? ("input-group " + css) : "input-group w-100 mx-auto p-0"}>
                {content}
            </div>
        );
    }
}

