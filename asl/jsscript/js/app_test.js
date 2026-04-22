import React from "react";
import { createRoot } from "react-dom/client";


import { addPopUpController, addToastController, ChipsSearch, TableView, TitledTextBox } from "./app.js";
import { CardView } from "./app.js";
import { PaginationBar } from "./commonComponents/PaginationBar.js";
import { MultiView } from "./app.js";
import { SearchCaller } from "./app.js";
import { DynamicInputs } from "./app.js";
import { TitledDecimalTextBox } from "./app.js";
import { TitledIntegerTextBox } from "./app.js";
import { ToastController } from "./app.js";
import { PopUpController } from "./app.js";
import { PostButton } from "./app.js";
import { GetButton } from "./app.js";
import DragDropList from "./commonComponents/Ordering.js";
import { PostTButton } from "./buttons/PostTButton.js";
import { EditBox } from "./app.js";

// Import Bootstrap's CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'

// Import Bootstrsap's JS (optional)
import 'bootstrap';
import "react-bootstrap-icons";
import { TextBox } from "./inputs/TextBox.js";

const SerialNumberList = ({ items = [{ label: "First item" }, { label: "Second item" }, { label: "Third item" }], onSelect, onClose }) => {
    const handleClick = (serialNumber, label) => {
        onSelect({ serialNumber, serialNumberText: serialNumber.toString(), label });
        onClose?.()
    };

    return (
        <ul className="list-group">
            {items.map((item, index) => {
                const serialNumber = index + 1;
                return (
                    <li
                        key={serialNumber}
                        className="list-group-item"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleClick(serialNumber, item.label)}
                    >
                        {serialNumber} - {item.label || JSON.stringify(item)}
                    </li>
                );
            })}
        </ul>
    );
};

const viewtext = ({ data: { serialNumberText, label } }) => {
    return <strong>{`${serialNumberText} ${label}`}</strong>
}

const display = ({ serialNumberText, label }) => {
    return <em>{`${label}`}</em>
}


document.addEventListener("DOMContentLoaded", () => {
    //  const heading = document.createElement("h1");
    //  heading.textContent = "Welcome to My Java Web App!";
    //  document.body.appendChild(heading);
    const container = document.getElementById("root");
    const root = createRoot(container);

    addToastController(document.getElementById("toast"), "position-fixed p-3 h-100 overflow-hidden");
    addPopUpController(document.getElementById("popup"));

    const data = [{
        "heading": "h1",
        "body": "b1",
        "footer": "f1"
    },
    {
        "heading": "h2",
        "body": "b2",
        "footer": "f2"
    },
    {
        "heading": "h3",
        "body": "b3",
        "footer": "f3"
    }]
    const header = (data) => {
        const { heading } = data;
        return heading;
    }
    const body = (data) => {
        const { body } = data;
        return body;
    }
    const footer = (data) => {
        const { footer } = data;
        return footer;
    }
    var rf = React.createRef();
    // root.render(<CardView ref={rf} data={[]} cardParam={{ header, body, footer }} />);
    const cardParam = { header, body, footer }
    const headings = ["H"]
    const cells = [{ key: "body" }]
    const views = [
        {
            view: TableView,
            iconStyle: "bi bi-table",
            props: { headings, cells }
        },
        {
            view: CardView,
            iconStyle: "bi bi-grid",
            props: { cardParam }
        }
    ]
    // root.render(<SearchCaller ref={rf} views={views} result={{ from: 0, data }} onError={(er) => { console.log(er); }} />);
    // root.render(<DragDropList />);
    // root.render(<TitledDecimalTextBox positiveOnly={true} />);
    // rf.current.setData({ serialFrom: 0, data: dta })
    // const inp = [
    //     {
    //         name: "T1",
    //         component: TitledDecimalTextBox,
    //         props: { placeholder: "Decimal Text box" }
    //     },
    //     {
    //         name: "T2",
    //         component: TitledIntegerTextBox,
    //         props: { placeholder: "Integer Text box" }
    //     },
    //     {
    //         name: "T3",
    //         isUnique: true,
    //         isMandatory: true,
    //         component: TitledIntegerTextBox,
    //         props: { placeholder: "Integer Text box" }
    //     }
    // ]
    // root.render(<DynamicInputs ref={rf} inputs={inp} />);
    // root.render(
    //     <ul>
    //         <li>Child item 1</li>
    //         <li>Child item 2</li>
    //         <li><TitledTextBox placeholder="Welcome!" /></li>
    //         <li><TitledDecimalTextBox placeholder="Welcome!" /></li>
    //         <li><TitledTextArea placeholder="Welcome!" /></li>
    //         <li><TitledSelect placeholder="Welcome!" options={["Hi", "Hi2"]} /></li>
    //     </ul>
    // );
    // https://airiyan.in/service/locations/country/state
    // root.render(<PostButton text="Hello button" url="https://api.restful-api.dev/objects" />);
    // root.render(<GetButton text="Hello button" url="https://api.restful-api.dev/objects" onSuccess={(dta) => { console.log(dta); }} />);
    // const filter = {
    //     ends: { type: "pint" },
    //     ends1: { type: "pint" },
    //     ends2: { type: "pint" },
    //     ends3: { type: "pint" },
    //     ends4: { type: "pint" },
    //     ends5: { type: "pint" },
    //     value: { type: "int", count: 2, filterKey: "jk" },
    //     nkey: { type: "nonkey", count: 10, filterKey: "nKey" },
    //     client: { type: "poper", count: 10, poper: { select: { component: SerialNumberList, title: "Select some text" }, view: { component: viewtext, title: "showing value" }, display: { component: display } } },
    //     date: { type: "date", count: 1},
    // }
    // root.render(<ChipsSearch filters={filter} onUpdate={() => { console.log("Updated") }} />);
    root.render(<TextBox placeholder="Hello" onInput={(e) => { console.log(e.target.value); }} />);
});


