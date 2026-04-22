import React, { Component, createRef } from 'react';
import { ClientPicker } from '../clientPicker.js';
import { GetAslModules } from '../../utilities/utilities.js';

const TitledText = GetAslModules("TitledTextBox");
export class DateClientFilter extends Component {
  clientRef = createRef();
  startDateRef = createRef();
  endDateRef = createRef();
  constructor(props) {
    super(props);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let startDate = this.startDateRef.current?.getValue();
    let endDate = this.endDateRef.current?.getValue();
    let client = this.clientRef.current.getValue();
    if (this.props.onFilter) {
      this.props.onFilter({client:client?.clientId,startDate,endDate});
    }
  };

  handleReset = () => {
    this.clientRef.current?.handleClearClient();
    this.startDateRef.current?.reset();
    this.endDateRef.current?.reset();
    const resetFilters = { client: null, startDate: '', endDate: '' };
    if (this.props.onFilter) {
      this.props.onFilter(resetFilters);
    }
  };

  render() {
    const { clientUrl, baseUrl, clientType, businessData } = this.props;
    return (
      <div className="card shadow-sm">
        <div className="card-body">
            {/* Client Selection */}
            <ClientPicker ref={this.clientRef} url={clientUrl} baseUrl={baseUrl} clientType={clientType} businessData={businessData} />
            {/* Start Date with Floating Label */}
            <TitledText ref={this.startDateRef} placeholder="Start Date" type="date" validator={this.textValidator} />
            {/* End Date with Floating Label */}
            <TitledText ref={this.endDateRef} placeholder="End Date" type="date" validator={this.textValidator} />

            <div className="d-flex gap-2 mt-4">
              <button type="button" className="btn btn-primary" onClick={this.handleSubmit}><i className="bi bi-funnel me-2"></i>Apply</button>
              <button type="button" className="btn btn-secondary" onClick={this.handleReset} >
                <i className="bi bi-arrow-counterclockwise me-2"></i> Reset
              </button>
            </div>
        </div>
      </div>
    );
  }
}
