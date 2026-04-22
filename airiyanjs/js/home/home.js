import React from "react";
import { useOutletContext } from "react-router-dom";
import { ProductSearch } from "../materials/products/productSearch";

class HomePage extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { isLoggedIn } = this.props;
        if (isLoggedIn) {
            return <div className="row m-0">
                <div className="col">
                    <div className="alert alert-primary">
                        Low stocks
                    </div>
                    <ProductSearch query={{ type: "STOCKED", showLowStock: true, orderBy: "stock" }} needFilters={false} />
                </div>
            </div>
        }
        return "Home";
    }
}

// Added because lazy route needs this
// { Component: mod.default, loader: mod.loader, ErrorBoundary: mod.ErrorBoundary, }
export const Component = function (props) {
    const { isLoggedIn, businessData } = useOutletContext();
    return <HomePage {...props} isLoggedIn={isLoggedIn} businessData={businessData} />;
};