import React from "react";
import { GetAslModules, importASL } from "../../../utilities/utilities";
import { RESULT_SUCCESS } from "../../../globals/constants";

const TitledTextArea = GetAslModules("TitledTextArea");
const PostButton = GetAslModules("PostButton");

export class LoomedClothCancel extends React.Component {
    noteRef = React.createRef(null)
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    notesvalidator = (value) => {
        if (value === null || value === "" || value.trim() === "") {
            return false;
        }
        return true;
    }
    valueGetter = () => {
        const { data } = this.props;
        const { id, clientId } = data;
        const notes = this.noteRef.current?.isValid();
        return { id, clientId, notes };
    }
    render() {
        const { onSuccess, onClose, action } = this.props;
        const cancelProps = {
            url: "/service/loomed_cloth/cancel",
            onError: () => {
                this.TOAST.current.showFailed("Something went wrong", "Unable to cancel the loomed cloth");
            },
            validator: () => { return this.noteRef.current?.isValid() },
            onSuccess: (data) => {
                if (data.result === RESULT_SUCCESS) {
                    this.TOAST.current.showSuccess("Success", "Loomed cloth cancelled successfully");
                    onSuccess?.();
                    onClose?.();
                } else {
                    this.TOAST.current.showFailed("Error", data.message);
                }
            },
            valueGetter: this.valueGetter,
        };
        return <div className="row gap-1">
            <div className="row">
                <div className="col">
                    <TitledTextArea ref={this.noteRef} placeholder="Cancel reason" validator={this.notesvalidator} />
                </div>
            </div>
            <div className="row">
                <div className="col text-end">
                    <PostButton key="cancel" varient="outline-danger" {...cancelProps} needConfirmation confirmMessage={"Are you sure to " + action + " this Loomed cloth?"}>{action}</PostButton>
                </div>
            </div>
        </div>
    }
}