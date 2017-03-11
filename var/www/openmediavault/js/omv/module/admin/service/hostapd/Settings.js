/**
 * @license   http://www.gnu.org/licenses/gpl.html GPL Version 3
 * @author    Volker Theile <volker.theile@openmediavault.org>
 * @author    OpenMediaVault Plugin Developers <plugins@omv-extras.org>
 * @copyright Copyright (c) 2009-2013 Volker Theile
 * @copyright Copyright (c) 2013-2017 OpenMediaVault Plugin Developers
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
// require("js/omv/WorkspaceManager.js")
// require("js/omv/workspace/form/Panel.js")

Ext.define("OMV.module.admin.service.hostapd.Settings", {
    extend : "OMV.workspace.form.Panel",

    rpcService   : "Hostapd",
    rpcGetMethod : "get",
    rpcSetMethod : "set",

    getFormItems : function () {
        return [{
            xtype         : "fieldset",
            title         : _("General settings"),
            fieldDefaults : {
                labelSeparator : ""
            },
            items : [{
                xtype      : "checkbox",
                name       : "enable",
                fieldLabel : _("Enable"),
                checked    : false
            },{
                xtype      : "combo",
                name       : "wlan",
                fieldLabel : _("Name"),
                emptyText  : _("Select a device ..."),
                queryMode  : "local",
                store      : Ext.create("OMV.data.Store", {
                    autoLoad : true,
                    model    : OMV.data.Model.createImplicit({
                        idProperty  : "devicename",
                        fields      : [
                            { name : "devicename", type : "string" }
                        ]
                    }),
                    proxy : {
                        type    : "rpc",
                        rpcData : {
                            service : "Network",
                            method  : "getWirelessCandidates"
                        }
                    },
                    sorters : [{
                        direction : "ASC",
                        property  : "devicename"
                    }]
                }),
                displayField   : "devicename",
                valueField     : "devicename",
                allowBlank     : false,
                forceSelection : true,
                triggerAction  : "all"
            },{
                xtype      : "textfield",
                name       : "ssid",
                value      : "openmediavault",
                fieldLabel : _("SSID")
            },{
                xtype      : "textfield",
                name       : "passphrase",
                value      : "openmediavault",
                fieldLabel : _("Passphrase")
            },{
                xtype         : "combo",
                name          : "hw_mode",
                fieldLabel    : _("Hardware Mode"),
                queryMode     : "local",
                store : [
                    [ "a", _("Wireless A or AC") ],
                    [ "b", _("Wireless B") ],
                    [ "g", _("Wireless G") ]
                ],
                editable      : false,
                triggerAction : "all",
                value         : "a"
            },{
                xtype         : "numberfield",
                name          : "channel",
                fieldLabel    : _("Channel"),
                minValue      : 0,
                maxValue      : 80,
                allowDecimals : false,
                allowBlank    : false,
                value         : 1
            },{
                xtype      : "textfield",
                name       : "country_code",
                value      : "US",
                fieldLabel : _("Country Code")
            },{
                xtype      : "textfield",
                name       : "wpa_pass",
                value      : "openmediavault",
                fieldLabel : _("WPA Password")
            }]
        }];
    }
});

OMV.WorkspaceManager.registerPanel({
    id        : "settings",
    path      : "/service/hostapd",
    text      : _("Settings"),
    position  : 10,
    className : "OMV.module.admin.service.hostapd.Settings"
});