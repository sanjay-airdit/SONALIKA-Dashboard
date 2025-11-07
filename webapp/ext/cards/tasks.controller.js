
(function () {
    "use strict";
    /* controller for custom card  */
    // Controller : https://ui5.sap.com/#/topic/121b8e6337d147af9819129e428f1f75
    // controller class name can be like app.ovp.ext.customList.CustomList where app.ovp can be replaced with your application namespace

    sap.ui.define([
        "aidgdashboard/ext/cards/formatter"
    ], function (formatter) {
        return {
            formatter: formatter,

            onInit: function () {
                let oParameters = {
                    "$skip": 0,
                    "$top": 10,
                    "$orderby": "req_created_on desc"
                }
                this._FetchData(oParameters)
            },

            _FetchData: function (oParameters) {
                let oModel = this.oCardComponentData.model
                this.getCardContentContainer().setBusy(true)
                oModel.read('/ZP_QU_DG_MYTASK', {
                    urlParameters: oParameters,
                    success: function (oData, oRes) {
                        let oJModel = new sap.ui.model.json.JSONModel(oData.results)
                        this.getOwnerComponent().setModel(oJModel, "TilesModel")
                        this.getCardContentContainer().setBusy(false)
                    }.bind(this),
                    error: function (oErr) {
                        this.getCardContentContainer().setBusy(false)
                    }.bind(this)
                })
            },

            onSelectionChange: function (oEvent) {
                let oParameters = {
                    "$skip": 0,
                    "$top": 10,
                }

                let sKey = oEvent.getSource().getSelectedKey()
                if (sKey === "RECENT") {
                    oParameters["$orderby"] = "req_created_on desc"
                } else if (sKey === "OLD") {
                    oParameters["$orderby"] = "req_created_on asc"
                } else {
                    oParameters["$orderby"] = "WorkItem_Priority asc"
                }

                this._FetchData(oParameters)
            },

            onTilePress: function (oEvent) {
                let oData = oEvent.getSource().getBindingContext("TilesModel").getObject();
                let sMaster = oData.Master;
                let sReqType = oData.reqtyp;
                let sMatnr = oData.ObjectNumber;

                let COMPONENT_MAP = {
                    MM: {
                        CREATE: 'zmaterialcreate.materialcreate',
                        UPDATE: 'zmaterialcreate.materialcreate',
                        COPY: 'zmaterialcreate.materialcreate',
                        DELETE: 'zmaterialcreate.materialcreate',
                        CREATE_MAS: 'qudgmaterialmassupload',
                        'MASS UPDATE': 'massedit'
                    },
                    BP: {
                        CREATE: 'businesspartner',
                        UPDATE: 'businesspartner',
                        COPY: 'businesspartner',
                        DELETE: 'businesspartner',
                    },
                    EQ: {
                        CREATE: 'equipment',
                        UPDATE: 'equipment',
                        COPY: 'equipment',
                        DELETE: 'equipment',
                    }
                };

                let sComponent = COMPONENT_MAP[sMaster]?.[sReqType];
                let oParams = {
                    REQID: oData.Technical_WorkFlow_Object,
                    WIID: oData.WorkItem_ID,
                    // TOP_WIID:oData.TopLevelWorkflowTask,
                    // PROCESS_ID:oData.process_id,
                    // SEQUENCE:oData.sequence,
                    MATNR: sMatnr.replace(/^0+/, ""),
                    SNO: 1,
                    ISACTIVEENTITY: true
                }

                if (sComponent) {
                    sap.ui.getCore().navigateExternal(sComponent, '', { params: oParams });
                }

                // const postData = {
                //     reqid: oObj.Technical_WorkFlow_Object,
                //     reqtyp: oObj.reqtyp,
                //     wiid: oObj.WorkItem_ID,
                //     TopLevelWorkflowTask: oObj.TopLevelWorkflowTask,
                //     sequence: oObj.sequence,
                //     master: oObj.Master,
                //     objnum: oObj.ObjectNumber,
                //     processId: oObj.process_id
                // };

                // var oEventBus = sap.ui.getCore().getEventBus();
                // debugger;
                // oEventBus.publish("myChannel", "myEvent", { data: postData });
            },

            onAfterRendering: function () { },

            onExit: function () { },

        }
    });
})();