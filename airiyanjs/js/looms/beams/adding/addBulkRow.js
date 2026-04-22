import React from "react";
import { GetAslModules } from "../../../utilities/utilities";
import { BeamGroupPickerMini } from "../../beamgroups/beamGroupPicketMini";

const TitledTextBox = GetAslModules("TitledTextBox");
const TitledDecimalTextBox = GetAslModules("TitledDecimalTextBox");
const TitledIntegerTextBox = GetAslModules("TitledIntegerTextBox");

export class AddBulkRow extends React.Component {
    numberRef = React.createRef(null);
    lengthRef = React.createRef(null);
    widthRef = React.createRef(null);
    threadCountRef = React.createRef(null);
    groupRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    zeroValidator = (data) => {
        if (data === null || data <= 0) {
            return false;
        }
        return true;
    }

    isValid = () => {
        const group = this.groupRef.current.getValue();
        return this.lengthRef.current.isValid() && this.widthRef.current.isValid() && this.threadCountRef.current.isValid() && this.numberRef.current.isValid() && group != null && Object.keys(group).length !== 0;
    }

    getValue = () => {
        const length = this.lengthRef.current.getValue();
        const width = this.widthRef.current.getValue();
        const threadCount = this.threadCountRef.current.getValue();
        const number = this.numberRef.current.getValue();
        const group = this.groupRef.current.getValue();
        const { id: beamGroupId } = group;
        return { length, width, threadCount, number, beamGroupId };
    }


    render() {
        const { data: { length, width, threadCount, number, group } } = this.props
        return <div className="row mt-1 gap-1">
            <div className="col p-0">
                <TitledIntegerTextBox ref={this.numberRef} placeholder="Number" value={number} positiveOnly={true} validator={this.zeroValidator} />
            </div>
            <div className="col p-0">
                <TitledDecimalTextBox ref={this.lengthRef} placeholder="Length (Metre)" value={length} positiveOnly={true} validator={this.zeroValidator} />
            </div>
            <div className="col p-0">
                <TitledDecimalTextBox ref={this.widthRef} placeholder="width (Metre)" value={width} positiveOnly={true} validator={this.zeroValidator} />
            </div>
            <div className="col p-0">
                <TitledIntegerTextBox ref={this.threadCountRef} placeholder="Number of thread" value={threadCount} positiveOnly={true} validator={this.zeroValidator} />
            </div>
            <div className="col p-0 align-content-center">
                <BeamGroupPickerMini ref={this.groupRef} data={group} css="h-100" />
            </div>
        </div>;
    }
}