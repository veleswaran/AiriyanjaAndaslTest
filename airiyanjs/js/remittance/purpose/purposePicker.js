import React from "react";
import { SearchPurpose } from "./searchPurpose";
import { PickerButton } from "../../common/pickerButton";
import { toCurrencyF } from "../../utilities/conversionutils";


export class PurposePicker extends React.Component {
    buttonRef = React.createRef(null)
    constructor(props) {
        super(props);
        this.state = { purpose: {}, validClass: "", amount: 0 };
    }

    isValid = () => {
        const vld = this.buttonRef.current.isValid();
        this.setState({ validClass: vld ? "" : "text-danger" });
        return vld;
    }

    setAmount = (amount) => {
        this.setState({ amount: Number(amount) });
    }

    onSelected = (data) => {
        const { onSelect } = this.props;
        this.setState({ purpose: data }, () => {
            onSelect?.(data);
            this.isValid();
        });
    }

    getValue = () => {
        const { purpose } = this.state
        return purpose;
    }

    render() {
        const { purpose: { name = "", deductions = [] } = {}, amount = 0 } = this.state;
        const { css = "d-flex flex-column", style = {} } = this.props;
        const deducts = [];
        let finalAmount = amount;
        for (const ded of deductions) {
            const { id, name, percentage, enabled } = ded;
            if (enabled) {
                const d = toCurrencyF(amount * percentage / 100);
                finalAmount -= d;
                deducts.push(<tr key={id}><td>{name}</td><td>{percentage}%</td><td className="text-end">{d}</td></tr>);
            }
        }
        const hiddenClass = deductions.length == 0 ? "visually-hidden" : "";
        return <div className={css} style={style}>
            <div>
                <table className="table">
                    <thead>
                        <tr><td colSpan={3} className="p-0">
                            <div className="d-flex">
                                <span className={`fw-bold align-content-center ${this.state.validClass}`}>Purpose :</span>
                                <span className="flex-fill ms-2 align-content-center">{name}</span>
                                <div>
                                    <PickerButton cssPlus="btn-sm" ref={this.buttonRef} searchComponent={SearchPurpose} onSelect={this.onSelected} modalProps={{ css: { body: "p-1" } }} title="Select Purpose" />
                                </div>
                            </div>
                        </td></tr>
                        <tr className={hiddenClass}><th className="text-secondary">Deductions</th><th className="text-secondary">Percentage</th><th className="text-secondary text-end">Amount</th></tr>
                    </thead>
                    <tbody className={hiddenClass}>
                        {deducts}
                    </tbody>
                    <tfoot className={hiddenClass}>
                        <tr><th colSpan={2} className="text-end">Payable Amount</th><th className="text-end">{finalAmount}</th></tr>
                    </tfoot>
                </table>
            </div>
        </div>;
    }
}