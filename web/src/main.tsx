import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { Landing } from "./pages/Landing";
import { CompanyAuth } from "./pages/CompanyAuth";
import { CompanyApp } from "./pages/CompanyApp";
import { Referral } from "./pages/Referral";
import { PortalAuth } from "./pages/PortalAuth";
import { Portal } from "./pages/Portal";

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <CompanyAuth /> },
  { path: "/app/*", element: <CompanyApp /> },
  { path: "/r/:slug", element: <Referral /> },
  { path: "/portal/login", element: <PortalAuth /> },
  { path: "/portal", element: <Portal /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
