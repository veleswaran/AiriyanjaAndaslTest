import React from "react";
import { NotesAdder } from "./settings/notesAdder";
import { importASL } from "../../utilities/utilities";
import { LowStockSetter } from "./settings/lowStockSetter"
import { PRODUCT_TYPE } from "../../enums/materialEnums";

export class ProductViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { units: {} };
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    showAddNotes = () => {
        const { data = {} } = this.props;
        const { localId } = data;
        this.POPUP.current?.showPopUp("Add notes for PID : " + localId, NotesAdder, "", { modalProps: { className: "bg-opacity-75 bg-dark p-0", css: { body: "p-1", footer: "visually-hidden" } }, props: { product: data } });
    }

    getOtherTables = (rows = [], title = "", c1Title = "", c2Title = "") => {
        if (rows.length > 0) {
            return <>
                <thead><tr><th colSpan={5}>{title}</th></tr></thead>
                <tbody>
                    <tr><th></th><th>{c1Title}</th><th colSpan={4}>{c2Title}</th></tr>
                    {rows}
                </tbody>
            </>
        }
        return [];
    }

    getOthers = () => {
        const { data } = this.props;
        const { localId, commodity = {}, unit = {}, productSpecs = [], productIdentifiers = [], productTax = [], price, stock, type, notes = [], packageUnit, category } = data;
        let needOthers = packageUnit || type === PRODUCT_TYPE.STOCKED || category;
        return <><thead className={!needOthers ? "d-none" : ""}><tr><th colSpan={5}>Others</th></tr></thead>
            <tbody className={!needOthers ? "d-none" : ""}>
                {
                    packageUnit ? <tr><td></td><td>Packaging Unit</td><td colSpan={3}>{packageUnit.name}</td></tr> : ""
                }
                {
                    type === PRODUCT_TYPE.STOCKED ? <tr><td></td><td>Low stock limit</td><td colSpan={3}><LowStockSetter data={data} /></td></tr> : ""
                }
                {
                    category ? <tr><td></td><td>Category</td><td colSpan={3}>{category}</td></tr> : ""
                }
            </tbody></>
    }

    render() {
        const { data } = this.props;
        const { localId, commodity = {}, unit = {}, productSpecs = [], productIdentifiers = [], productTax = [], price, stock, type, notes = [], packageUnit } = data;
        const cName = commodity.name || "";
        const uName = unit.name || "";
        const specsRows = [];
        for (const spc of productSpecs) {
            const { specs: { name = "", specGroup: { name: sgName = "" } = {} } = {} } = spc;
            specsRows.push(<tr><td></td><td>{sgName}</td><td colSpan={3}>{name}</td></tr>);
        }
        const identifierRows = []
        for (const identi of productIdentifiers) {
            const { data = "", identifier: { name = "" } = {} } = identi;
            identifierRows.push(<tr><td></td><td>{name}</td><td colSpan={3}>{data}</td></tr>);
        }
        const taxRows = [];
        for (const tx of productTax) {
            const { percent, tax: { type = "" } = {} } = tx;
            taxRows.push(<tr><td></td><td>{type}</td><td colSpan={3}>{percent} %</td></tr>);
        }
        const notesRows = [];
        for (const note of notes) {
            notesRows.push(<tr><td></td><td colSpan={4}>{note}</td></tr>);
        }
        notesRows.reverse();
        return (
            <table className="table table-sm m-0 table-striped table-bordered">
                <thead><tr><th colSpan={5}>Commodity</th></tr></thead>
                <tbody>
                    <tr><th>PID</th><th>Name</th><th>Price</th><th>Type</th><th>Stock</th></tr>
                    <tr><td>{localId}</td><td>{cName}</td><td>{price} / {uName}</td><td>{type.toLowerCase()}</td><td>{type === PRODUCT_TYPE.STOCKED ? (stock + " " + uName) : "-"}</td></tr>
                </tbody>
                {this.getOtherTables(specsRows, "Specs", "Group", "Name")}
                {this.getOtherTables(identifierRows, "Identifiers", "Name", "value")}
                {this.getOtherTables(taxRows, "Tax", "Type", "Percentage")}
                {this.getOthers()}
                <thead>
                    <tr><th colSpan={5}>
                        <div className="d-flex justify-content-between">
                            <span>Notes</span>
                            <button className="btn btn-sm btn-outline-secondary bi bi-plus" onClick={this.showAddNotes} />
                        </div>
                    </th></tr>
                </thead>
                <tbody>{notesRows}</tbody>
            </table>
        );
    }
}
