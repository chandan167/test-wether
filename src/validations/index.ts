import { NextFunction, Request, Response } from 'express';
import {validationResult} from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import ApiResponse from '../utils/api-response';

import {UserInfoValidation} from './user-info.validation'



function validate(req:Request, res: Response, next:NextFunction){
    const errorFormat = (err:any) =>{
        return err.msg
    }

    const errors = validationResult(req).formatWith(errorFormat);
    if(!errors.isEmpty()){
        const error = errors.array()[0];
        return (new ApiResponse(res)).setMessage(error).setStatusCode(StatusCodes.UNPROCESSABLE_ENTITY).sendToJson();
    }
    next();
}


export { validate, UserInfoValidation}