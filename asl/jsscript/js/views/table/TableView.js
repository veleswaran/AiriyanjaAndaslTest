import React from "react";
import { TableRow } from "./TableRow";
import { AutoRender } from "../../utilities/rendering";

export class TableView extends React.Component {
    constructor(props) {
        super(props);
        const { serialFrom = 0, data = [] } = this.props;
        this.state = { serialFrom, data, isLoading: false };
    }

    setData = (dta) => {
        const { serialFrom = 0, data = [] } = dta;
        this.setState({ serialFrom, data, isLoading: false });
    }

    setLoading = (enabled) => {
        this.setState({ isLoading: enabled });
    }

    render() {
        const { needSerial = true, row = TableRow, rowParam: { styleFunc, others } = {}, headings = [], headingCss = "", headingFunc, preProcessor, style, cells, footer } = this.props;
        const { serialFrom, data, isLoading } = this.state;
        const headingElm = [];
        if (needSerial) {
            headingElm.push(<th scope="col">#</th>);
        }
        if (headingFunc) {
            headingFunc(data).forEach(name => {
                headingElm.push(<th scope="col">{name}</th>);
            })
        } else {
            headings.forEach(name => {
                headingElm.push(<th scope="col">{name}</th>);
            });
        }
        const rows = [];
        if (isLoading) {
            rows.push(<tr><td colSpan={headingElm.length} className="text-md-center">Loading...</td></tr>);
        } else {
            if (data.length > 0) {
                let preProcessData = data;
                if (preProcessor) {
                    preProcessData = preProcessor(data);
                }
                let serial = serialFrom;
                data.forEach(datum => {
                    serial++;
                    rows.push(React.createElement(row, { serial, needSerial, data: datum, styleFunc, cells, others, preProcessData }));
                });
            } else {
                rows.push(<tr><td colSpan={headingElm.length} className="text-md-center">No Data!!!</td></tr>);
            }
        }
        return (
            <table className={style ? style : "table table-striped table-hover m-0"}>
                <thead className={headingCss}><tr>{headingElm}</tr></thead>
                <tbody>{rows}</tbody>
                {footer ? <tfoot><tr><td colSpan={headingElm.length}>{AutoRender(footer, data)}</td></tr></tfoot> : ""}
            </table>
        );
    }

}
