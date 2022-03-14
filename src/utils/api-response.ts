import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export default class ApiResponse{
    private status:number;
    private message:string;
    private data:object;
    private response:Response

    constructor(response:Response){
        this.status = StatusCodes.OK;
        this.message = '';
        this.data = {};
        this.response =response;
    }

    setStatusCode(status:number):this
    {
        this.status = status;
        return this;
    }

    setMessage(message:string):this
    {
        this.message = message;
        return this;
    }

    setData(data:object):this
    {
        this.data = data;
        return this;
    }

    sendToJson()
    {
        return this.response.status(this.status).json({
            status:this.status,
            message:this.message,
            ...this.data
        })
    }
}