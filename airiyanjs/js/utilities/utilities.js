import React from 'react'

const CACHE = {};
var allModule;

export function GetAslModules(moduleName) {
    if (!CACHE[moduleName]) {
        CACHE[moduleName] = React.lazy(() => import('asl/app').then(module => ({ default: module[moduleName] })));
    }
    return CACHE[moduleName];
}

export async function importASL() {
    if (!allModule) {
        allModule = await import('asl/app');
    }
    return allModule;
}


export function getQueryParam() {
    return new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop)
    });
}

export function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};