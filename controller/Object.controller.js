sap.ui.define([
	"msg/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"msg/model/formatter",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function(
	BaseController,
	JSONModel,
	History,
	formatter,
	MessageToast,
	MessageBox
) {
	"use strict";
	return BaseController.extend("msg.controller.Object", {
		formatter: formatter,
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */
		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});
			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function() {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});
			var oMessageManager = sap.ui.getCore().getMessageManager();
			this.getView().setModel(oMessageManager.getMessageModel(), "message");
			oMessageManager.registerObject(this.getView(), true);
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

		onDelete: function(event) {
			var that = this;
			// var model = event.getParameters().listItem.oBindingContexts.undefined.getModel();
			// var path = event.getParameters().listItem.oBindingContexts.undefined.getPath();
			var sNo = this.getView().byId("sno").getValue();
			var oModel = this.getView().getModel();
			var path = "/SubmissionSet('" + sNo + "')";
			// this.subnumber = model.getProperty(path).ZsubmissionNum;
			// var sno = this.subnumber;
			MessageBox.confirm("Do you really wanna delete the Submission " + sNo, {
				title: "Confirm",

				onClose: function(oAction) {
						// var ok = new sap.m.MessageBox.Action.OK;	
						if (oAction === "OK") {
							that.onDelete1(oModel, path, sNo);
						} else {
							MessageToast.show("OOPS!! You forgot to delete?");
						}
					}
					//this.onDelete1(model, path)
			});

		},
		onDelete1: function(oModel, oPath, subnum) {
			oModel.remove(oPath, {
				// method: "DELETE",
				// async : false,
				success: function(data) {
					// alert("success" + subnum);
					MessageToast.show("Submission " + subnum + " has been deleted successfully");
				},
				error: function(e) {
					MessageToast.show("Some technical glitches occured, please try after sometime");
				}
			});
			// sap.ui.core.BusyIndicator.hide();
			// this.onRefresh();
			this.onNavBack();
		},

		onConfirlob: function(event) {
			var idlob = this.getView().byId("lob");
			var deslob = this.getView().byId("deslob");
			var selvaluedes = event.getParameters().selectedItem.mProperties.description;
			var selvalueid = event.getParameters().selectedItem.mProperties.title;
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

		onChange: function(oEvent) {
			this.stat = oEvent.getSource().getSelectedKey();

		},
		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */
		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function() {
			var oViewModel = this.getModel("objectView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});
			oShareDialog.open();
		},
		/**
		 * Event handler  for navigating back.
		 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the worklist route.
		 * @public
		 */
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
		cobF4: function(evnt) {
			sap.ui.controller("mgs.new").onConfircob();

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
				this.getRouter().navTo("worklist", {}, true);
			}
		},

		onMessagePopoverPress: function(oEvent) {

			var sam = this.getView();
			var MessagePopover = sap.ui.xmlfragment("msg.fragments.Message_Popover", this);
			this.getView().addDependent(MessagePopover);
			MessagePopover.openBy(oEvent.getSource());
		},
		save_section: function(event) {
			debugger;
			this.Dialoge_sec = new sap.ui.xmlfragment("msg.fragments.Dialoge_sec", this);
			this.getView().addDependent(this.Dialoge_sec);
			this.Dialoge_sec.open();
		},
		close_sec: function() {
			this.Dialoge_sec.close();
			this.Dialoge_sec.destroy();
		},

		save_sec: function() {

			var oModel = this.getView().getModel("SubmissionSet");
			// this.data = oModel.getProperty("/SubToSectionNav");
			this.data_sec({
				ZtreatyType: "Quota",
				Zcob: sap.ui.getCore().byId("cob1").getValue(),
				// ZcobTxt: sap.ui.getCore().byId("cobdesc1").getValue(),
				// Zlob: this.getView().byId("lob1").getValue(),
				// ZlobTxt: this.getView().byId("lobdes1").getValue(),
				Zarea: sap.ui.getCore().byId("area1").getValue(),
				ZbusType: sap.ui.getCore().byId("btype").getValue()
					// ZareaTxt: sap.ui.getCore().byId("desarea1").getValue()
			});
			oModel.setProperty("/ins_table",
				this.data);
			oModel.refresh();
			this.Dialoge_sec.close();
			this.Dialoge_sec.destroy();
		},

		save: function(event) {
debugger;
			var sObjectId = this.getView().byId("sno").getValue();
			var sObjectPath = this.getView().getModel().createKey("/SubmissionSet", {
				ZsubmissionNum: sObjectId
			});
			var record = {
				"ZsubmissionNum": sObjectId,
				"ZsubmissionText": this.getView().byId("stext").getValue(),
				// "ZsubmissionText": "submisson no " + sObjectId +":"+ this.getView().byId("stext").getValue(),
				// "submisson no:" + this.getView().byId("sno").getValue() +":"+ this.getView().byId("subtext").getValue()
				// "Zcedent": "200",
				// "ZcedentTxt": this.getView().byId("cedent").getValue(),
				"Zcedent": this.getView().byId("cedent1").getValue(),
				"ZcedentTxt": this.getView().byId("cedname").getValue(),
				"Zbroker": this.getView().byId("Broker").getValue(),
				"ZbrokerTxt": this.getView().byId("brodesc").getValue(),
				"ZcontractType": "1",
				"ZofferRecDt": this.getView().byId("subdata").getValue(),
				"ZconTypeDescr": "Treaty",
				"ZtreatyNature": "TTY_P",
				"ZtreatyNatTxt": "Treaty Proportional",
				"ZtreatyType": "QUOTA",
				"ZtreatyTypTxt": "Quota Share",
				"ZtreatyNm": "",
				"ZtreatyNmTxt": "",
				"Zcob": this.getView().byId("cob").getValue(),
				"ZcobTxt": this.getView().byId("cobtext").getValue(),
				"ZsubCobTxt": "",
				"Zarea": this.getView().byId("area").getValue(),
				"ZareaTxt": this.getView().byId("desare").getValue(),
				"ZbusType": "52",
				"ZbusTypeTxt": "Domestic",
				"Zcurrency": "INR",
				"ZcurrLongTxt": "Indian Rupee",
				"Zlob": this.getView().byId("lob").getValue(),
				"ZlobTxt": this.getView().byId("deslob").getValue(),
				"ZresUwGroup": "TEST@GMAIL.COM",
				"ZsubmitStatus": "07",
				"ZsubStatusTxt": this.stat,
				"ZprocessType": "1",
				"ZprocTypeDesc": "New Business",
				"ZcreatedDate": this.getView().byId("datec").getValue(),
				"ZcreatedBy": "PERIP",
				"Zdelete": ""
			};
			this.getView().getModel().update(sObjectPath, record, {
				// async : false,
				success: function(oData, response) {
					MessageToast.show("Submission No" + sObjectId + " has been updated successfully", {
						width: "40%"
					});
				},
				error: function(oError) {
					MessageBox.error(oError);
				}
			});
			this.getView().getModel().refresh();
			this.onNavBack();
		},
		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */
		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function(oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;
			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("SubmissionSet", {
					ZsubmissionNum: sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},
		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView: function(sObjectPath) {
			var oViewModel = this.getModel("objectView"),
				oDataModel = this.getModel();
			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oDataModel.metadataLoaded().then(function() {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},
		_onBindingChange: function() {
			var oView = this.getView(),
				oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding();
			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}
			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.ZsubmissionNum,
				sObjectName = oObject.ZsubmissionText;
			// Everything went fine.
			oViewModel.setProperty("/busy", false);
			oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("saveAsTileTitle", [sObjectName]));
			oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		},
		createtreaty: function(event) {

			var snumber = this.getView().byId("sno").getValue();
			var record1 = {
				"Client": "",
				"ZsubmissionNum": this.getView().byId("sno").getValue(),
				"ZsubmissionText": "SUBMISSION by fiori" + this.getView().byId("sno").getValue(), //-----------------------------
				"Zcedent": this.getView().byId("cedent").getValue(),
				"ZofferRecDt": this.getView().byId("datec").getValue(),
				"ZcontractType": "1",
				"ZconTypeDescr": "TREATY",
				"ZpolicyCategory": "",
				"ZpolicyCatText": "",
				"ZpolicyNm": "",
				"ZpolicyNmTxt": "",
				"ZtreatyNm": "",
				"ZtreatyNmTxt": "",
				"ZinvolveBp": "",
				"ZinvolveBpTxt": "",
				"ZsubCob": "",
				"ZsubCobTxt": "",
				"Zcurrency": "INR",
				"ZriskObject": "",
				"ZriskObjectTxt": "",
				"ZresUwGroup": "TEST@GMAIL.COM",
				"ZresSupervisor": "",
				"ZsubmitStatus": "07",
				"ZsubStatusTxt": "In Process",
				"ZprocessType": "1",
				"ZprocTypeDesc": "New Business",
				"ZreassignmentUw": "",
				"ZcreatedBy": "PERIP",
				"ZcreatedDate": "", // 20180410
				"ZcreateTime": "150355",
				"ZchangedBy": "",
				"ZchangedDate": "", //  20180422
				"ZchangeTime": "150408",
				"ZsrcMailid": "",
				"ZbpMailId": "",
				"Zdelete": "",
				"Zattach": "",
				"Vtgbez": "",
				"Gesnr": this.getView().byId("cedent").getValue(),
				"Status": "",
				"Vtgtypnr": "1",
				"ZtreatyNature": "PROBL",
				"Vtgbegdt": "", //this.getView().byId("subdata").getValue(),  // Treaty effective from , start date... 20140101
				"Abrhfgk": "1",
				"Abrsttag": "",
				"BusinYearEnd": "",
				"RmBesteind": "",
				"EtGesnr": "151",
				"Vtgjj": this.getView().byId("subdata").getValue(), //"20140101",
				"Vtgjjedt": this.getView().byId("datee").getValue(),
				"Bukrs": "DEME",
				"Ttyclassno": "3",
				"IntKey": "",
				"TestFlag": false,
				"Verbuchen": "",
				"Bestnr": "",
				"Bestbez": "",
				"ZtreatyType": "QUOT1",
				// "Zcob": "000000000000000000000402",                                              //--------------------------------------------
				"Zcob": this.getView().byId("cob").getValue(),
				"Zarea": this.getView().byId("area").getValue(), //"WORLDWIDE",
				"ZbusType": "0010",
				"PrAbrmod": "A",
				"ScAbrmod": "A",
				"Whgnr": "USD",
				"WhgnrIso": "USD",
				"Kurstyp": "",
				"Antnr": "00000003",
				"Ozkennz": "",
				"Whgdef": "",
				"Sebasis": "",
				"VeGesnr": "",
				"VeGesnrSdn": "",
				"ZhlGesnr": "",
				"ZhlGesnrSdn": "",
				"WaersKursTyp": "",
				"AWhgnr": "USD",
				"AWhgnrIso": "USD",
				"KzVertrag": "",
				"KzDeckung": "",
				"KtWhg": "",
				"Aendgrd": "",
				"Zlob": "CRED",
				"Zbroker": this.getView().byId("Broker").getValue(),
				"ZbrokerTxt": "", //"Broker",
				"ZcedentTxt": "", //this.getView().byId("cedent").getValue(),                   //-----------------------------------------------
				"ZtreatyNatTxt": "Non-Proportional",
				"ZtreatyTypTxt": "Quota Share",
				"ZcobTxt": "", //this.getView().byId("lob").getValue(),
				"ZareaTxt": "", // this.getView().byId("desare").getValue(),
				"ZbusTypeTxt": "Domestic",
				"ZcurrLongTxt": "Indian Rupee",
				"ZlobTxt": "", //this.getView().byId("lob2").getValue(),
				"Statusbez": "",
				"Butxt": "",
				"AendgrdBez": "",
				"McName1": "",
				"Ttyclassnobez": "",
				"Vtgtypbez": "",
				"AbrmodzuoKbez": "",
				"Abrmodzuobez": "",
				"Zqs": "",
				"ZuwLmt": "",
				"Zricomm": "",
				"Zbrokerage": "",
				"BapiRefnr": "",
				"TreatyToSectionNav": [{
					"Mandt": "913",
					"ZsubmissionNum": this.getView().byId("sno").getValue(),
					"Zcob": this.getView().byId("cob").getValue(), //"000000000000000000000402",
					"Zlob": "CRED",
					"Zarea": this.getView().byId("area").getValue(), //"IN",
					"Zbestnr": "0001",
					"Zcurrency": "INR",
					"Zgartnr": "010"
				}]

			};
			this.getView().getModel().create("/TreatySet", record1, {
				async: false,
				success: function(oData, response) {
					MessageToast.show("TreatyNo is created for sumbission number " + snumber);
				}
			}, {
				error: function(oError) {
					MessageBox.error(oError);
				}
			});
			this.getView().getModel().refresh();
			this.onNavBack();
		},

		createtreaty1: function(event) {
          debugger;
          var oTable = this.getView().byId("__table2");
			var bind = oTable.getBinding("items"); 
           
			var that = this;
			var snumber = this.getView().byId("sno").getValue();
			var record1 = {
				"ZsubmissionNum": this.getView().byId("sno").getValue(),
				"ZofferRecDt": this.getView().byId("datec").getValue(),
				"ZtreatyNm": "",
				"ZprocessType": "2",
				"Vtgbez": "",
				"Gesnr": "1000000039",
				"Status": "",
				"Vtgtypnr": "1",
				"ZtreatyNature": "PROBL",
				"Vtgbegdt": "", //this.getView().byId("subdata").getValue(),  // Treaty effective from , start date... 20140101
				"Abrhfgk": "1",
				"BusinYearEnd": "",
				"EtGesnr": "CC_1000", //imp
				"Vtgjj": this.getView().byId("subdata").getValue(), //"20140101",
				"Vtgjjedt": this.getView().byId("datee").getValue(),
				"Bukrs": "1000",
				"Ttyclassno": "3",
				"ZtreatyType": "QUOT1",
				"Zbroker": this.getView().byId("Broker1").getSelectedKey(),
				"BapiRefnr": "",
				"TreToSecTreNav": [{
					"Zcob": "800",
					"Zlob": "CRED",
					"Zarea": "US",
					"Zbestnr": "0001",
					"Zcurrency": "INR",
					"Zgartnr": "010"
				}, {
					"Zcob": "900",
					"Zlob": "CRED",
					"Zarea": "SG",
					"Zbestnr": "0002",
					"Zcurrency": "USD",
					"Zgartnr": "010"
				}]
			};
			this.getView().getModel().create("/TreatySet", record1, {
				async: false,

				success: function(oData, response) {
					MessageToast.show("TreatyNo" + +" is created for sumbission number " + snumber);
					that.onNavBack();
				},

				error: function(oError) {

					var oModel = that.getView().getModel("message");
					that.getOwnerComponent()._oErrorHandler._bMessageOpen = "true";
					oModel.setProperty(oError);
				}

			});
			this.getView().getModel().refresh();

		}
	});
});