import React from "react";
import { ClientPicker } from "../../clients/clientPicker";
import { importASL, GetAslModules } from "../../utilities/utilities";
import { MultiClientBeamSelect } from "../clientBeams/multiClientBeamSelect";
import { ClientWeftSelect } from "../clientWeft/clientWeftSelect";
import { RESULT_SUCCESS, RESULT_UNSUCCESS } from "../../globals/constants";
import { EmptyBeamsSearch } from "../emptyBeams/EmptyBeamsSearch";

const TitledTextArea = GetAslModules("TitledTextArea");
const PostButton = GetAslModules("PostButton");
const TitledIntegerTextBox = GetAslModules("TitledIntegerTextBox");

export class AddRc extends React.Component {
    clientRef = React.createRef(null);
    beamRef = React.createRef(null);
    weftRef = React.createRef(null);
    notesRef = React.createRef(null);
    emptyBeamsSearchRef = React.createRef(null);
    emptyBeamRef = React.createRef(null);
    constructor(props) {
        super(props)
        this.state = {};
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    onClientSelected = (selected, client) => {
        this.setState({ client: selected });
        this.emptyBeamsSearchRef.current.onSelected(selected, client)
    }

    onClientReset = () => {
        this.beamRef.current?.clear();
        this.weftRef.current?.clear();
        this.setState({ client: null });
    }

    getValue = () => {
        const clientDetails = this.clientRef.current?.getValue();
        const { clientId, id: clientDetailId } = clientDetails;
        const allBeams = this.beamRef.current.getValue();
        const allWefts = this.weftRef.current.getValue();
        const not = this.notesRef.current.getValue() || "";
        const details = [];
        for (const bm of allBeams) {
            const { id, receivedLength = 0, loomedLength = 0 } = bm;
            details.push({ type: "BEAM", units: receivedLength - loomedLength, beamId: id, weftId: 0 });
        }
        for (const wft of allWefts) {
            const { weftId, consumes } = wft;
            details.push({ type: "WEFT", units: consumes, beamId: 0, weftId: weftId });
        }
        if (this.emptyBeamRef.current.getValue() > 0) {
            details.push({ type: "EMPTY_BEAM", units: this.emptyBeamRef.current.getValue(), beamId: 0, weftId: 0 });
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
        if (allBeams.length <= 0 && allWefts.length <= 0 && this.emptyBeamRef.current.getValue() <= 0) {
            this.TOAST.current?.showWarning("Details Not selected", "Weft, beam or empty beam details are not selected select atleast one");
            return false;
        }
        if ((allBeams.length > 0 && !this.beamRef.current.isValid()) || (allWefts.length > 0 && !this.weftRef.current.isValid())) {
            return false;
        }
        return true;
    }

    onSuccess = (rdata) => {
        const { onSuccess, onClose } = this.props;
        const { result, message = "", data = {} } = rdata;
        if (result === RESULT_SUCCESS) {
            const { id } = data;
            this.POPUP.current?.showSuccess("Success", "RC added to client", () => {
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

    clientBeamQueryGetter = () => {
        const { client: { clientId } = {} } = this.state;
        return { clientId };
    }

    onEmptyBeamSelected = (data) => {
        this.emptyBeamRef.current?.setValue(data.emptyCount);
    }

    render() {
        const { client = null } = this.state;
        const { baseUrl = "/service/client", clientType = "PURCHASE", businessData = {} } = this.props;
        const hiddingClass = client === null ? "visually-hidden" : "";
        return <div className="row m-0 container mx-auto">
            <div className="col">
                <div className="row">
                    <div className="col">
                        <ClientPicker ref={this.clientRef} url={`${baseUrl}/${clientType}/search`} baseUrl={baseUrl} clientType={clientType} businessData={businessData} onSelect={this.onClientSelected} onReset={this.onClientReset} />
                    </div>
                </div>
                <div className={"row mt-1 " + hiddingClass}>
                    <div className="col">
                        <MultiClientBeamSelect ref={this.beamRef} url="/service/clientbeam/search/IN_STOCK" queryGetter={this.clientBeamQueryGetter} />
                    </div>
                </div>
                <div className={"row mt-1 " + hiddingClass}>
                    <div className="col">
                        <ClientWeftSelect ref={this.weftRef} title="select client weft" getClient={() => client} />
                    </div>
                </div>
                <div className={"row mt-1 " + hiddingClass}>
                    <div className="col">
                        <TitledIntegerTextBox ref={this.emptyBeamRef} placeholder="Empty Beam" />
                    </div>
                </div>
                <div className={"row mt-1 " + hiddingClass}>
                    <div className="col">
                        <EmptyBeamsSearch ref={this.emptyBeamsSearchRef} needSearch={false} isPopUp={true} onSelect={this.onEmptyBeamSelected} />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <TitledTextArea ref={this.notesRef} placeholder="Notes" />
                    </div>
                </div>
                <div className="row mt-1">
                    <div className="col text-end">
                        <PostButton url="/service/dc/return/add" valueGetter={this.getValue} validator={this.validator}
                            onSuccess={this.onSuccess} onError={this.onError} variant="primary" text="Add Rc" />
                    </div>
                </div>
            </div>
        </div>;
    }
}