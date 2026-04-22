import React from "react";
import { MENUS } from "./constants";
import { Link } from "react-router-dom";
import { canAccess } from "../security/accessLogic";

import('../../css/common.css');

export class Header extends React.Component {
    constructor(props) {
        super(props)
        document.addEventListener("click", () => {
            document
                .querySelectorAll(".dropdown-submenu .dropdown-menu")
                .forEach((menu) => {
                    menu.classList.remove("show");
                });
        });
    }

    onToggleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Close other open submenus
        const openMenus = e.target.parentElement.parentElement.querySelectorAll(
            ".dropdown-menu.show"
        );
        openMenus.forEach((menu) => {
            if (menu !== e.target.nextElementSibling) {
                menu.classList.remove("show");
            }
        });

        // Toggle submenu
        e.target.nextElementSibling.classList.toggle("show");

    }

    onToggleEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const li = e.currentTarget; // the <li> element
        const submenu = li.querySelector(".dropdown-menu");

        // Close other open submenus at the same level
        const openMenus = li.parentElement.querySelectorAll(".dropdown-menu.show");
        openMenus.forEach((menu) => {
            if (menu !== submenu) {
                menu.classList.remove("show");
            }
        });

        // Show this submenu
        if (submenu) {
            submenu.classList.add("show");
        }
    };

    onToggleLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const li = e.currentTarget;
        const submenu = li.querySelector(".dropdown-menu");

        // Hide this submenu
        if (submenu) {
            submenu.classList.remove("show");
        }
    };



    processMenu = (menus, isParent = false) => {
        const { businessData = {} } = this.props;
        const { totalFund } = businessData;
        const res = [];
        menus.forEach(menu => {
            const { type = false, name, url = "", childrens = [], css, category, accessLimit } = menu;
            const proceed = canAccess(businessData, category, accessLimit);
            if (proceed) {
                switch (type) {
                    case "heading":
                        if (name) {
                            res.push(<li><h6 className={css ? css : "dropdown-header"}>{name}</h6><hr className="dropdown-divider" /></li>)
                        } else {
                            res.push(<li><hr className="dropdown-divider" /></li>)
                        }
                        break;
                    case "custom":
                        if (name === "#fund") {
                            res.push(<li><span className="dropdown-item-text">Avilable : <strong>{totalFund}</strong></span></li>)
                        }
                        break;
                    default:
                        if (childrens && childrens.length > 0) {
                            if (isParent) {
                                res.push(
                                    <li className="nav-item dropdown">
                                        <Link to={url} className="nav-link px-2 text-white dropdown-toggle" role="button" data-bs-toggle="dropdown">{name}</Link>
                                        {this.processMenu(childrens)}
                                    </li>
                                )
                            } else {
                                res.push(
                                    <li className="dropdown-submenu dropend" onMouseEnter={this.onToggleEnter} onMouseLeave={this.onToggleLeave}>
                                        <a href={url} className="dropdown-item dropdown-toggle">
                                            {name}
                                        </a>
                                        {this.processMenu(childrens)}
                                    </li>
                                )
                            }
                        } else {
                            res.push(<li><Link to={url} className={css ? css : "dropdown-item"}>{name}</Link></li>)
                        }
                }
            }
        });
        return isParent ? <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">{res}</ul> : <ul className="dropdown-menu">{res}</ul>;
    }

    getMenu = () => {
        const { isLoggedIn } = this.props;
        return isLoggedIn ? this.processMenu(MENUS, true) : null;
    }

    render() {
        const { businessData, isLoggedIn } = this.props;
        const { displayName = "Airiyan", userName } = businessData;
        return <header>
            <div className="p-3 bg-dark text-white">
                <div className="container">
                    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                        <a href="/" className="text-uppercase me-3 text-white text-decoration-none"><h4 className="fw-bold my-auto">{displayName}</h4></a>
                        {this.getMenu()}
                        <div className="text-end ms-auto">
                            {
                                isLoggedIn ?
                                    <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                                        <li className="nav-item dropdown">
                                            <a className="nav-link px-2 text-white dropdown-toggle text-capitalize" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                {userName}
                                            </a>
                                            <ul>
                                                <li className="dropdown-menu">
                                                    <li><a className="dropdown-item" href="/service/session/signout">Sign Out</a></li>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                    :
                                    <a href="/login" className="btn btn-outline-light me-2">Sign In</a>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </header>
    }
}