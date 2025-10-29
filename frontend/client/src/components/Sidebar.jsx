import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = ({ role }) => {
  if (role !== "admin" && role !== "staff") return null;

  return (
    <div
      className="offcanvas offcanvas-start text-bg-light"
      tabIndex="-1"
      id="adminSidebar"
      aria-labelledby="adminSidebarLabel"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="offcanvas-title" id="adminSidebarLabel">Admin Menu</h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>

      <div className="offcanvas-body">
        <ul className="list-unstyled">
          <li className="mb-2">
            <Link
              to="/admissionDashboard"
              className="text-decoration-none text-dark fw-semibold"
              data-bs-dismiss="offcanvas"
            >
              📋 Admission Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/messageInbox"
              className="text-decoration-none text-dark fw-semibold"
              data-bs-dismiss="offcanvas"
            >
              💬 Message Inbox
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;
