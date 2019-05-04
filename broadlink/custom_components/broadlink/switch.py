"""Support for Broadlink RM devices."""
import binascii
from datetime import timedelta
import logging
import socket

import voluptuous as vol

from homeassistant.components.switch import (
    ENTITY_ID_FORMAT, PLATFORM_SCHEMA, SwitchDevice)
from homeassistant.const import (
    CONF_COMMAND_OFF, CONF_COMMAND_ON, CONF_FRIENDLY_NAME, CONF_HOST, CONF_MAC,
    CONF_SWITCHES, CONF_TIMEOUT, CONF_TYPE)
import homeassistant.helpers.config_validation as cv
from homeassistant.util import Throttle, slugify
from datetime import datetime, timedelta
from . import async_setup_service, data_packet
from .const import CONF_NAME, CONF_COMMANDS, IR_COMMANDS
_LOGGER = logging.getLogger(__name__)

TIME_BETWEEN_UPDATES = timedelta(seconds=5)

DEFAULT_NAME = 'Broadlink switch'
DEFAULT_TIMEOUT = 10
CONF_SLOTS = 'slots'

RM_TYPES = ['rm', 'rm2', 'rm_mini', 'rm_pro_phicomm', 'rm2_home_plus',
            'rm2_home_plus_gdt', 'rm2_pro_plus', 'rm2_pro_plus2',
            'rm2_pro_plus_bl', 'rm_mini_shate']
SP1_TYPES = ['sp1']
SP2_TYPES = ['sp2', 'honeywell_sp2', 'sp3', 'spmini2', 'spminiplus']
MP1_TYPES = ['mp1']
IR_TYPES = ['remote']

SWITCH_TYPES = RM_TYPES + SP1_TYPES + SP2_TYPES + MP1_TYPES + IR_TYPES

SWITCH_SCHEMA = vol.Schema({
    vol.Optional(CONF_COMMAND_OFF): data_packet,
    vol.Optional(CONF_COMMAND_ON): data_packet,
    vol.Optional(CONF_FRIENDLY_NAME): cv.string,
})

MP1_SWITCH_SLOT_SCHEMA = vol.Schema({
    vol.Optional('slot_1'): cv.string,
    vol.Optional('slot_2'): cv.string,
    vol.Optional('slot_3'): cv.string,
    vol.Optional('slot_4'): cv.string
})

PLATFORM_SCHEMA = PLATFORM_SCHEMA.extend({
    vol.Optional(CONF_SWITCHES, default={}):
        cv.schema_with_slug_keys(SWITCH_SCHEMA),
    vol.Optional(CONF_COMMANDS, default={}): vol.Schema({cv.slug: cv.string}),
    vol.Optional(CONF_NAME): cv.string,
    vol.Optional(CONF_SLOTS, default={}): MP1_SWITCH_SLOT_SCHEMA,
    vol.Required(CONF_HOST): cv.string,
    vol.Required(CONF_MAC): cv.string,
    vol.Optional(CONF_FRIENDLY_NAME, default=DEFAULT_NAME): cv.string,
    vol.Optional(CONF_TYPE, default=SWITCH_TYPES[0]): vol.In(SWITCH_TYPES),
    vol.Optional(CONF_TIMEOUT, default=DEFAULT_TIMEOUT): cv.positive_int
})


def setup_platform(hass, config, add_entities, discovery_info=None):
    """Set up the Broadlink switches."""
    import broadlink
    devices = config.get(CONF_SWITCHES)
    slots = config.get('slots', {})
    ip_addr = config.get(CONF_HOST)
    friendly_name = config.get(CONF_FRIENDLY_NAME)
    mac_addr = binascii.unhexlify(
        config.get(CONF_MAC).encode().replace(b':', b''))
    switch_type = config.get(CONF_TYPE)

    commands = config.get(CONF_COMMANDS)
    IR_COMMANDS.update(commands)

    def _get_mp1_slot_name(switch_friendly_name, slot):
        """Get slot name."""
        if not slots['slot_{}'.format(slot)]:
            return '{} slot {}'.format(switch_friendly_name, slot)
        return slots['slot_{}'.format(slot)]
        
    if switch_type in IR_TYPES:
        broadlink_device = broadlink.rm((ip_addr, 80), mac_addr, None)
        name = config.get(CONF_NAME, 'broadlink_rm_' + ip_addr.replace('.', '_'))
        entity_id = ENTITY_ID_FORMAT.format(slugify(name))
        broadlink_rm = BroadlinkRM(hass, name, None, broadlink_device)
        hass.add_job(async_setup_service, hass, ip_addr, entity_id, broadlink_rm)
        switches = [broadlink_rm]

    if switch_type in RM_TYPES:
        broadlink_device = broadlink.rm((ip_addr, 80), mac_addr, None)
        switches = []
        for object_id, device_config in devices.items():
            switches.append(
                BroadlinkRMSwitch(
                    object_id,
                    device_config.get(CONF_FRIENDLY_NAME, object_id),
                    broadlink_device,
                    device_config.get(CONF_COMMAND_ON),
                    device_config.get(CONF_COMMAND_OFF)
                )
            )
    elif switch_type in SP1_TYPES:
        broadlink_device = broadlink.sp1((ip_addr, 80), mac_addr, None)
        switches = [BroadlinkSP1Switch(friendly_name, broadlink_device)]
    elif switch_type in SP2_TYPES:
        broadlink_device = broadlink.sp2((ip_addr, 80), mac_addr, None)
        switches = [BroadlinkSP2Switch(friendly_name, broadlink_device)]
    elif switch_type in MP1_TYPES:
        switches = []
        broadlink_device = broadlink.mp1((ip_addr, 80), mac_addr, None)
        parent_device = BroadlinkMP1Switch(broadlink_device)
        for i in range(1, 5):
            slot = BroadlinkMP1Slot(
                _get_mp1_slot_name(friendly_name, i),
                broadlink_device, i, parent_device)
            switches.append(slot)

    broadlink_device.timeout = config.get(CONF_TIMEOUT)
    try:
        broadlink_device.auth()
    except socket.timeout:
        _LOGGER.error("Failed to connect to device")

    add_entities(switches)

class BroadlinkRM(SwitchDevice):
    """Representation of an Broadlink switch."""

    def __init__(self, hass, name, friendly_name, device):
        """Initialize the switch."""
        self.entity_id = ENTITY_ID_FORMAT.format(slugify(name))
        self._name = friendly_name
        self._state = False
        self._device = device
        self.hass = hass
        self._available = False
    
    @property
    def available(self) -> bool:
        """Return true if power strip is available."""
        return self._available

    @property
    def name(self):
        """Return the name of the switch."""
        return self._name

    @property
    def assumed_state(self):
        """Return true if unable to access real state of entity."""
        return True

    @property
    def should_poll(self):
        """Return the polling state."""
        return False

    @property
    def is_on(self):
        """Return true if device is on."""
        return self._state

    def turn_on(self, **kwargs):
        """Turn the device on."""
        return

    def turn_off(self, **kwargs):
        """Turn the device off."""
        return
    
    def auth(self):
        return self._device.auth()
    def enter_learning(self):
        return self._device.enter_learning()
    def check_data(self):
        return self._device.check_data()
    def send_data(self, packet):
        return self._device.send_data(packet)
class BroadlinkRMSwitch(SwitchDevice):
    """Representation of an Broadlink switch."""

    def __init__(self, name, friendly_name, device, command_on, command_off):
        """Initialize the switch."""
        self.entity_id = ENTITY_ID_FORMAT.format(slugify(name))
        self._name = friendly_name
        self._state = False
        self._command_on = command_on
        self._command_off = command_off
        self._device = device
        self._available = False
        self._last_update_time = datetime.now()
        self._update_force = True  # force update()

    @property
    def available(self) -> bool:
        """Return true if power strip is available."""
        return self._available
        
    @property
    def name(self):
        """Return the name of the switch."""
        return self._name

    @property
    def assumed_state(self):
        """Return true if unable to access real state of entity."""
        return True

    @property
    def should_poll(self):
        """Return the polling state."""
        return False

    @property
    def is_on(self):
        """Return true if device is on."""
        return self._state

    def turn_on(self, **kwargs):
        """Turn the device on."""
        if self._sendpacket(self._command_on):
            self._state = True
            self._update_force = True
            self.schedule_update_ha_state()

    def turn_off(self, **kwargs):
        """Turn the device off."""
        if self._sendpacket(self._command_off):
            self._state = False
            self._update_force = True
            self.schedule_update_ha_state()

    def _sendpacket(self, packet, retry=2):
        """Send packet to device."""
        if packet is None:
            _LOGGER.debug("Empty packet")
            return True
        try:
            self._device.send_data(packet)
        except (socket.timeout, ValueError) as error:
            if retry < 1:
                _LOGGER.error("Error during sending a packet: %s", error)
                return False
            if not self._auth():
                return False
            return self._sendpacket(packet, retry-1)
        return True

    def _auth(self, retry=2):
        try:
            auth = self._device.auth()
        except socket.timeout:
            auth = False
            if retry < 1:
                _LOGGER.error("Timeout during authorization")
        if not auth and retry > 0:
            return self._auth(retry-1)
        return auth


class BroadlinkSP1Switch(BroadlinkRMSwitch):
    """Representation of an Broadlink switch."""

    def __init__(self, friendly_name, device):
        """Initialize the switch."""
        super().__init__(friendly_name, friendly_name, device, None, None)
        self._command_on = 1
        self._command_off = 0
        self._load_power = None

    def _sendpacket(self, packet, retry=2):
        """Send packet to device."""
        try:
            self._device.set_power(packet)
        except (socket.timeout, ValueError) as error:
            if retry < 1:
                _LOGGER.error("Error during sending a packet: %s", error)
                return False
            if not self._auth():
                return False
            return self._sendpacket(packet, retry-1)
        return True


class BroadlinkSP2Switch(BroadlinkSP1Switch):
    """Representation of an Broadlink switch."""

    @property
    def assumed_state(self):
        """Return true if unable to access real state of entity."""
        return False

    @property
    def should_poll(self):
        """Return the polling state."""
        return True

    @property
    def current_power_w(self):
        """Return the current power usage in Watt."""
        try:
            return round(self._load_power, 2)
        except (ValueError, TypeError):
            return None

    def update(self):
        """Synchronize state with switch."""
        # in HA's auto update task, only update_slot call update()
        # TIME_BETWEEN_UPDATES works with a small SCAN_INTERVAL
        if (not self._update_force and
            datetime.now() - self._last_update_time < TIME_BETWEEN_UPDATES):
            pass
        else:
            self._update()
        self._update_force = False

    def _update(self, retry=2):
        """Update the state of the device."""
        self._last_update_time = datetime.now()
        try:
            state = self._device.check_power()
            load_power = self._device.get_energy()
        except (socket.timeout, ValueError) as error:
            if retry < 1:
                if self._available:  # announce once
                    _LOGGER.error("Unable to update socket status, \
                    error: %s", error)
                self._available = False
                return
            if not self._auth():
                if self._available:  # announce once
                    _LOGGER.error("Unable to update socket status, \
                    error: auth failure")
                self._available = False
                return
            return self._update(retry-1)
        if state is None and retry > 0:
            return self._update(retry-1)
        self._state = state
        self._load_power = load_power
        self._available = True

class BroadlinkMP1Slot(BroadlinkRMSwitch):
    """Representation of a slot of Broadlink switch."""

    def __init__(self, friendly_name, device, slot, parent_device):
        """Initialize the slot of switch."""
        super().__init__(friendly_name, friendly_name, device, None, None)
        self._command_on = 1
        self._command_off = 0
        self._slot = slot
        self._parent_device = parent_device

    @property
    def available(self) -> bool:
        """Return true if power strip is available."""
        return self._parent_device.available

    @property
    def assumed_state(self):
        """Return true if unable to access real state of entity."""
        return False

    def _sendpacket(self, packet, retry=2):
        """Send packet to device."""
        try:
            self._device.set_power(self._slot, packet)
        except (socket.timeout, ValueError) as error:
            if retry < 1:
                _LOGGER.error("Error during sending a packet: %s", error)
                return False
            if not self._auth():
                return False
            return self._sendpacket(packet, max(0, retry-1))
        return True

    @property
    def should_poll(self):
        """Return the polling state."""
        return True

    def update(self):
        _LOGGER.debug('entity_id:%s', self.entity_id)
        """Trigger update for all switches on the parent device."""
        # in HA's auto update task, only update_slot call update()
        # TIME_BETWEEN_UPDATES works with a small SCAN_INTERVAL
        if (not self._update_force and
            (datetime.now() - self._parent_device.last_update_time <
             TIME_BETWEEN_UPDATES or
             self._parent_device._update_slot != self._slot)):
            pass
        else:
            self._parent_device.update()
        self._state = self._parent_device.get_outlet_status(self._slot)
        self._update_force = False

class BroadlinkMP1Switch:
    """Representation of a Broadlink switch - To fetch states of all slots."""

    def __init__(self, device):
        """Initialize the switch."""
        self._device = device
        self._states = None
        self._available = False
        self._last_update_time = datetime.now()
        self._update_slot = 1

    @property
    def available(self) -> bool:
        """Return true if power strip is available."""
        return self._available

    @property
    def last_update_time(self):
        return self._last_update_time

    def get_outlet_status(self, slot):
        """Get status of outlet from cached status list."""
        if self._states is None:
            return None
        return self._states['s{}'.format(slot)]

    # @Throttle(TIME_BETWEEN_UPDATES)
    def update(self):
        """Fetch new state data for this device."""
        self._update()

    def _update(self, retry=2):
        """Update the state of the device."""
        self._last_update_time = datetime.now() 
        try:
            states = self._device.check_power()
        except (socket.timeout, ValueError) as error:
            if retry < 1:
                if self._available:  # announce once
                    _LOGGER.error("Unable to update power strip status, \
                    error: %s", error)
                self._available = False
                return
            if not self._auth():
                if self._available:  # announce once
                    _LOGGER.error("Unable to update power strip status, \
                    error: auth failure")
                self._available = False
                return
            return self._update(max(0, retry-1))
        if states is None and retry > 0:
            return self._update(max(0, retry-1))
        self._states = states
        self._available = True

    def _auth(self, retry=2):
        """Authenticate the device."""
        try:
            auth = self._device.auth()
        except socket.timeout:
            auth = False
        if not auth and retry > 0:
            return self._auth(retry-1)
        return auth
