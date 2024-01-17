![Logo](admin/ethersex.png)

# ioBroker.ethersex

[![Downloads](https://img.shields.io/npm/dm/iobroker.ethersex.svg)](https://www.npmjs.com/package/iobroker.ethersex)
![Number of Installations](https://iobroker.live/badges/ethersex-installed.svg)

## ethersex adapter for ioBroker

Reading 1wire sensor data from ethersex device

## Features

[Ethersex](https://www.ethersex.de/) is a community driven firmware with network support for 8-bit AVR microcontrollers, like AVR 8,16,32,64,128,644 and many more.

This adapter connects to an Ethesex device and reads the temperatures of all connected 1wire devices by using the ECMD protocol.

## Configuration

Just setup the IP address of the server (Ethersex device) and the polling interval.

![](/docs/ethersex_setup.png)

The adapter will create objects for all connected 1wire devices.

![](/docs/ethersex_objects.png)

## Changelog

<!--
	Placeholder for the next version (at the beginning of the line):
	### **WORK IN PROGRESS**
-->

### **WORK IN PROGRESS**

-   (inbux) updated dependencies
-   (inbux) small changes because of axios update

### 0.0.1 (2022-10-09)

-   (inbux) initial release

## License

MIT License

Copyright (c) 2024 inbux <inbux.development@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
