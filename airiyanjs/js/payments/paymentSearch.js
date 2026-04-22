import React, { Component } from 'react';
import { PaymentFilter } from './paymentFilter';

import { GetAslModules, importASL } from '../utilities/utilities';
import { convertToIST, dateFormate } from '../utilities/timeUtils';
import { RESULT_SUCCESS } from '../globals/constants';
import { PaymentRow } from './search/paymentRow';
import { ClientSearch } from '../clients/clientSearch';
import { dateValidator } from '../clients/validators';
import { ClientView } from '../clients/clientView';

const TableView = GetAslModules("TableView");
const PostButton = GetAslModules("PostButton");
const SearchCaller = GetAslModules("SearchCaller");
const ChipsSearch = GetAslModules("ChipsSearch")

export class PaymentSearch extends Component {
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
    const query = this.filterRef.current.getValue();
    this.searchRef.current.setQuery({ query: { query } });
  }

  onDisplay = ({ billingName }) => {
    return <em>{billingName}</em>
  }

  onView = ({ data }) => {
    return <ClientView client={data} clientDetail={data} buttonNeeded={false} css="card rounded-0" />;
  }

  render() {
    const { url, clientUrl, cancelUrl, deductionPayUrl } = this.props;
    const filters = {
      fromDate: { type: "date", count: 1, validator: dateValidator },
      toDate: { type: "date", count: 1, validator: dateValidator },
      client: {
        type: "poper", count: 1, filterKey: "clientId",
        poper: {
          select: {
            component: ClientSearch,
            title: "Select Client",
            modalProps: { size: "xl", className: "bg-opacity-75 bg-dark" },
            props: { url: clientUrl }
          },
          view: { component: this.onView, title: "Selected Client", modalProps: { size: 'xl', className: "bg-opacity-75 bg-dark" } },
          display: { component: this.onDisplay, }
        },
        valueProcessor: (data) => data.clientId,
      }
    }
    const searchProps = {
      query: { query: {} },
      url,
      views: [
        {
          view: TableView,
          iconStyle: "bi bi-table",
          props: {
            headings: ["Client", "Date", "Payment Type", "Amount", "Status", "Write-off", "Action"],
            row: PaymentRow,
            rowParam: { others: { cancelUrl, deductionPayUrl } },
            headingCss: "position-sticky top-0 z-3"
          },
        },
      ],
      result: { from: 0, data: [] },
      onError: (error) => console.error(error),
    };

    return (
      <div className="container-fluid py-4">
        <div className="row g-2">
          <div className="col-12 p-0">
            <ChipsSearch ref={this.filterRef} filters={filters} placeHolder="Search fromDate, toDate, client" onUpdate={this.onSearchUpdate} onSearch={this.onSearchUpdate} />
          </div>
          <div className="col-12 p-0">
            <SearchCaller ref={this.searchRef} {...searchProps} />
          </div>
        </div>
      </div>
    );
  }
}

export const salesPaymentSearch = function (props) {
  return <PaymentSearch  {...props} url="/service/payment/SALES/search" cancelUrl="/service/payment/SALES/cancel" clientUrl="/service/client/SALES/search" deductionPayUrl="/service/payment/SALES/payDeduction" />
};

export const purchasePaymentSearch = function (props) {
  return <PaymentSearch  {...props} url="/service/payment/PURCHASE/search" cancelUrl="/service/payment/PURCHASE/cancel" clientUrl="/service/client/PURCHASE/search" deductionPayUrl="/service/payment/PURCHASE/payDeduction" />
};
