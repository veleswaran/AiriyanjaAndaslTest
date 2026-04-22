import React from "react";
import { GetAslModules, importASL } from "../../../utilities/utilities";
import { RESULT_SUCCESS } from "../../../globals/constants";

const TitledTextBox = GetAslModules("TitledTextBox");
const PostButton = GetAslModules("PostButton");

export class NotesAdder extends React.Component {
    notesRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    validator = () => {
        const notes = this.notesRef.current.getValue();
        if (!notes || notes.length === 0) {
            this.TOAST.current.showWarning("Invalid Notes", "Please add notes");
            return false
        }
        return true;
    }

    getValue = () => {
        const { product: { id } = {} } = this.props;
        const notes = this.notesRef.current.getValue();
        return { id, notes };
    }

    onSuccess = (rData) => {
        const { product = {}, onClose } = this.props;
        const { result, message, data = {} } = rData;
        if (result === RESULT_SUCCESS) {
            this.TOAST.current?.showSuccess("Success", "Notes added SuccessFully");
            product.notes = data.notes;
            if (onClose) {
                onClose();
            }
        } else {
            this.TOAST.current?.showFailed("Unable to add Notes", message || "Unknown error");
        }
    }

    onError = (err) => {
        this.TOAST.current.showFailed("Somthing went wrong", "Unable to add notes try again later");
    }


    render() {
        return <>
            <div><TitledTextBox ref={this.notesRef} placeholder="Notes" /></div>
            <div className="text-end mt-1">
                <PostButton url={"/service/product/notes"} valueGetter={this.getValue} validator={this.validator}
                    onSuccess={this.onSuccess} onError={this.onError} variant="primary" text="Add" />
            </div>
        </>;
    }
}