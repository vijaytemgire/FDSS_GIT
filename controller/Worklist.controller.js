sap.ui.define([
	"msg/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"msg/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function(BaseController, JSONModel, History, formatter, Filter, FilterOperator, MessageToast, MessageBox) {
	"use strict";

	return BaseController.extend("msg.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			var oViewModel,
				iOriginalBusyDelay,
				oTable = this.byId("table");

			// Put down worklist table's original value for busy indicator delay,
			// so it can be restored later on. Busy handling on the table is
			// taken care of by the table itself.
			iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			// keeps the search state
			this._oTableSearchState = [];

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
				saveAsTileTitle: this.getResourceBundle().getText("worklistViewTitle"),
				shareOnJamTitle: this.getResourceBundle().getText("worklistViewTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
				tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay: 0
			});
			this.setModel(oViewModel, "worklistView");

			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			oTable.attachEventOnce("updateFinished", function() {
				// Restore original busy indicator delay for worklist's table
				oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			});
		},
		RowHighlight: function(oValue) {
			// Your logic for rowHighlight goes here

			try {
				// fValue = parseFloat(fValue);
				if (oValue === undefined) {
					return "None";
				} else if (oValue === "Completed" || oValue === "Complete" || oValue === "COMPLETE") {
					return "Success";
				} else if (oValue === "In Process") {
					return "Warning";
				} else if (oValue === "Created") {
					return "Error";
				} else {
					return "Error";
				}
			} catch (err) {
				return "None";
			}

		},
	newEntry: function() {
			var that = this;
		 this.getView().getModel().read("/GenerateSubNoSet('0001')", {
				success: function(oData, response) {
					var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
					oRouter.navTo("new", {
						subno: oData.Submission_No
					});
				},
				error: function(oError) {
				}
			}); 
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function(oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("worklistTableTitle");
			}
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress: function(oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},

		/**
		 * Event handler for navigating back.
		 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
		 * If not, it will navigate to the shell home
		 * @public
		 */
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
		
		onDelete: function(event){
			   
			var that = this;
			var model = event.getParameters().listItem.oBindingContexts.undefined.getModel();
			var path = event.getParameters().listItem.oBindingContexts.undefined.getPath();
			this.subnumber = model.getProperty(path).ZsubmissionNum;
			var sno = this.subnumber;
			MessageBox.confirm("Do you really wanna delete the Submission " + this.subnumber,{
				title: "Confirm",
				async : false,
				onClose:  function(oAction){
					   // onClose : function(oAction){
				// var ok = new sap.m.MessageBox.Action.OK;	
				if(oAction === "OK"){
					that.onDelete1(model, path, sno);
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
					MessageToast.show("Submission " +  subnum  + " has been deleted successfully" );
				},
				error: function(e) {
					MessageToast.show("Some technical glitches occured, please try after sometime");
				}
			});
			// sap.ui.core.BusyIndicator.hide();
			// this.onRefresh();
			
},
		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function() {
			var oViewModel = this.getModel("worklistView"),
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
		onSearch1: function(oEvt) {
			   
			// add filter for search
			var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("ZsubmissionNum", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}

			// update list binding
			var list = this.byId("table");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},

		onSearch: function(oEvent) {
			   
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var oTableSearchState = [];
				var sQuery = oEvent.getParameter("query");

				if (sQuery && sQuery.length > 0) {
					oTableSearchState = [new Filter("ZsubmissionNum", FilterOperator.Contains, sQuery)];
				}
				this._applySearch(oTableSearchState);
			}

		},
		onSearch2: function(oEvn){
			
			   
			var selval=	oEvn.getParameter("newValue");
       
       var fil1 = new sap.ui.model.Filter("Zcedent", sap.ui.model.FilterOperator.Contains, selval);
       //var fil2 = new sap.ui.model.Filter("McName1", sap.ui.model.FilterOperator.Contains, selval);
       //var fil3 = [fil1, fil2];
       //var fil4 = new sap.ui.model.Filter({filters:fil3, and:false});
       var lisdiag = oEvn.getSource().getParent().getParent();
       lisdiag.getBinding("items").filter(fil1);

			
			
		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function() {
			var oTable = this.byId("table");
			oTable.getBinding("items").refresh();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showObject: function(oItem) {
			debugger;
			this.getRouter().navTo("object", {
				objectId: oItem.getBindingContext().getProperty("ZsubmissionNum")
			});
			var model =this.getView().getModel("message");
			model.destroy();
			model.setData(null);
			model.setProperty("");
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {object} oTableSearchState an array of filters for the search
		 * @private
		 */
		_applySearch: function(oTableSearchState) {
			   
			var oTable = this.byId("table"),
				oViewModel = this.getModel();
			oTable.getBinding("items").filter(oTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (oTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			}
		}

	});
});