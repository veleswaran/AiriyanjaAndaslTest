import React from "react";
import { GetAslModules, importASL } from "../../utilities/utilities";
import { isWithinNdays, utcStringToDate } from "../../utilities/timeUtils";
import { CommodityRow } from "./search/commodityRow";
import { stringNotNullOrEmpty } from "../../utilities/validators";
import { wildcardProcessor } from "../../utilities/searchUtilitiies";

const SearchCaller = GetAslModules("SearchCaller");
const TableView = GetAslModules("TableView");
const ChipsSearch = GetAslModules("ChipsSearch");

export class CommoditySearch extends React.Component {
  searchRef = React.createRef();
  filterRef = React.createRef();
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const { TOAST, POPUP } = await importASL();
    this.TOAST = TOAST
    this.POPUP = POPUP
  }

  onSearch = () => {
    const searchChips = this.filterRef.current.getValue();
    const payload = { query: { ...searchChips } };
    this.searchRef.current.setQuery({ query: payload });
  }

  callZero = () => {
    this.searchRef.current?.callZero();
  }

  actionRendered = (keyval, data) => {
    const { onSelect, onClose, isPopUp = false } = this.props;
    const { createdTime = "" } = data;
    if (isPopUp) {
      return <button className="btn btn-primary" onClick={() => {
        if (onSelect) {
          onSelect(data)
        }
        if (onClose) {
          onClose();
        }
      }}>select</button>
    }
    if (isWithinNdays(utcStringToDate(createdTime), -5)) {
      return <button className="btn btn-sm btn-outline-secondary bi bi-pencil" onClick={() => this.showEditPopup(data)}></button>
    }
    return "";
  }


  nameValidator = (data) => {
    return stringNotNullOrEmpty(data) ? data.length <= 150 : false;
  }

  render() {
    const { css = "", style = {}, isPopUp, onSelect, onClose } = this.props;
    const searchProps = {
      query: { query: {} },
      url: "/service/commodity/search",
      views: [
        {
          view: TableView,
          iconStyle: "bi bi-table",
          props: {
            headings: ["Name", "Action"],
            row: CommodityRow,
            rowParam: { others: { isPopUp, onSelect, onClose } },
            headingCss: "position-sticky top-0 z-3"
          },
        },
      ],
      result: { from: 0, data: [] },
      onError: (error) => console.error(error),
    };
    const filters = {
      name: { count: 5, validator: this.nameValidator, valueProcessor: wildcardProcessor, type: "nonkey" }
    };

    return (
      <div className={css} style={style}>
        <div>
          <ChipsSearch ref={this.filterRef} filters={filters} placeHolder="Search Client e.g name:test" onUpdate={this.onSearch} onSearch={this.onSearch} />
        </div>
        <div className="mt-1">
          <SearchCaller ref={this.searchRef} {...searchProps} />
        </div>
      </div>
    );
  }
}



