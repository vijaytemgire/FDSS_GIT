sap.ui.define([
		"msg/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("msg.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);