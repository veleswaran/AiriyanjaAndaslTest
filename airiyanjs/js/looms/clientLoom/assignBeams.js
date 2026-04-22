import React from "react";
import { MultiClientBeamSelect } from "../clientBeams/multiClientBeamSelect";
import { RESULT_SUCCESS, RESULT_UNSUCCESS } from "../../globals/constants";
import { importASL, GetAslModules } from "../../utilities/utilities";
import { ViewConsumptionBeam } from "../consumptions/viewConsumption";
import { SearchClientBeams } from "../clientBeams/searchClientBeams";

const PostButton = GetAslModules("PostButton");

export class AssignBeams extends React.Component {
    clientRef = React.createRef(null);
    beamRef = React.createRef(null);
    weftRef = React.createRef(null);
    notesRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    getValue = () => {
        const { clientLoom = {} } = this.props;
        const { id: clientLoomId, clientId } = clientLoom;
        const bms = this.beamRef.current.getValue();
        const clientBeamIds = [];
        for (const bm of bms) {
            const { id } = bm;
            clientBeamIds.push(id);
        }
        return { clientId, clientLoomId, clientBeamIds };
    }

    validator = () => {
        return this.beamRef.current.isValid();
    }

    onSuccess = (data) => {
        const { onSuccess, onClose } = this.props;
        const { result, message = "" } = data;
        if (result === RESULT_SUCCESS) {
            this.POPUP.current?.showSuccess("Success", "Beam assigned to loom", () => {
                if (onSuccess) {
                    onSuccess();
                }
                if (onClose) {
                    onClose();
                }
            });
        } else if (result === RESULT_UNSUCCESS) {
            this.TOAST.current?.showMessage("Un Success", message);
        } else {
            this.TOAST.current?.showFailed("Unknown Error", message || "Something went wrong");
        }
    }

    onError = (err) => {
        this.TOAST.current?.showFailed("Error", "Something went wrong");
    }

    render() {
        const { clientLoom = {} } = this.props;
        const { clientId, consumption, id } = clientLoom;
        const dComponent = [];
        if (consumption) {
            const { title = "-", beams } = consumption;
            dComponent.push(<div>Current Style :<strong>{title}</strong><ViewConsumptionBeam beams={beams} css="table-info" /></div>);
        }
        return <div className="row">
            <div className="col p-0">
                {dComponent}
                <div>
                    <MultiClientBeamSelect ref={this.beamRef} clientId={clientId} />
                </div>
                <div className="text-end mt-1">
                    <PostButton url="/service/clientbeam/assignLoom" valueGetter={this.getValue} validator={this.validator}
                        onSuccess={this.onSuccess} onError={this.onError} varient="primary" text="Assign Beam" />
                </div>
            </div>
        </div>;
    }
}