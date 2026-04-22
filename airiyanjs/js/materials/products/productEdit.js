import React, { Component, createRef } from "react";
import { CommodityPickerTView } from "../commodity/commodityPicker";
import { UnitTypePickerTView } from "../../units/unitType/unitTypePicker";
import { GetAslModules, importASL } from "../../utilities/utilities";
import { RESULT_SUCCESS, RESULT_UNSUCCESS } from "../../globals/constants";
import { IsStocked } from "./others/isStocked";
import { SelectIdentifier } from "../identifier/selectIdentifier";
import { SelectTax } from "../../taxing/selectTax";
import { positiveValidator } from "../../utilities/validators";
import { QuickSpecSelecter } from "./specsName/quickspecs/quickSpecSelecter";
import { PRODUCT_TYPE } from "../../enums/materialEnums";

const TitledDecimalTextBox = GetAslModules("TitledDecimalTextBox");
const PostButton = GetAslModules("PostButton");
const TitledSelect = GetAslModules("TitledSelect");

export class ProductEdit extends Component {
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

        const { data } = this.props;
        if (data) {
            const { commodity, unit, type, price, productSpecs = [], productIdentifiers = [], productTax = [], packageUnit } = data;
            this.commodityRef.current?.setValue(commodity);
            this.unitTypeRef.current?.setValue(unit);
            if (packageUnit) {
                this.packageUnitTypeRef.current?.setValue(packageUnit);
            }
            this.isStockedRef.current?.setValue(type === PRODUCT_TYPE.STOCKED);
            this.priceRef.current?.setValue(price);
            const specs = productSpecs.map(ps => ps.specs);
            this.specRef.current?.setValue(specs);
            const identifiers = productIdentifiers.map(pidn => ({ ...pidn.identifier, data: pidn.data }));
            this.identifierRef.current?.setValue(identifiers);

            const taxes = productTax.map(pt => ({ ...pt.tax, percent: pt.percent }));
            this.taxRef.current?.setValue(taxes);
        }
    }

    valueGetter = () => {
        const commodity = this.commodityRef?.current?.getValue();
        const unit = this.unitTypeRef?.current?.getValue();
        const packageUnit = this.packageUnitTypeRef.current?.getValue();
        let packageUnitId = null;
        if (packageUnit) {
            packageUnitId = packageUnit.id;
        }
        const stocked = this.isStockedRef?.current?.getValue();
        const price = this.priceRef?.current?.getValue();
        const specs = this.specRef?.current?.getValue()?.map(val => val.id);
        const identifier = this.identifierRef?.current.getValue();
        const tax = this.taxRef?.current.getValue();
        let category = this.categoryRef.current?.getValue();
        if (!category || category === "") {
            category = null;
        }
        return { commodityId: commodity.id, unitId: unit.id, price: price, type: stocked ? PRODUCT_TYPE.STOCKED : PRODUCT_TYPE.UNSTOCKED, tax: tax, identifier: identifier, specs, packageUnitId, category }
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
            this.POPUP.current?.showSuccess("Success", `Product ${data.localId}  Added Successfully`, () => {
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
        const url = "/service/product/add"
        const options = [{ label: "Bobin", value: "BOBIN" }];
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
            <TitledDecimalTextBox ref={this.priceRef} placeholder="Unit Price" validator={positiveValidator} step=".01" />
            <table className="table table-striped mt-2">
                <QuickSpecSelecter ref={this.specRef} css={{ head: "table-group-divider" }} />
            </table>
            <table className="table table-striped">
                <SelectIdentifier ref={this.identifierRef} css={{ head: "table-group-divider" }} />
            </table>
            <table className="table table-striped">
                <SelectTax ref={this.taxRef} css={{ head: "table-group-divider" }} />
            </table>
            <div className="text-end">
                <PostButton url={url} valueGetter={this.valueGetter} validator={this.validator} onSuccess={this.onSuccess} onError={this.onError} variant="primary" text="Save as New" />
            </div>
        </>
    }
}
