import React from "react";
import { ClientPicker } from "../../clients/clientPicker";
import { importASL, GetAslModules } from "../../utilities/utilities";
import { MultiBeamSelect } from "../beams/multiBeamSelect";
import { WeftSelect } from "../weft/weftSelect";
import { RESULT_SUCCESS, RESULT_UNSUCCESS } from "../../globals/constants";

const TitledTextArea = GetAslModules("TitledTextArea");
const PostButton = GetAslModules("PostButton");

export class AddDc extends React.Component {
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
        const clientDetails = this.clientRef.current?.getValue();
        const { clientId, id: clientDetailId } = clientDetails;
        const allBeams = this.beamRef.current.getValue();
        const allWefts = this.weftRef.current.getValue();
        const not = this.notesRef.current.getValue() || "";
        const details = [];
        for (const bm of allBeams) {
            const { id, length = 0, loomedLength = 0 } = bm;
            details.push({ type: "BEAM", units: length - loomedLength, beamId: id, weftId: 0 });
        }
        for (const wft of allWefts) {
            const { weftId, consumes } = wft;
            details.push({ type: "WEFT", units: consumes, beamId: 0, weftId: weftId });
        }
        return { details, clientId, clientDetailId, notes: [not] };
    }

    validator = () => {
        const clientDetails = this.clientRef.current?.getValue();
        if (!clientDetails) {
            this.TOAST.current?.showWarning("Client Not selected", "Please select client");
            return false;
        }
        const allBeams = this.beamRef.current.getValue();
        const allWefts = this.weftRef.current.getValue();
        if (allBeams.length <= 0 && allWefts.length <= 0) {
            this.TOAST.current?.showWarning("Details Not selected", "Weft and beam details are not selected select either one");
            return false;
        }
        if ((allBeams.length > 0 && !this.beamRef.current.isValid()) || (allWefts.length > 0 && !this.weftRef.current.isValid())) {
            return false;
        }
        return true;
    }

    onSuccess = (rdata) => {
        const { onSuccess, onClose } = this.props;
        const { result, message = "", data } = rdata;
        if (result === RESULT_SUCCESS) {
            const { id } = data;
            this.POPUP.current?.showSuccess("Success", "DC added to client", () => {
                window.open("/loom/printdc?dcid=" + id, "_blank");
                if (onSuccess || onClose) {
                    onSuccess?.();
                    onClose?.();
                } else {
                    window.location.reload();
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
        const { baseUrl = "/service/client", clientType = "PURCHASE", businessData = {} } = this.props;
        return <div className="row m-0 container mx-auto">
            <div className="col">
                <div className="row">
                    <div className="col">
                        <ClientPicker ref={this.clientRef} url={`${baseUrl}/${clientType}/search`} baseUrl={baseUrl} clientType={clientType} businessData={businessData} />
                    </div>
                </div>
                <div className="row mt-1">
                    <div className="col">
                        <MultiBeamSelect ref={this.beamRef} />
                    </div>
                </div>
                <div className="row mt-1">
                    <div className="col">
                        <WeftSelect ref={this.weftRef} title="select weft" />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <TitledTextArea ref={this.notesRef} placeholder="Notes" />
                    </div>
                </div>
                <div className="row mt-1">
                    <div className="col text-end">
                        <PostButton url="/service/dc/delivery/add" valueGetter={this.getValue} validator={this.validator}
                            onSuccess={this.onSuccess} onError={this.onError} variant="primary" text="Add Dc" />
                    </div>
                </div>
            </div>
        </div>;
    }
}