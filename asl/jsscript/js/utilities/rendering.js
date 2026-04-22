import React from "react";


export function AutoRender(obj, data) {
    if (typeof obj === "function") {
        if (obj.prototype && !!obj.prototype.isReactComponent) {
            return React.createElement(obj, data);
        }
        return obj(data);
    }
    return obj;
}