<?php
/**
 * @license     http://www.gnu.org/licenses/gpl.html GPL Version 3
 * @author      OpenMediaVault Plugin Developers <plugins@omv-extras.org>
 * @coppright   Copyright (c) 2013-2017 OpenMediaVault Plugin Developers
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
 *
 */
class OMVModuleHostapd extends \OMV\Engine\Module\ServiceAbstract
    implements \OMV\Engine\Notify\IListener, \OMV\Engine\Module\IServiceStatus
{
    public function getName()
    {
        return "hostapd";
    }

    public function applyConfig()
    {
        $cmd = new \OMV\System\Process("omv-mkconf", "hostapd");
        $cmd->setRedirect2to1();
        $cmd->execute();
    }

    public function stopService()
    {
        $systemCtl = new \OMV\System\SystemCtl("hostapd");
        $systemCtl->disable(TRUE);
    }

    public function startService()
    {
        $db = \OMV\Config\Database::getInstance();
        $object = $db->get("conf.service.hostapd");
        if (TRUE !== $object->get("enable"))
            return;
        // Start this service and enable the unit file.
        $systemCtl = new \OMV\System\SystemCtl("hostapd");
        $systemCtl->enable(TRUE);
    }

    public function getStatus()
    {
        $db = \OMV\Config\Database::getInstance();
        $object = $db->get("conf.service.hostapd");
        $systemCtl = new \OMV\System\SystemCtl("hostapd");
        return array(
            "name" => $this->getName(),
            "title" => gettext("hostapd"),
            "enabled" => $object->get("enable"),
            "running" => $systemCtl->isActive()
        );
    }

    public function bindListeners(\OMV\Engine\Notify\Dispatcher $dispatcher)
    {
        $dispatcher->addListener(
            OMV_NOTIFY_MODIFY,
            "org.openmediavault.conf.service.hostapd",
            [ $this, "setDirty" ]
        );
    }
}
