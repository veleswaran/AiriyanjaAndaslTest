import React from "react";
import { GetAslModules, importASL } from "../../utilities/utilities";
import { percentageValidator } from "../../utilities/validators";
import { RESULT_SUCCESS } from "../../globals/constants";
import { uuidv4 } from "../../utilities/uuidv4";

const EditBox = GetAslModules("EditBox");
const TitledDecimalTextBox = GetAslModules("TitledDecimalTextBox");

export class ViewPurpose extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { data = {}, css = "", style = {} } = this.props;
        return <table className={"table table-bordered " + css} style={style}>
            <tbody>
                <tr>
                    <th>Name</th>
                    <td>{data.name || "-"}</td>
                </tr>
                <tr>
                    <th>Deductions</th>
                    <td className="p-0">
                        {data.deductions && data.deductions.length > 0 ? <table className="table m-0">
                            <thead>
                                <tr><th>Name</th><th>Percentage</th></tr>
                            </thead>
                            <tbody>
                                {data.deductions.map((ded, idx) => <DeductionRow key={idx} data={ded} />)}
                            </tbody>
                        </table> : "-"}
                    </td>
                </tr>
            </tbody>
        </table>
    }
}

class DeductionRow extends React.Component {
    editRef = React.createRef(null);
    constructor(props) {
        super(props)
    }
    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    onPriceSuccess = (rData) => {
        const { result, message, data } = rData;
        if (result === RESULT_SUCCESS) {
            const { percentage } = data;
            const { data: propsData = {} } = this.props;
            propsData.percentage = percentage;
            this.editRef.current.setValue(percentage);
            this.editRef.current.onCancel();
            this.setState({ upid: uuidv4() });
            this.TOAST.current?.showSuccess("Success", "Percentage edited Sucessfully");
        } else {
            this.TOAST.current?.showFailed("Unable edit", message || "Unknown error");
        }
    }

    editGetVal = () => {
        const { data: { id, purposeId } = {} } = this.props;
        const numeric = this.editRef.current?.getValue();
        return { id, purposeId, percentage: numeric };
    }

    getPercentageEdit = () => {
        const { data = {} } = this.props;
        const { percentage } = data;
        const textInputProps = {
            placeholder: "%",
            positiveOnly: true,
            validator: percentageValidator
        };
        const postProps = {
            url: "/service/purpose_deduction/setpercentage",
            onError: (err) => { this.TOAST.current.showFailed("Somthing went wrong", "unable to change percentage"); },
            onSuccess: this.onPriceSuccess,
            valueGetter: this.editGetVal
        };
        return <EditBox ref={this.editRef} value={percentage} css="input-group-sm" label={""} textInput={TitledDecimalTextBox} textInputProps={textInputProps} postProps={postProps} />
    }
    render() {
        const { data = {} } = this.props;
        return <tr>
            <td>{data.name || "-"}</td>
            <td style={{ maxWidth: "150px" }}>{this.getPercentageEdit()}</td>
        </tr>
    }
}
