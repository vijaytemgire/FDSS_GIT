sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	'sap/ui/model/Filter'
], function(Controller, History, MessageToast, MessageBox, Filter) {
	"use strict";

	return Controller.extend("msg.controller.new", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the var sObjectId = oEvent.getParameter("arguments").path6;
			var sno = this.getView().byId("sno");
			sno.setValue(sObjectId);View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf msg.view.new
		 */
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getRoute("new").attachMatched(this._onRouteMatched,
				this);
		},

		onBack: function() {
			this.oRouter.navTo("worklist");
		},
        renew: function(value){
            

            
         this.getView().getModel().read("/TreatySet('710000000016')", {
				success: function(oData, response) {
			            debugger;
				},
				error: function(oError) {
				}
			}); 
            
        },
		_onRouteMatched: function(oEvent) {
			var sObjectId = oEvent.getParameter("arguments").subno;
			var sno = this.getView().byId("sno");
			sno.setValue(sObjectId);
		},

		onF4help: function(evnt) {

			//var sInputValue = evnt.getSource().getValue();
			this.inputIdced = evnt.getSource().getId();
			// this.iddes = this.getView().byId("cedent");
			this.oDialog = new sap.ui.xmlfragment("msg.fragments.myDialoge", this);
			this.getView().addDependent(this.oDialog);

			this.oDialog.setTitle("List of Cedents");

			this.oDialog.attachConfirm(this.onConfirm, this);
			this.oDialog.bindAggregation('items', {
				path: '/CedentSet',
				template: new sap.m.StandardListItem({
					title: "{McName1}",
					description: "{Partner}"
				})
			});
			this.oDialog.open();
		},

		onConfirm: function(oEvent) {

			var oSelectedItem = oEvent.getParameter("selectedItem");
			var cedentInput = this.byId(this.inputIdced);
			var Ceddes = oSelectedItem.getDescription();
			cedentInput.setSelectedKey(Ceddes);
		},

		onF4bro: function(oevent) {

			this.idbro = oevent.getSource().getId();
			var oDialogbro = new sap.ui.xmlfragment("msg.fragments.myDialoge", this);
			this.getView().addDependent(oDialogbro);
			oDialogbro.setTitle("List of Brokers");
			oDialogbro.attachConfirm(this.onConfirmbro, this);
			oDialogbro.bindAggregation('items', {
				path: '/BrokerSHSet',
				template: new sap.m.StandardListItem({
					title: "{McName1}",
					description: "{Partner}"
				})
			});
			oDialogbro.open();
		},

		onConfirmbro: function(evnt) {

			var inputbro = this.byId(this.idbro);
			var brodes = evnt.getParameter("selectedItem").getDescription();
			inputbro.setSelectedKey(brodes);
		},

		onF4btype: function(oevent) {

			this.idbtype = oevent.getSource().getId();
			var oDialogbtype = new sap.ui.xmlfragment("msg.fragments.myDialoge", this);
			this.getView().addDependent(oDialogbtype);
			oDialogbtype.setTitle("List of Business-types");
			oDialogbtype.attachConfirm(this.onConfirmbtype, this);
			oDialogbtype.bindAggregation('items', {
				path: '/ZshBusSatSet',
				template: new sap.m.StandardListItem({
					title: "{Gartbez}",
					description: "{GartnrKbez}"
				})
			});
			oDialogbtype.open();
		},

		onConfirmbtype: function(evnt) {

			var inputbtype = sap.ui.getCore().byId(this.idbtype);
			var btypedes = evnt.getParameter("selectedItem").getDescription();
			inputbtype.setSelectedKey(btypedes);
		},

		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash(),
				oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
				history.go(-1);
			} else {
				oCrossAppNavigator.toExternal({
					target: {
						shellHash: "#Shell-home"
					}
				});
			}
		},

		onF4cob: function(evnt) {

			this.inputIdcob = evnt.getSource().getId();
			var oDialogcob = new sap.ui.xmlfragment("msg.fragments.myDialoge", this);
			this.getView().addDependent(oDialogcob);
			oDialogcob.setTitle("List of COBs");
			oDialogcob.attachConfirm(this.onConfircob, this);
			oDialogcob.bindAggregation('items', {
				path: '/ZshCobSatSet',
				template: new sap.m.StandardListItem({
					title: "{Brchbez}",
					description: "{Brchnr}"
				})
			});
			oDialogcob.open();
		},

		onConfircob: function(evt) {

			var idCob = sap.ui.getCore().byId(this.inputIdcob);
			var cobdes = evt.getParameter("selectedItem").getDescription();
			idCob.setSelectedKey(cobdes);
		},

		onF4Lob: function() {
			var oDialogLob = new sap.ui.xmlfragment("msg.fragments.myDialoge", this);
			oDialogLob.attachConfirm(this.onConfirlob, this);
			oDialogLob.setTitle("List of LOBs");
			oDialogLob.bindAggregation('items', {
				path: '/ZshLobSatSet',
				template: new sap.m.StandardListItem({
					title: "{Node}",
					description: "{Nodebez}"
				})
			});
			oDialogLob.open();
		},

		onConfirlob: function(event) {
			var selvaluedes = event.getParameters().selectedItem.mProperties.description;
			var selvalueid = event.getParameters().selectedItem.mProperties.title;
			var idlob = this.getView().byId("lob");
			var deslob = this.getView().byId("lobdes");
			deslob.setValue(selvaluedes);
			idlob.setValue(selvalueid);
		},

		onF4area: function(evnt) {
			this.idarea = evnt.getSource().getId();
			var oDialogArea = new sap.ui.xmlfragment("msg.fragments.myDialoge", this);
			this.getView().addDependent(oDialogArea);
			oDialogArea.setTitle("List of Areas");
			oDialogArea.attachConfirm(this.onConfirmarea, this);
			oDialogArea.bindAggregation('items', {
				path: '/ZshAreaSatSet',
				template: new sap.m.StandardListItem({
					title: "{Nodebez}",
					description: "{NodeKbez}"
				})
			});
			oDialogArea.open();
		},
		onConfirmarea: function(event) {
			var desarea = sap.ui.getCore().byId(this.idarea);
			var areades = event.getParameter("selectedItem").getDescription();
			desarea.setSelectedKey(areades);
		},

		close_sec: function() {
			this.Dialoge_sec.close();
			this.Dialoge_sec.destroy();
		},
		save_sec: function() {
			debugger;
			var oModel = this.getView().getModel("model1");
			this.data = oModel.getProperty("/ins_table");
			this.data.push({
				ZtreatyType: "Quota",
				Zcob: sap.ui.getCore().byId("cob1").getValue(),
				Zcob_txt: sap.ui.getCore().byId("cob1").getValue().split("(")[1].split(")")[1],
				// Zlob: this.getView().byId("lob1").getValue(),
				// ZlobTxt: this.getView().byId("lobdes1").getValue(),
				Zarea: sap.ui.getCore().byId("area1").getValue(),
				Zarea_txt: sap.ui.getCore().byId("area1").getValue().split("(")[1].split(")")[1],
				ZbusType: sap.ui.getCore().byId("btype").getValue(),
				ZbusType_txt: sap.ui.getCore().byId("btype").getValue().split("(")[1].split(")")[1] //sap.ui.getCore().byId("btype").getValue().split(" ")[1]   
			});
			oModel.setProperty("/ins_table",
				this.data);
			oModel.refresh();
			this.Dialoge_sec.close();
			this.Dialoge_sec.destroy();
		},

		save_section: function(event) {

			this.Dialoge_sec = new sap.ui.xmlfragment("msg.fragments.Dialoge_sec", this);
			this.getView().addDependent(this.Dialoge_sec);
			this.Dialoge_sec.open();
		},
		save_section1: function(oevent) {
			var oModel = this.getView().getModel("model1");
			var data = oModel.getProperty("/ins_table");
			data.push({
				// ZtreatyType: "Quota",
				// ZcobTxt: this.getView().byId("cobdesc").getValue(),
				// ZlobTxt: this.getView().byId("lobdes").getValue(),
				// ZareaTxt: this.getView().byId("desarea").getValue()

				ZtreatyType: "Quota",
				Zcob: this.getView().byId("cob").getValue(),
				ZcobTxt: this.getView().byId("cobdesc").getValue(),
				Zlob: this.getView().byId("lob").getValue(),
				ZlobTxt: this.getView().byId("lobdes").getValue(),
				Zarea: this.getView().byId("area").getValue(),
				ZareaTxt: this.getView().byId("desarea").getValue()
			});
			oModel.setProperty("/ins_table",
				data);
			oModel.refresh();
		},

		delete_section: function(oEvent) {
			var oModel = this.getView().getModel("model1");
			var ins_table = oModel.getProperty("/ins_table");
			var index = ins_table.indexOf(
				sap.ui.getCore()
				.byId("__input6"));
			ins_table.splice(index, 1);
			oModel.refresh();
		},

		Back: function() {
			var that = this;
			MessageBox.confirm("Do you really wanna cancel the changes?", {
				title: "Confirm",
				async: false,
				onClose: function(oAction) {
						// onClose : function(oAction){
						// var ok = new sap.m.MessageBox.Action.OK;	
						if (oAction === "OK") {
							that.onBack();
							// this.oRouter.navTo("worklist", {}, true);
						} else {
							// MessageToast.show("OOPS!! You forgot to delete?");
						}
					}
					//this.onDelete1(model, path)
			});

		},

		save1: function() {
			var that = this;
			MessageBox.confirm("Do you really wanna save the changes?", {
				title: "Confirm",
				async: false,
				onClose: function(oAction) {
						// onClose : function(oAction){
						// var ok = new sap.m.MessageBox.Action.OK;	
						if (oAction === "OK") {
							that.save2();
							// this.oRouter.navTo("worklist", {}, true);
						} else {
							// MessageToast.show("OOPS!! You forgot to delete?");
						}
					}
					//this.onDelete1(model, path)
			});

		},
		save2: function() {
			debugger;
			var subno = this.getView().byId("sno").getValue();
			var section_nav = [];
			if (this.data) {
				for (var i = 0; i < this.data.length; i++) {

					var section_sub = {
						"Mandt": "100",
						"ZsubmissionNum": subno,
						"Zbestnr": String(i + 1),
						"Zcob": this.data[i].Zcob.split("(")[1].split(")")[0], //String(this.data[i].Zcob),//,//this.data[i].Zcob,
						"Zcob_txt": String(this.data[i].Zcob_txt),
						"Zarea": this.data[i].Zarea.split("(")[1].split(")")[0], //String(this.data[i].Zarea), //,// ,
						"Zarea_txt": String(this.data[i].Zarea_txt),
						"Zgartnr": this.data[i].ZbusType.split("(")[1].split(")")[0], //String(this.data[i].ZbusType), //,
						"Zgartnr_txt": String(this.data[i].ZbusType_txt),
						"Zcurrency": "INR"
					};
					section_nav.push(section_sub);
				}
			}

			if (this.getView().byId("Broker").getSelectedKey() === "") {
				var record = {
					"ZsubmissionNum": this.getView().byId("sno").getValue(),
					"ZsubmissionText": "submisson no:" + this.getView().byId("sno").getValue() + ":" + this.getView().byId("subtext").getValue(),
					"Zcedent": this.getView().byId("cedent").getSelectedKey(),
					"ZcedentTxt": String(this.getView().byId("cedent").getValue().split("(")[1].split(")")[1]),
					"Zbroker": "",
					"ZofferRecDt": this.getView().byId("datepic").getValue(),
					"ZbrokerTxt": "",
					"ZtreatyType": "QUOTA",
					"ZtreatyTypTxt": "Quota Share",
					"ZresUwGroup": "TEST@GMAIL.COM",
					"ZsubmitStatus": "07",
					"ZsubStatusTxt": "Created",
					"ZprocessType": "1",
					"ZprocTypeDesc": "New Business",
					"ZcreatedDate": this.getView().byId("datepic").getValue(),
					"SubToSectionNav": section_nav
				};
			}
			if (this.getView().byId("Broker").getSelectedKey() !== "") {
				var record = {
					"ZsubmissionNum": this.getView().byId("sno").getValue(),
					"ZsubmissionText": "submisson no:" + this.getView().byId("sno").getValue() + ":" + this.getView().byId("subtext").getValue(),
					"Zcedent": this.getView().byId("cedent").getSelectedKey(),
					"ZcedentTxt": String(this.getView().byId("cedent").getValue().split("(")[1].split(")")[1]),
					"Zbroker": this.getView().byId("Broker").getSelectedKey(),
					"ZofferRecDt": this.getView().byId("datepic").getValue(),
					"ZbrokerTxt": String(this.getView().byId("Broker").getValue().split("(")[1].split(")")[1]),
					"ZtreatyType": "QUOTA",
					"ZtreatyTypTxt": "Quota Share",
					"ZresUwGroup": "TEST@GMAIL.COM",
					"ZsubmitStatus": "07",
					"ZsubStatusTxt": "Created",
					"ZprocessType": "1",
					"ZprocTypeDesc": "New Business",
					"ZcreatedDate": this.getView().byId("datepic").getValue(),
					"SubToSectionNav": section_nav
				};
			}
			this.getView().getModel().create("/SubmissionSet", record, {
				async: false,
				success: function(oData, response) {
					MessageToast.show("Submission No " + subno + " is Created", {
						width: "40%"
					});
				},
				error: function(oError) {
					MessageBox.error(oError);
				}
			});
			this.onBack();
			this.getView().getModel().refresh();
			this.onBack();
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf msg.view.new
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf msg.view.new
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf msg.view.new
		 */
		//	onExit: function() {
		//
		//	}

	});

});