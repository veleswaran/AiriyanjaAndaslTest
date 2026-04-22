import React from "react";
import { formateAmount } from "../../utilities/uiUtils";


export class LedgerView extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { data = {} } = this.props;
        const { ledger = [], amount = 0 } = data;
        if (ledger.length > 0) {

        }
        return <table className="table table-striped table-bordered">
            <thead>
                <tr><td>Account</td><td>Amount</td></tr>
                <tr><th colSpan={2} className="text-center">Main Ledger</th></tr>
                <tr><th>Main</th><td>{formateAmount(amount)}</td></tr>
            </thead>
            <thead className={ledger.length > 0 ? "" : "visually-hidden"}>
                <tr><th colSpan={2} className="text-center">Other Ledger</th></tr>
            </thead>
            <tbody className={ledger.length > 0 ? "" : "visually-hidden"}>
                {ledger.map((ld, idx) => {
                    const { name, amount } = ld;
                    return <tr key={idx}><th>{name}</th><td>{formateAmount(amount)}</td></tr>
                })}
            </tbody>
        </table>
    }
}
