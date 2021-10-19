import React from "react";

import { Link } from "react-router-dom";

import "./Layout.css"
/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {
  return (
    <nav className="navbar navbar-dark align-items-start p-0">
      <div className="container-fluid d-flex flex-column p-0">
        <div className="d-flex flex-column">
          <section>
            <Link className="navbar-brand" to="/">
              <div className="sidebar-brand-text font-weight-bolder mx-3">
                <span className="title">Periodic Tables</span>
              </div>
            </Link>

            <hr className="sidebar-divider my-0" />
        
            <ul className="nav navbar-nav d-flex flex-row text-white" id="accordionSidebar">
              <li className="nav-item mx-2">
                <Link className="nav-link" to="/dashboard" style={{color: "white", fontSize: "18px"}}>
                  <span className="oi oi-dashboard" />
                    &nbsp;Dashboard
                </Link>
              </li>
          
              <li className="nav-item mx-2">
                <Link className="nav-link" to="/search" style={{color: "white", fontSize: "18px"}}>
                <span className="oi oi-magnifying-glass" />
                  &nbsp;Search
                </Link>
              </li>

              <li className="nav-item mx-2">
                <Link className="nav-link" to="/reservations/new" style={{color: "white", fontSize: "18px"}}>
                  <span className="oi oi-plus" />
                    &nbsp;New Reservation
                </Link>
              </li>

              <li className="nav-item mx-3">
                <Link className="nav-link" to="/tables/new" style={{color: "white", fontSize: "18px"}}>
                  <span className="oi oi-layers" />
                    &nbsp;New Table
                </Link>
              </li>
            </ul>
          </section>
        
          <div className="text-center d-none d-md-inline">
          <button
            className="btn rounded-circle border-0"
            id="sidebarToggle"
            type="button"
          />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Menu;
