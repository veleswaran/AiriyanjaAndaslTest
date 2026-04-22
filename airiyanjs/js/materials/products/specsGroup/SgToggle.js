import React from "react";
import { GetAslModules, importASL } from "../../../utilities/utilities";
import { RESULT_SUCCESS } from "../../../globals/constants";

const PostTButton = GetAslModules('PostTButton');

export class SgToggle extends React.Component {
    toggleRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST } = await importASL();
        this.TOAST = TOAST
    }

    textBuilder = (data) => {
        const { checked } = data;
        return checked ? "Yes" : "No";
    }

    valueGetter = () => {
        const { data = {} } = this.props;
        const { id } = data;
        return { id, enabled: this.toggleRef.current.getValue() };
    }

    onError = (err) => {
        const { data = {} } = this.props;
        const { checked } = data;
        this.toggleRef.current.setValue(checked);
        this.TOAST.current?.showFailed("Somthing went wrong", "Unable to change the state");
    }

    onSuccess = (responseData) => {
        const { result, message } = responseData;
        const { data = {} } = this.props;
        const { checked } = data;
        if (result === RESULT_SUCCESS) {
            this.TOAST.current.showSuccess("Success", "State changed successfully");
        } else {
            this.toggleRef.current.setValue(checked);
            this.TOAST.current?.showFailed("Somthing went wrong", message);
        }
    }

    render() {
        const { url, data } = this.props;
        const { checked } = data;
        return (<PostTButton lvarient="me-1 text-dark d-none" ref={this.toggleRef} checked={checked} text={this.textBuilder} valueGetter={this.valueGetter} url={url} onError={this.onError} onSuccess={this.onSuccess} />);
    }
}