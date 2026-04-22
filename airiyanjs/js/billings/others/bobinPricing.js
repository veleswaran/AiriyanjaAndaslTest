import React from "react";
import { GetAslModules } from "../../utilities/utilities";
import { positiveValidator, zeroOrPositiveValidator } from "../../utilities/validators";
import { toCurrencyF } from "../../utilities/conversionutils";

const TitledDecimalTextBox = GetAslModules("TitledDecimalTextBox");
const TitledSelect = GetAslModules("TitledSelect");

export class BobinPricing extends React.Component {
    pricePerRef = React.createRef();
    meterRef = React.createRef();
    reelsRef = React.createRef();
    priceRef = React.createRef();
    totalPriceRef = React.createRef();

    constructor(props) {
        super(props);
    }

    isValid = () => {
        const controls = [this.pricePerRef, this.meterRef, this.reelsRef, this.priceRef, this.totalPriceRef];
        let res = true;
        for (const control of controls) {
            if (control.current && !control.current.isValid()) {
                res = false;
            }
        }
        return res;
    }

    callUpdate = (finalPrice) => {
        const { onUpdate } = this.props;
        onUpdate?.(finalPrice);
    }

    getValue = () => {
        const pricePer = this.pricePerRef.current.getValue();
        const meter = this.meterRef.current.getValue();
        const reels = this.reelsRef.current.getValue();
        const price = this.priceRef.current.getValue();
        const totalPrice = this.totalPriceRef.current.getValue();
        const res = [];
        res.push({ label: "pricePer", data: pricePer });
        res.push({ label: "meter", data: meter });
        res.push({ label: "reels", data: reels });
        res.push({ label: "price", data: price });
        res.push({ label: "totalPrice", data: totalPrice });
        return res;
    }

    getElementVal = () => {
        const pricePer = this.pricePerRef.current.getValue();
        const meter = this.meterRef.current.getValue();
        const reels = this.reelsRef.current.getValue();
        const price = this.priceRef.current.getValue();
        const totalPrice = this.totalPriceRef.current.getValue();
        return { pricePer, meter, reels, price, totalPrice };
    }

    onPricePerChange = () => {
        const { pricePer, meter, reels, price } = this.getElementVal();
        let totalPrice = 0;
        if (pricePer === "Meter") {
            totalPrice =toCurrencyF(price * meter);
        } else if (pricePer === "Reels") {
            totalPrice = toCurrencyF(price * reels);
        }
        this.totalPriceRef.current.setValue(totalPrice);
        this.isValid();
        this.callUpdate(totalPrice);
    }

    onMeterChange = () => {
        const { pricePer, meter, price } = this.getElementVal();
        if (pricePer === "Meter") {
            const totalPrice =toCurrencyF(price * meter);
            this.totalPriceRef.current.setValue(totalPrice);
            this.isValid();
            this.callUpdate(totalPrice);
        }
    }

    onReelsChange = () => {
        const { pricePer, reels, price } = this.getElementVal();
        if (pricePer === "Reels") {
            const totalPrice =toCurrencyF(price * reels);
            this.totalPriceRef.current.setValue(totalPrice);
            this.isValid();
            this.callUpdate(totalPrice);
        }
    }

    onPriceChange = () => {
        const { pricePer, meter, reels, price } = this.getElementVal();
        let totalPrice = 0;
        if (pricePer === "Meter") {
            totalPrice =toCurrencyF(price * meter);
        } else if (pricePer === "Reels") {
            totalPrice = toCurrencyF(price * reels);
        }
        this.totalPriceRef.current.setValue(totalPrice);
        this.isValid();
        this.callUpdate(totalPrice);
    }

    onTotalPriceChange = () => {
        const { pricePer, meter, reels, totalPrice } = this.getElementVal();
        let newPrice = 0;
        if (pricePer === "Meter") {
            newPrice = meter > 0 ? toCurrencyF(totalPrice / meter) : 0;
        } else if (pricePer === "Reels") {
            newPrice = reels > 0 ? toCurrencyF(totalPrice / reels) : 0;
        }
        this.priceRef.current.setValue(newPrice);
        this.isValid();
        this.callUpdate(totalPrice);
    }

    updateTotalPrice = (totalPrice) => {
        const { pricePer, meter, reels } = this.getElementVal();
        let newPrice = 0;
        if (pricePer === "Meter") {
            newPrice = meter > 0 ?toCurrencyF(totalPrice / meter) : 0;
        } else if (pricePer === "Reels") {
            newPrice = reels > 0 ? toCurrencyF(totalPrice / reels) : 0;
        }
        this.priceRef.current.setValue(newPrice);
        this.totalPriceRef.current.setValue(toCurrencyF(totalPrice));
        this.isValid();
    }


    render() {
        const { css = "", style = {} } = this.props;
        const options = [{ label: "Meter", value: "Meter" },
        { label: "Reels", value: "Reels" }];
        return <div className={`input-group g-1 ${css}`} style={style}>
            <TitledSelect ref={this.pricePerRef} placeholder="Price per" isstringlist={false} options={options} onChange={this.onPricePerChange} />
            <TitledDecimalTextBox ref={this.meterRef} positiveOnly={true} placeholder="Meter" onChange={this.onMeterChange} validator={positiveValidator} />
            <TitledDecimalTextBox ref={this.reelsRef} positiveOnly={true} placeholder="Reels" onChange={this.onReelsChange} validator={zeroOrPositiveValidator} />
            <TitledDecimalTextBox ref={this.priceRef} positiveOnly={true} placeholder="Price" onChange={this.onPriceChange} validator={positiveValidator} />
            <TitledDecimalTextBox ref={this.totalPriceRef} positiveOnly={true} placeholder="Total Price" onChange={this.onTotalPriceChange} validator={positiveValidator} />
        </div>
    }
}