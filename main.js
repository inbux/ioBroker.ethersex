'use strict';
const axios = require('axios').default || require('axios'); // to avoid error message in vscode

/*
 * Created with @iobroker/create-adapter v2.3.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');
let interval;

// Load your modules here, e.g.:
// const fs = require("fs");

class Ethersex extends utils.Adapter {
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	constructor(options) {
		super({
			...options,
			name: 'ethersex',
		});

		this.netio;
		this.apiConnected = false;
		this.devices = [];
		this.pollingInterval = 5 * 60000;

		this.on('ready', this.onReady.bind(this));
		//this.on("stateChange", this.onStateChange.bind(this));
		// this.on("objectChange", this.onObjectChange.bind(this));
		// this.on("message", this.onMessage.bind(this));
		this.on('unload', this.onUnload.bind(this));
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	async onReady() {
		// Initialize your adapter here

		// The adapters config (in the instance object everything under the attribute "native") is accessible via
		// this.config:

		this.connectToServer();
		if (this.config.interval) this.pollingInterval = this.config.interval * 60000;
		this.log.info('config Polling interval: ' + this.pollingInterval);

		interval = setInterval(() => {
			if (!this.apiConnected) {
				this.connectToServer();
			} else {
				for (const i in this.devices) {
					this.readSensorData(this.devices[i]);
				}
			}
		}, this.pollingInterval);
	}
	// Connect to Server
	async connectToServer() {
		this.log.info('config Server: ' + this.config.server);
		await this.setStateAsync('info.connection', { val: false, ack: true });

		this.netio = axios.create({
			baseURL: `http://${this.config.server}/`,
			insecureHTTPParser: true,
			timeout: 5000,
			headers: {
				'User-Agent': 'Mozilla',
			},
		});

		try {
			const response = await this.netio.get('/ecmd?version');
			if (response.status == 200) {
				this.log.info('Version ' + response.data);
				await this.setStateAsync('info.connection', { val: true, ack: true });
				await this.setStateAsync('info.version', { val: response.data, ack: true });
				this.apiConnected = true;
				this.readSensors();
			}
		} catch (error) {
			console.log(error);
		}
	}

	// Get available 1wire sensors
	async readSensors() {
		try {
			// @ts-ignore
			const response = await this.netio.get('/ecmd?1w list');
			this.devices = response.data.split('\n');
			//this.log.debug(this.devices);
			this.devices.length = this.devices.length - 2; // OK und leere Zeile loeschen

			for (const i in this.devices) {
				this.log.debug('ID: ' + this.devices[i]);
				await this.setObjectNotExistsAsync(this.devices[i], {
					type: 'state',
					common: {
						name: this.devices[i],
						type: 'number',
						role: 'value.temperature',
						unit: '°C',
						read: true,
						write: false,
					},
					native: {},
				});
			}

			for (const i in this.devices) {
				this.readSensorData(this.devices[i]);
			}
		} catch (err) {
			// Set device offline
			this.apiConnected = false;
			await this.setStateAsync('info.connection', { val: this.apiConnected, ack: true });

			this.log.error(err);
		}
	}

	// Get available 1wire sensors
	async readSensorData(sensorID) {
		try {
			// @ts-ignore
			this.log.debug('Reading ' + sensorID);
			if (this.netio != undefined) {
				await this.netio.get('/ecmd?1w convert ' + sensorID);
				const response = await this.netio.get('/ecmd?1w get ' + sensorID);

				this.log.debug(sensorID + ' = ' + response.data + ' °C');

				await this.setStateAsync(sensorID, { val: response.data, ack: true });
			}
		} catch (err) {
			// Set device offline
			this.apiConnected = false;
			await this.setStateAsync('info.connection', { val: this.apiConnected, ack: true });

			this.log.error(err);
		}
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		try {
			// Here you must clear all timeouts or intervals that may still be active
			clearInterval(interval);

			callback();
		} catch (e) {
			callback();
		}
	}
}

if (require.main !== module) {
	// Export the constructor in compact mode
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	module.exports = (options) => new Ethersex(options);
} else {
	// otherwise start the instance directly
	new Ethersex();
}
