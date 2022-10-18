import axios from "axios";
import * as AxiosLogger from 'axios-logger';

import https from "https";
import http from "http"
import { METHODS, requestDataType } from "./types";

const loggerConfig = {
    prefixText: 'INFO',
    dateFormat: 'HH:MM:ss'
}

const instance = axios.create({
    baseURL: "https://restcountries.com",
    timeout: 5000,
    httpAgent: new http.Agent({ keepAlive: true }),
    httpsAgent: new https.Agent({ keepAlive: true }),
});

instance.interceptors.request.use(function (request) {
    return AxiosLogger.requestLogger(request, loggerConfig)
});

instance.interceptors.response.use(function (response) {
    return AxiosLogger.responseLogger(response, loggerConfig)
}, function (error) {
    return AxiosLogger.errorLogger(error, {
        ...loggerConfig,
        prefixText: 'ERROR',
    })
});

class Client {
    public async request(method: METHODS, data: requestDataType) {
        const { url, body, headers, params } = data;

        switch (method) {
            case METHODS.POST:
                return await instance.post(url, body, { headers });
            case METHODS.GET:
                return await instance.get(url, { headers, params });
            case METHODS.PATCH:
                return await instance.patch(url, body, { headers });
            case METHODS.PUT:
                return await instance.put(url, body, { headers });
            case METHODS.DELETE:
                return await instance.delete(url, { headers });
            default:
                throw new Error("Please provide a valid method name.");
        }
    }
}

export const client = new Client();