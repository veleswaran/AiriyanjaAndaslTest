import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { buildPrice, getIdnColumns, getProductColKeys, getProductSpec, getSpecsColumns } from "./utilities";
import { importASL } from "../../utilities/utilities";
import { ProductSearch } from "./productSearch";


const DEFAULT_HEADING = ["Name", "Type", "Stock", "Cost"];

export class ProductPicker extends React.Component {
    constructor(props) {
        super(props)
        this.state = { identifierKeys: [], specsKeys: [], taxNeeded: false };
    }

    async componentDidMount() {
        const { TOAST, POPUP } = await importASL();
        this.TOAST = TOAST;
        this.POPUP = POPUP;
    }

    getValue = () => {
        const { product } = this.state;
        return product;
    }

    productSelected = (product) => {
        const { onSelected } = this.props;
        const { identifierKeys, specsKeys, taxNeeded } = getProductColKeys([product]);
        this.setState({ product, identifierKeys, specsKeys, taxNeeded });
        if (onSelected) {
            onSelected(product);
        }
    }

    showProductPicker = () => {
        const comProps = {  onSelect: this.productSelected, };
        this.POPUP.current.showPopUp("Select Product", ProductSearch,"bg-warning",{ modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" },props:comProps});
    }

    viewProduct = () => {
        const { product } = this.state;
        this.POPUP.current.showPopUp("Product View", ProductView, null, product);
    }

    render() {
        const { product, identifierKeys, specsKeys, taxNeeded } = this.state;
        let headings;
        let columns;
        if (product) {
            const { localId, type, stock } = product;
            const { productName, specsColumn, idnColumn } = getProductSpec(product);
            const allHeadings = [];
            [...specsKeys, ...identifierKeys].forEach(name => {
                allHeadings.push(<th scope="col">{name}</th>)
            });
            headings = <tr>
                <th>Product Id</th>
                <th>Name</th>
                {allHeadings}
                <th>Type</th>
                <th>Stock</th>
                <th>Cost</th>
            </tr>;
            columns = <tr>
                <td>{localId}</td>
                <td>{productName}</td>
                {getSpecsColumns(specsKeys, specsColumn)}
                {getIdnColumns(identifierKeys, idnColumn)}
                <td>{type}</td>
                <td>{stock}</td>
                <td>{buildPrice(product)}</td>
            </tr>;
        } else {
            headings = <tr><th>Name</th><th>Type</th><th>Stock</th><th>Cost</th></tr>;
            columns = <tr><td></td><td></td><td></td><td></td></tr>;
        }
        return (
            <Row>
                <Col>
                    <table className="table h-100">
                        <thead className="h-50">
                            {headings}
                        </thead>
                        <tbody>
                            {columns}
                        </tbody>
                    </table>
                </Col>
                <Col md="auto" className="align-content-center"><Button variant="primary" onClick={this.showProductPicker}>Pick Product</Button></Col>
            </Row >
        );
    }
}