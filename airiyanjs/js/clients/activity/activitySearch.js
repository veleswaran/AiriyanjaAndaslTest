import React, { Component } from 'react';
import { DateClientFilter } from './dateClientFilter';

import { GetAslModules, importASL } from '../../utilities/utilities';
import { convertToIST } from '../../utilities/timeUtils';
import { dateValidator, nameValidatorChips } from '../validators';
import { ClientSearch } from '../clientSearch';
import { ClientView } from '../clientView';

const TableView = GetAslModules("TableView");
const SearchCaller = GetAslModules("SearchCaller");
const ChipsSearch = GetAslModules("ChipsSearch");

export class ActivitySearch extends Component {
  searchRef = React.createRef();
  filterRef = React.createRef();
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const { TOAST, POPUP } = await importASL();
    this.TOAST = TOAST;
    this.POPUP = POPUP;
  }

  onSearchUpdate = () => {
    const { clientId } = this.props;
    const query = this.filterRef.current.getValue();
    if (clientId) query.clientId = clientId;
    this.searchRef.current.setQuery({ query: { query } });
  }

  onDisplay = ({ billingName }) => {
    return <em>{billingName}</em>
  }

  onView = ({ data }) => {
   return <ClientView client={data} clientDetail={data} buttonNeeded={false} css="card rounded-0" />;
  }

  render() {
    const { url, clientUrl, clientId = null, style = {}, css = "" } = this.props;
    const searchProps = {
      query: { query: { clientId } },
      url,
      views: [
        {
          view: TableView,
          iconStyle: "bi bi-table",
          props: {
            headings: ["Client Name", "Time", "category", "Action", "Description", "Amount", "Balance"],
            cells: [
              { key: "client.name" },
              { key: "createdTime", renderer: (keyval, row) => convertToIST(keyval) },
              { key: "category", renderer: (keyval, { subcategory = "" }) => `${keyval} ${subcategory}` },
              { key: "actionType" },
              { key: "description" },
              { key: "amount" },
              { key: "finalAmount", defaultValue: 0 },
            ],
            headingCss: "position-sticky top-0 z-3"
          },
        },
      ],
      result: { from: 0, data: [] },
      onError: (error) => console.error(error),
    };

    const filters = {
      fromDate: { type: "date", count: 1, validator: dateValidator },
      toDate: { type: "date", count: 1, validator: dateValidator }
    };
    if (!clientId) {
      filters.client = {
        type: "poper", count: 1, filterKey: "clientId",
        poper: {
          select: {
            component: ClientSearch, title: "Select Client", modalProps: { size: "xl", className: "bg-opacity-75 bg-dark" },
            props: { url: clientUrl }
          },
          view: { component: this.onView, title: "Selected Client",modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" } },
          display: { component: this.onDisplay, }
        },
        valueProcessor: (data) => data.clientId,
      };
    }

    return (
      <div className={css} style={style}>
        <div className="pb-1">
          <ChipsSearch ref={this.filterRef} filters={filters} placeHolder="Search (e.g. fromDate or toDate)" onUpdate={this.onSearchUpdate} onSearch={this.onSearchUpdate} />
        </div>
        <div>
          <SearchCaller ref={this.searchRef} {...searchProps} />
        </div>
      </div>
    );
  }
}


export const salesClientActivity = function (props) {
  return <ActivitySearch {...props} url="/service/client_activity/search" clientUrl="/service/client/SALES/search" />;
};

export const purchaseClientActivity = function (props) {
  return <ActivitySearch {...props} url="/service/client_activity/search" clientUrl="/service/client/PURCHASE/search" />;
};
