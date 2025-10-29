import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import React from "react";

function Navbar() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role || "visitor";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow sticky-top">
      <div className="container-fluid">
        {/* Brand */}
        <Link to="/" className="navbar-brand fw-bold">
          Jr Technical School
        </Link>

        {/* Toggle Button for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu Items */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center gap-2">
            {/* Public Links */}
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admissions" className="nav-link">
                Admissions
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/events" className="nav-link">
                Events
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/gallery" className="nav-link">
                Gallery
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link">
                Contact
              </Link>
            </li>

            {/* Staff/Admin Links */}
            <SignedIn>
              {(role === "staff" || role === "admin") && (
                <>
                  <li className="nav-item">
                    <Link to="/dashboard" className="nav-link">
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/inbox" className="nav-link">
                      Inbox
                    </Link>
                  </li>
                </>
              )}
            </SignedIn>

            {/* Auth Section */}
            <li className="nav-item d-flex align-items-center">
              <SignedOut>
                <SignInButton>
                  <button className="btn btn-warning btn-sm fw-semibold">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <div className="ms-2">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8",
                      },
                    }}
                  />
                </div>
              </SignedIn>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
