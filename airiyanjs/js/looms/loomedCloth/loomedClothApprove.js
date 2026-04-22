import React from "react";
import { importASL, GetAslModules } from "../../utilities/utilities";
import { RESULT_INVALID, RESULT_SUCCESS, RESULT_UNSUCCESS } from "../../globals/constants";
import { positiveValidator, zeroOrPositiveValidator } from "../../utilities/validators";
import { LoomedClothSearch } from "./loomedClothSearch";

const TitledTextBox = GetAslModules("TitledTextBox");
const TitledDecimalTextBox = GetAslModules("TitledDecimalTextBox");
const TitledIntegerTextBox = GetAslModules("TitledIntegerTextBox");
const PostButton = GetAslModules("PostButton");

export class LoomedClothApprove extends React.Component {
    actualRef = React.createRef(null);
    properRef = React.createRef(null);
    damagedRef = React.createRef(null);
    properPieceRef = React.createRef(null);
    damagedPieceRef = React.createRef(null);
    wageRef = React.createRef(null);
    pickRef = React.createRef(null);
    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    getValue = () => {
        const { data } = this.props
        const actualLength = this.actualRef.current?.getValue() || 0;
        const properLength = this.properRef.current?.getValue() || 0;
        const damagedLength = this.damagedRef.current?.getValue() || 0;
        const properPiece = this.properPieceRef.current?.getValue() || 0;
        const damagedPiece = this.damagedPieceRef.current?.getValue() || 0;
        const cost = this.wageRef.current?.getValue() || 0;
        const actualPick = this.pickRef.current?.getValue() || 0;

        return {
            id: data.id,
            clientId: data.clientId,
            actualLength,
            properLength,
            damagedLength,
            properPiece: properPiece || 0,
            damagedPiece: damagedPiece || 0,
            cost,
            actualPick,
        };
    };

    validator = () => {
        const objs = [
            this.actualRef,
            this.properRef,
            this.damagedRef,
            this.properPieceRef,
            this.damagedPieceRef,
            this.wageRef,
            this.pickRef
        ]
        let res = true;
        for (const ob of objs) {
            if (!ob.current.isValid()) {
                res = false;
            }
        }
        return res;
    };

    onSuccess = (data) => {
        const { onSuccess, onClose } = this.props;
        const { result, message = "" } = data;
        if (result === RESULT_SUCCESS) {
            this.POPUP.current?.showSuccess("Success", "Inspection added successfully", () => { onSuccess?.(); onClose?.(); });
        } else if (result === RESULT_UNSUCCESS) {
            this.TOAST.current?.showMessage("Un Success", message);
        } else if (result === RESULT_INVALID) {
            this.TOAST.current?.showWarning("Invalid fields", message);
        } else {
            this.TOAST.current?.showFailed("Unknown Error", message || "Something went wrong");
        }
    };

    onError = () => {
        this.TOAST.current?.showFailed("Error", "Something went wrong");
    };

    properLengthValidator = (val) => {
        let res = false;
        if (zeroOrPositiveValidator(val) && this.actualRef.current.isValid()) {
            const actualLength = this.actualRef.current?.getValue();
            const damagedLength = this.damagedRef.current?.getValue();
            const currentVal = Number(val);
            res = actualLength === (damagedLength + currentVal);
            this.damagedRef.current.setValid(res);
        }
        return res;
    }

    damagedLengthLengthValidator = (val) => {
        let res = false;
        if (zeroOrPositiveValidator(val) && this.actualRef.current.isValid()) {
            const actualLength = this.actualRef.current?.getValue();
            const properLength = this.properRef.current?.getValue();
            const currentVal = Number(val);
            res = actualLength === (properLength + currentVal);
            this.properRef.current.setValid(res);
        }
        return res;
    }

    render() {
        const { data } = this.props;
        const { costType, clientLoom, loomedLength, cost, damageCost, consumption = {}, consumptionId, clientId } = data;
        const { pick } = consumption;
        let visibility = {}
        if (costType === "METER") {
            visibility = { display: "none" };
        }
        return <>
            <div className="row m-0 pb-1">
                <div className="col-3 p-0">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th colSpan={2} className="text-center">Received Detail</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><th>Client Name</th><td>{clientLoom?.client?.name}</td></tr>
                            <tr><th>Loom Number</th><td>{clientLoom?.number}</td></tr>
                            <tr><th>Length</th><td>{loomedLength}</td></tr>
                            <tr><th>Wage</th><td>{cost}</td></tr>
                            <tr><th>Damage cost</th><td>{damageCost}</td></tr>
                            <tr><th>Expected pick</th><td>{pick}</td></tr>
                        </tbody>
                    </table>
                </div>
                <div className="col p-0 px-1">
                    <div className="row mt-1">
                        <div className="col">
                            <TitledDecimalTextBox ref={this.actualRef} title="Actual Length" placeholder="Enter actual length" validator={positiveValidator} />
                        </div>
                    </div>
                    <div className="row mt-1">
                        <div className="col">
                            <TitledDecimalTextBox ref={this.properRef} title="Proper Length" placeholder="Enter proper length" validator={this.properLengthValidator} />
                        </div>
                    </div>
                    <div className="row mt-1">
                        <div className="col">
                            <TitledDecimalTextBox ref={this.damagedRef} title="Damaged Length" placeholder="Enter damaged length" validator={this.damagedLengthLengthValidator} />
                        </div>
                    </div>
                    <div className="row mt-1" style={visibility}>
                        <div className="col">
                            <TitledIntegerTextBox ref={this.properPieceRef} title="Proper Pieces" placeholder="Enter proper piece count" validator={zeroOrPositiveValidator} />
                        </div>
                    </div>
                    <div className="row mt-1" style={visibility}>
                        <div className="col">
                            <TitledIntegerTextBox ref={this.damagedPieceRef} title="Damaged Pieces" placeholder="Enter damaged piece count" validator={zeroOrPositiveValidator} />
                        </div>
                    </div>
                    <div className={"row mt-1"}>
                        <div className="col">
                            <TitledIntegerTextBox ref={this.pickRef} placeholder="Actual pick" value={pick} validator={positiveValidator} />
                        </div>
                    </div>
                    <div className={"row mt-1"}>
                        <div className="col">
                            <TitledDecimalTextBox ref={this.wageRef} placeholder="Wage" value={cost} validator={positiveValidator} />
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col text-end">
                            <PostButton url="/service/loomed_cloth/approve" valueGetter={this.getValue} validator={this.validator} onSuccess={this.onSuccess} onError={this.onError} variant="primary" text="Approve" />
                        </div>
                    </div>
                </div>
            </div>
            <hr />
            <div className="row m-0 pb-1">
                <div className="col text-end">
                    <LoomedClothSearch url="/service/loomed_cloth/searchforstyle" query={{ consumptionId, clientId }} />
                </div>
            </div>
        </>;
    }
}
