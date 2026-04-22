import React from "react";
import { ProductSearch } from "./productSearch";
import { ProductAdd } from "./productAdd";
import { Button } from "react-bootstrap";
import { importASL } from "../../utilities/utilities";
import { useOutletContext } from "react-router-dom";

export class ProductPage extends React.Component {
    productRef = React.createRef(null);
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    showProductAdd = () => {
        const { businessData = {} } = this.props;
        this.POPUP.current.showPopUp("Add Product", ProductAdd, "bg-warning", { modalProps: { size: 'lg', className: "bg-opacity-75 bg-dark", css: { footer: "visually-hidden" } }, props: { onSuccess: this.onAddSuccess, businessData } });
    }

    onAddSuccess = () => {
        this.productRef.current?.callZero();
    }

    render() {
        const { businessData = {} } = this.props;
        return <div className="m-1">
            <div className="p-0"><Button variant="primary" onClick={this.showProductAdd}>Add</Button> </div>
            <div className="mt-1">
                <ProductSearch ref={this.productRef} url="service/product/search" businessData={businessData} />
            </div>
        </div>;
    }
}


export const ProductPageWithBD = function (props) {
    const { businessData } = useOutletContext();
    return <ProductPage {...props} businessData={businessData} />
};