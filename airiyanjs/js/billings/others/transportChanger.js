import React from "react";
import { TransportPicker } from "../../clients/transportPicker";
import { GetAslModules, importASL } from "../../utilities/utilities";
import { RESULT_SUCCESS } from "../../globals/constants";

const PostButton = GetAslModules("PostButton");

export default class TransportChanger extends React.Component {
    transportPickerRef = React.createRef();
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    onSuccess = (data) => {
        const { onSuccess, onClose } = this.props;
        if (data.result === RESULT_SUCCESS) {
            this.TOAST.current.showSuccess("Success", "Transporter changed successfully");
            onSuccess?.();
            onClose?.();
        } else {
            this.TOAST.current.showFailed("Error", data.message);
        }
    }

    valueGetter = () => {
        const { billData = {} } = this.props;
        const { id: billId } = billData;
        return { billId, ...this.transportPickerRef.current?.getValue() };
    }

    validator = () => {
        return this.transportPickerRef.current?.isValid();
    }

    render() {
        const { css = "", style = {}, billData } = this.props;
        const { category } = billData;
        const changeProps = {
            url: `/service/billtransport/${category}/add`,
            onError: () => {
                this.TOAST.current.showFailed("Something went wrong", "Unable to change the transporter, try again later");
            },
            onSuccess: this.onSuccess,
            validator: this.validator,
            valueGetter: this.valueGetter,
        };
        return <div className={css} style={style}>
            <TransportPicker ref={this.transportPickerRef} isMandatory={true} />
            <div className="text-end mt-1">
                <PostButton key="cancel" {...changeProps} needConfirmation confirmMessage="Are you sure to Change the transporter?" variant="primary">Change</PostButton>
            </div>
        </div>
    }
}