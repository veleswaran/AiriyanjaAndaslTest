import React from "react";
import { useRouteError } from "react-router-dom";

export function ErrorPage({ status: pstatus = "Error", text = "Oops! Somthing went wrong" }) {
    const error = useRouteError();
    const { status = pstatus, statusText = text, data = "" } = error || {};
    const statusString = String(status);
    const statusChars = statusString.split("");
    return (
        <div className="h-100 d-flex align-items-center justify-content-center">
            <div className="text-center">
                <p className="h1 fw-bold" style={{ fontSize: "200px" }}>
                    {statusChars.map((char, index) => (
                        <span key={index}>{char}</span>
                    ))}
                </p>
                <p>{statusText || data}</p>
                <a href="/">Go back home</a>
            </div>
        </div>
    );
}
