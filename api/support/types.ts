/* eslint-disable @typescript-eslint/no-explicit-any */
export interface requestDataType {
    url: string;
    body?: any;
    headers?: any;
    params?: any;
}

export enum METHODS {
    POST = "POST",
    GET = "GET",
    DELETE = "DELETE",
    PATCH = "PATCH",
    PUT = "PUT"
}