import React from "react";
import { importASL, GetAslModules } from "../../utilities/utilities";
import { BeamGroupsSeleter } from "./beamGroupsSelecter";
import { WeftSelect } from "../weft/weftSelect";
import { RESULT_SUCCESS } from "../../globals/constants";
import { RadioGroup } from "../../common/radioGroup";

const TitledTextBox = GetAslModules("TitledTextBox");
const TitledDecimalTextBox = GetAslModules("TitledDecimalTextBox");
const TitledIntegerTextBox = GetAslModules("TitledIntegerTextBox");
const PostButton = GetAslModules("PostButton");

export class AddConsumption extends React.Component {
    titleRef = React.createRef(null);
    pickRef = React.createRef(null);
    sampleLengthRef = React.createRef(null);
    widthRef = React.createRef(null);
    reedRef = React.createRef(null);
    beamsRef = React.createRef(null);
    weftsRef = React.createRef(null);
    costTypeRef = React.createRef(null);
    costRef = React.createRef(null);
    damagecostRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST
        this.POPUP = POPUP
    }

    titleValidater = (data) => {
        if (data === null || data === '' || data.trim() === '' || data.trim() !== data) {
            return false;
        }
        return true;
    }

    pickValidator = (data) => {
        if (data === null || data < 1) {
            return false;
        }
        return true;
    }

    getValue = () => {
        const title = this.titleRef.current.getValue();
        const pick = this.pickRef.current.getValue();
        const sampledLength = this.sampleLengthRef.current.getValue();
        const width = this.widthRef.current.getValue();
        const reed = this.reedRef.current.getValue();
        const beams = this.beamsRef.current.getValue();
        const wefts = this.weftsRef.current.getValue();
        const { selected: costType } = this.costTypeRef.current.getValue();
        const cost = this.costRef.current.getValue();
        const damageCost = this.damagecostRef.current.getValue() || 0;
        return { title, pick, sampledLength, width, reed, costType, cost, damageCost, beams, wefts };
    }

    validator = () => {
        const allRefs = [this.titleRef, this.pickRef, this.sampleLengthRef, this.widthRef, this.reedRef, this.beamsRef, this.weftsRef, this.costTypeRef, this.costRef, this.damagecostRef];
        let canProceed = true;
        for (const rf of allRefs) {
            if (!rf.current.isValid()) {
                canProceed = false;
            }
        }
        return canProceed;
    }

    onSuccess = (rData) => {
        const { onSuccess, onClose } = this.props;
        const { result, message, data = {} } = rData;
        if (result === RESULT_SUCCESS) {
            if (onSuccess) {
                onSuccess(data);
            }
            if (onClose) {
                onClose();
            }
            this.POPUP.current?.showSuccess("Success", "Style added successfully", () => {
            });
        } else {
            this.TOAST.current?.showFailed("Unable to add it", message || "Unknown error");
        }
    }

    onError = (err) => {
        this.TOAST.current.showFailed("Somthing went wrong", "Unable to add Style. try again later");
    }

    render() {
        return <div className="row gap-1">
            <div className="row p-0 m-0">
                <div className="col">
                    <TitledTextBox ref={this.titleRef} placeholder="Style title" validator={this.titleValidater} />
                </div>
            </div>
            <div className="row p-0 m-0">
                <div className="col">
                    <TitledDecimalTextBox ref={this.sampleLengthRef} placeholder="Sampled/Piece Length (Metre)" validator={this.pickValidator} />
                </div>
            </div>
            <div className="row p-0 m-0">
                <div className="col">
                    <TitledDecimalTextBox ref={this.widthRef} placeholder="Width (inch)" validator={this.pickValidator} />
                </div>
            </div>
            <div className="row p-0 m-0">
                <div className="col">
                    <TitledIntegerTextBox ref={this.pickRef} placeholder="Pick" validator={this.pickValidator} />
                </div>
            </div>
            <div className="row p-0 m-0">
                <div className="col">
                    <TitledDecimalTextBox ref={this.reedRef} placeholder="Reed" validator={this.pickValidator} />
                </div>
            </div>
            <div className="row p-0 m-0">
                <div className="col">
                    <RadioGroup ref={this.costTypeRef} title="Wage Per" radios={["METER", "PIECE"]} />
                </div>
            </div>
            <div className="row p-0 m-0">
                <div className="col">
                    <TitledDecimalTextBox ref={this.costRef} placeholder="Cost per Metre/piece" validator={this.pickValidator} />
                </div>
            </div>
            <div className="row p-0 m-0">
                <div className="col">
                    <TitledDecimalTextBox ref={this.damagecostRef} placeholder="Damaged cost per Metre/piece" />
                </div>
            </div>
            <div className="row p-0 m-0">
                <div className="col">
                    <BeamGroupsSeleter ref={this.beamsRef} />
                </div>
            </div>
            <div className="row p-0 m-0">
                <div className="col">
                    <WeftSelect ref={this.weftsRef} />
                </div>
            </div>
            <div className="row p-0 m-0">
                <div className="col text-end">
                    <PostButton url="/service/consumptions/add" valueGetter={this.getValue} validator={this.validator} onSuccess={this.onSuccess} onError={this.onError} variant="primary" text="Add Style" />
                </div>
            </div>
        </div>;
    }

}

