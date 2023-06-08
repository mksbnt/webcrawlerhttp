const http = require('node:http');
const fetch = require("isomorphic-fetch");

function getProxiesArray(proxiesList) {
    proxiesArray = [];
    for (const proxy of proxiesList) {
        const proxyIp = proxy.Ip;
        const proxyPort = proxy.Port;
        const proxyType = String(proxy.Type[0]).toLowerCase();
        const proxyURL = `${proxyType}://${proxyIp}:${proxyPort}`;
        proxiesArray.push(proxyURL);
    }
    return proxiesArray;
}

async function getProxiesList(baseURL) {
    const proxyAPI = 'https://www.proxyscan.io/api/proxy?type=http&limit=20';
    const response = await fetch(proxyAPI);
    const proxies = await response.json();
    const workingProxies = [];

    const proxyTests = proxies.map((proxy) => proxyCore(proxy.Ip, proxy.Port, baseURL)
        .then((result) => {
            if (result) {
                workingProxies.push(proxy);
            }
        })
        .catch((error) => {
            // Handle the error if needed
            console.error('An error occurred:', error);
        }));

    await Promise.all(proxyTests);
    return workingProxies;
}

async function proxyCore(proxyHost, proxyPort, baseURL) {
    return new Promise((resolve, reject) => {
        const proxyOptions = {
            host: proxyHost, port: proxyPort, path: baseURL, method: 'GET', timeout: 10000
        };

        const req = http.request(proxyOptions, (res) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                // console.log('Proxy is working');
                resolve(true);
            } else {
                // console.log('Proxy is not working');
                resolve(false);
            }
        });

        req.on('error', (error) => {
            // console.error('Error occurred:', error);
            resolve(false);
        });

        req.setTimeout(proxyOptions.timeout, () => {
            req.destroy();
            console.error('Request timed out');
            resolve(false);
        });

        req.end();
    });
}

module.exports = {
    testProxy: proxyCore, getProxiesList, getProxiesArray
}
