"""The broadlink component."""
import asyncio
from base64 import b64decode, b64encode
import logging
import re
import socket

from datetime import timedelta
import voluptuous as vol

from homeassistant.const import CONF_HOST, CONF_ENTITY_ID
import homeassistant.helpers.config_validation as cv
from homeassistant.util.dt import utcnow

from .const import CONF_PACKET, CONF_COMMAND, IR_COMMANDS, DOMAIN, SERVICE_LEARN, SERVICE_SEND

_LOGGER = logging.getLogger(__name__)

DEFAULT_RETRY = 3


def ipv4_address(value):
    """Validate an ipv4 address."""
    regex = re.compile(r'^\d+\.\d+\.\d+\.\d+$')
    if not regex.match(value):
        raise vol.Invalid('Invalid Ipv4 address, expected a.b.c.d')
    return value


def data_packet(value):
    """Decode a data packet given for broadlink."""
    return b64decode(cv.string(value))


SERVICE_SEND_SCHEMA = vol.Schema({
    vol.Required(CONF_HOST): vol.Any(ipv4_address,cv.entity_id),
    vol.Optional(CONF_PACKET): vol.All(cv.ensure_list, [data_packet]),
    vol.Optional(CONF_COMMAND): vol.All(cv.ensure_list, [cv.string])
})

SERVICE_LEARN_SCHEMA = vol.Schema({
    vol.Required(CONF_HOST): vol.Any(ipv4_address,cv.entity_id),
})


def async_setup_service(hass, host, entity_id, device):
    """Register a device for given host for use in services."""
    hass.data.setdefault(DOMAIN, {})[host] = device
    hass.data.setdefault(DOMAIN, {})[entity_id] = device
    if not hass.services.has_service(DOMAIN, SERVICE_LEARN):

        async def _learn_command(call):
            """Learn a packet from remote."""
            device = hass.data[DOMAIN][call.data[CONF_HOST]]

            try:
                auth = await hass.async_add_executor_job(device.auth)
            except socket.timeout:
                _LOGGER.error("Failed to connect to device, timeout")
                device._available = False
                return
            if not auth:
                _LOGGER.error("Failed to connect to device")
                device._available = False
                return
            device._available = True

            await hass.async_add_executor_job(device.enter_learning)

            _LOGGER.info("Press the key you want Home Assistant to learn")
            start_time = utcnow()
            while (utcnow() - start_time) < timedelta(seconds=20):
                packet = await hass.async_add_executor_job(
                    device.check_data)
                if packet:
                    data = b64encode(packet).decode('utf8')
                    log_msg = "Received packet is: {}".\
                              format(data)
                    _LOGGER.info(log_msg)
                    hass.components.persistent_notification.async_create(
                        log_msg, title='Broadlink switch')
                    return
                await asyncio.sleep(1)
            _LOGGER.error("No signal was received")
            hass.components.persistent_notification.async_create(
                "No signal was received", title='Broadlink switch')

        hass.services.async_register(
            DOMAIN, SERVICE_LEARN, _learn_command,
            schema=SERVICE_LEARN_SCHEMA)

    if not hass.services.has_service(DOMAIN, SERVICE_SEND):

        async def _send_packet(call):
            """Send a packet."""
            device = hass.data[DOMAIN][call.data[CONF_HOST]]            
            packets = [data_packet(IR_COMMANDS.get(command)) for command in call.data.get(CONF_COMMAND,[]) ] + call.data.get(CONF_PACKET,[])
            for packet in packets:
                for retry in range(DEFAULT_RETRY):
                    try:
                        await hass.async_add_executor_job(
                            device.send_data, packet)
                        break
                    except (socket.timeout, ValueError):
                        try:
                            await hass.async_add_executor_job(
                                device.auth)
                        except socket.timeout:
                            if retry == DEFAULT_RETRY-1:
                                if device._available:  # announce once
                                    _LOGGER.error("Failed to send packet to device, auth failure")
                                device._available = False
                                return
                await asyncio.sleep(0.6)
                device._available = True

        hass.services.async_register(
            DOMAIN, SERVICE_SEND, _send_packet,
            schema=SERVICE_SEND_SCHEMA)
