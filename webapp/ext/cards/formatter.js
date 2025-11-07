sap.ui.define(
    [],
    function () {
        "use strict";
        return {
            getPriorityState: function (reqprio) {
                if (!reqprio) return "None";
                const priority = parseInt(reqprio, 10);
                if (priority >= 1 && priority <= 3) {
                    return "Error";
                } else if (priority >= 4 && priority <= 6) {
                    return "Warning";
                } else if (priority >= 7 && priority <= 10) {
                    return "Information";
                }
                return "None";
            },
            getPriorityIcon: function (reqprio) {
                if (!reqprio) return "None";
                const priority = parseInt(reqprio, 10);
                if (priority >= 1 && priority <= 3) {
                    return "sap-icon://alert";
                } else if (priority >= 4 && priority <= 6) {
                    return "sap-icon://alert";
                } else if (priority >= 7 && priority <= 10) {
                    return "sap-icon://information";
                }
                return "None";
            }

        }
    }
);