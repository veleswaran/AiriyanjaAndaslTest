import React from "react";
import { importASL } from "../utilities/utilities";


export class PickerButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = { data: null, validCss: "" };
    }

    async componentDidMount() {
        const { POPUP } = await importASL();
        this.POPUP = POPUP;
    }

    getValue = () => {
        const { data } = this.state;
        return data;
    }

    isValid = () => {
        const { data } = this.state;
        const valid = data !== null;
        this.setState({ validCss: valid ? "" : "btn-outline-danger" });
        return valid;
    }

    onSelect = (data) => {
        const { onSelect } = this.props;
        this.setState({ data }, () => {
            this.isValid();
            onSelect?.(data);
        });
    }

    setValue = (data) => {
        this.setState({ data }, () => {
            this.isValid();
        });
    }

    showSearch = () => {
        const { title = "select data", searchComponent, searchProps = {}, modalProps } = this.props;
        this.POPUP.current?.showPopUp(title, searchComponent, "", { modalProps: { className: "bg-opacity-75 bg-dark", css: { body: "p-0 pt-1", footer: "visually-hidden" }, ...modalProps }, props: { ...searchProps, onSelect: this.onSelect } },);
    }

    render() {
        const { validCss } = this.state;
        const { css = "btn btn-outline-primary bi bi-hand-index-thumb-fill", cssPlus = "", disabled = false } = this.props;
        return <button disabled={disabled} className={css + " " + cssPlus + " " + validCss} onClick={this.showSearch} />
    }
}
