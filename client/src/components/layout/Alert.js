import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export default function Alert() {
  const alerts = useSelector((state) => state.alert);

  const location = useLocation();

  const isPreAuth =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  const alertClass = isPreAuth && "top-0";

  const alertMessage =
    alerts !== null &&
    alerts.length > 0 &&
    alerts.map((alert) => (
      <div
        key={alert.id}
        className={`alert alert-${alert.alertType} ${alertClass}`}
      >
        {alert.msg}
      </div>
    ));

  return alertMessage;
}
