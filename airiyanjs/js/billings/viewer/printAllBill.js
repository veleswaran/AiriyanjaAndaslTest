import React from "react";
import { GetAslModules, getQueryParam } from "../../utilities/utilities";
import { RenderBill } from "./viewBill";
import { fromHex, fromJsonString } from "../../utilities/objectUtils";

const SearchLooper = GetAslModules("SearchLooper");

export class PrintAllBill extends React.Component {
    constructor(props) {
        super(props)
        const { data = "" } = getQueryParam();
        const json = fromHex(data);
        const query = fromJsonString(json);
        this.state = { data: { query: { ...query, isLive: true } } };
    }

    getComp = (dta) => {
        return <RenderBill {...dta} needPageBreak={true} />
    }

    render() {
        const { url = "/service/bill/SALES/search" } = this.props;
        const { data } = this.state;
        return <SearchLooper component={this.getComp} url={url} query={data} onError={(error) => console.error(error)} />
    }
}

export const PrintFyDc = function (props) {
    return <PrintAllBill {...props} url="/service/bill/SALES_DC/search" />
};


export const PrintFyCT = function (props) {
    return <PrintAllBill {...props} url="/service/bill/CREDIT_NOTE/search" />
};

export const PrintFyJW = function (props) {
    return <PrintAllBill {...props} url="/service/bill/JOB_WORK/search" />
};
