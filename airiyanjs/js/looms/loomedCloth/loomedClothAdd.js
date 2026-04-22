import React from "react";
import { importASL, GetAslModules } from "../../utilities/utilities";
import { RESULT_SUCCESS, RESULT_UNSUCCESS } from "../../globals/constants";
import { LoomPicker } from "../clientLoom/loomPicker";
import { MultiClientBeamSelect } from "../clientBeams/multiClientBeamSelect";
import { positiveValidator } from "../../utilities/validators";

const TitledDecimalTextBox = GetAslModules("TitledDecimalTextBox");
const PostButton = GetAslModules("PostButton");

export class LoomedClothAdd extends React.Component {
    loomRef = React.createRef(null);
    lengthRef = React.createRef(null);
    pieceRef = React.createRef(null);
    beamRef = React.createRef(null);

    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    getValue = () => {
        const { challanId } = this.props;
        const loomedLength = this.lengthRef.current?.getValue();
        const loomClient = this.loomRef.current?.getValue();
        const allBeams = this.beamRef.current.getValue();
        const beams = allBeams.map(b => b.id);
        return {
            clientId: loomClient.clientId,
            clientLoomId: loomClient.id,
            loomedLength,
            beams,
            challanId,
        };
    };

    validator = () => {
        const loomedLength = this.lengthRef.current?.getValue();
        if (!loomedLength || Number(loomedLength) <= 0) {
            this.TOAST.current?.showWarning("Invalid Length", "Enter valid loomed length");
            return false;
        }

        const allBeams = this.beamRef.current.getValue();
        if (!allBeams || allBeams.length < 1) {
            this.TOAST.current?.showWarning("No Beams Selected", "Select at least one beam");
            return false;
        }

        if (!this.beamRef.current.isValid()) {
            return false;
        }



        return true;
    };

    onSuccess = (data) => {
        const { onSuccess, onClose } = this.props;
        const { result, message = "" } = data;

        if (result === RESULT_SUCCESS) {
            this.POPUP.current?.showSuccess("Success", "Loomed cloth added successfully", () => {
                onSuccess && onSuccess();
                onClose && onClose();
            });
        } else if (result === RESULT_UNSUCCESS) {
            this.TOAST.current?.showMessage("Un Success", message);
        } else {
            this.TOAST.current?.showFailed("Unknown Error", message || "Something went wrong");
        }
    };

    onError = () => {
        this.TOAST.current?.showFailed("Error", "Something went wrong");
    };

    urlGetter = () => {
        const loom = this.loomRef.current?.getValue();
        return "/service/clientbeam/client/search/running/" + loom?.clientId;
    }

    queryGetter = () => {
        const loom = this.loomRef.current?.getValue();
        const { id, clientId } = loom || {};
        return { clientId, loomId: id };
    }

    onClientSelected = (clientLoom) => {
        this.setState({ clientLoom });
    }

    onLengthChange = () => {
        const { clientLoom } = this.state;
        let calculatedPiece = 0;
        if (clientLoom) {
            const { consumption: { sampledLength } = {} } = clientLoom;
            if (sampledLength && sampledLength > 0) {
                const length = this.lengthRef.current?.getValue();
                if (length > 0) {
                    calculatedPiece = length / sampledLength;
                }
            }
        }
        this.pieceRef.current?.setValue(calculatedPiece);
    }

    onPieceChange = () => {
        const { clientLoom } = this.state;
        let calculatedLength = 0;
        if (clientLoom) {
            const { consumption: { sampledLength } = {} } = clientLoom;
            if (sampledLength && sampledLength > 0) {
                const piece = this.pieceRef.current?.getValue();
                if (piece > 0) {
                    calculatedLength = piece * sampledLength;
                }
            }
        }
        this.lengthRef.current?.setValue(calculatedLength);
    }

    render() {
        const { query = {} } = this.props;
        const { clientLoom } = this.state;
        let pieceClass = "visually-hidden";
        let pieceLength = 0;
        if (clientLoom) {
            const { consumption: { costType, sampledLength } = {} } = clientLoom;
            if (costType === 'PIECE') {
                pieceClass = "";
                pieceLength = sampledLength;
            }
        }
        return (
            <div>
                <div className="row">
                    <div className="col">
                        <LoomPicker ref={this.loomRef} query={query} title="Select Loom" onSelect={this.onClientSelected} />
                    </div>
                </div>

                <div className="row mt-1">
                    <div className={"col-3 " + pieceClass}>
                        <TitledDecimalTextBox ref={this.pieceRef} positiveOnly={true} placeholder={"Number of piece (" + pieceLength + "m/piece)"} onChange={this.onPieceChange} />
                    </div>
                    <div className="col">
                        <TitledDecimalTextBox ref={this.lengthRef} positiveOnly={true} validator={positiveValidator} placeholder="Enter loomed length" onChange={this.onLengthChange} />
                    </div>
                </div>

                <div className="row mt-1">
                    <div className="col">
                        <MultiClientBeamSelect ref={this.beamRef} urlGetter={this.urlGetter} queryGetter={this.queryGetter} />
                    </div>
                </div>

                <div className="row mt-1">
                    <div className="col text-end">
                        <PostButton url="/service/loomed_cloth/add" valueGetter={this.getValue} validator={this.validator} onSuccess={this.onSuccess}
                            onError={this.onError} variant="primary" text="Add Cloth" />
                    </div>
                </div>
            </div>
        );
    }
}
