import React, { Component, createRef } from "react";
import { CommodityPickerTView } from "../commodity/commodityPicker";
import { UnitTypePickerTView } from "../../units/unitType/unitTypePicker";
import { GetAslModules, importASL } from "../../utilities/utilities";
import { RESULT_SUCCESS, RESULT_UNSUCCESS } from "../../globals/constants";
import { IsStocked } from "./others/isStocked";
import { SpecsSelecter } from "./specsName/specsSelecter";
import { SelectIdentifier } from "../identifier/selectIdentifier";
import { SelectTax } from "../../taxing/selectTax";
import { positiveValidator } from "../../utilities/validators";

const TitledDecimalTextBox = GetAslModules("TitledDecimalTextBox");
const PostButton = GetAslModules("PostButton");
const TitledSelect = GetAslModules("TitledSelect");

export class ProductAdd extends Component {
    commodityRef = createRef();
    unitTypeRef = createRef();
    packageUnitTypeRef = createRef();
    isStockedRef = createRef();
    priceRef = createRef();
    specRef = createRef();
    identifierRef = createRef();
    taxRef = createRef();
    categoryRef = createRef();
    constructor(props) {
        super(props);
        this.state = { checked: false };
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    valueGetter = () => {
        const commodity = this.commodityRef.current?.getValue();
        const unit = this.unitTypeRef.current?.getValue();
        const packageUnit = this.packageUnitTypeRef.current?.getValue();
        const stocked = this.isStockedRef.current?.getValue();
        const price = this.priceRef.current?.getValue();
        const specs = this.specRef.current?.getValue()?.map(val => val.id);
        const identifier = this.identifierRef.current.getValue();
        const tax = this.taxRef.current.getValue();
        const { id: packageUnitId } = packageUnit || {};
        let category = this.categoryRef.current?.getValue();
        if (!category || category === "") {
            category = null;
        }
        return { commodityId: commodity.id, unitId: unit.id, packageUnitId, price: price, type: stocked ? "STOCKED" : "UNSTOCKED", tax: tax, identifier: identifier, specs, category };
    }

    validator = () => {
        let res = true;
        const refs = [this.commodityRef, this.unitTypeRef, this.priceRef, this.identifierRef, this.taxRef];
        for (const rf of refs) {
            if (rf.current && !rf.current?.isValid()) {
                res = false;
            }
        }
        return res;
    }

    onSuccess = (d) => {
        const { onSuccess, onClose } = this.props;
        const { result, message, data } = d;
        if (result === RESULT_SUCCESS) {
            const { localId } = data;
            this.POPUP.current?.showSuccess("Success", `Product PID ${localId} Added Successfully`, () => {
                onSuccess?.();
                onClose?.();
            });
        } else if (result === RESULT_UNSUCCESS) {
            this.TOAST.current.showMessage("Un Success", message);
        } else {
            this.TOAST.current.showFailed("Error", message);
        }
    }

    onError = (d) => {
        let { message } = d;
        this.TOAST.current.showFailed("Somthing went wrong", message);
    };

    render() {
        const { businessData = {} } = this.props;
        const { category } = businessData;
        const options = [{ label: "Bobin", value: "BOBIN" }];
        const url = "/service/product/add"
        return <>
            <table className="table table-striped mb-2">
                <thead></thead>
                <tbody>
                    <CommodityPickerTView ref={this.commodityRef} />
                    <UnitTypePickerTView ref={this.unitTypeRef} />
                    <UnitTypePickerTView ref={this.packageUnitTypeRef} title="Package unit (optional)" />
                    <IsStocked ref={this.isStockedRef} />
                </tbody>
            </table>
            {category === "loom" ? <TitledSelect ref={this.categoryRef} placeholder="Category" isstringlist={false} options={options} /> : ""}
            <TitledDecimalTextBox ref={this.priceRef} placeholder="Unit Price" validator={positiveValidator} step=".01" class="mt-1" />
            <table className="table table-striped mt-2">
                <SpecsSelecter ref={this.specRef} css={{ head: "table-group-divider" }} />
            </table>
            <table className="table table-striped">
                <SelectIdentifier ref={this.identifierRef} css={{ head: "table-group-divider" }} />
            </table>
            <table className="table table-striped">
                <SelectTax ref={this.taxRef} css={{ head: "table-group-divider" }} />
            </table>
            <div className="text-end">
                <PostButton url={url} valueGetter={this.valueGetter} validator={this.validator} onSuccess={this.onSuccess} onError={this.onError} variant="primary" text="Add" />
            </div>
        </>
    }
}
