import express, {Express, NextFunction, request, Request, Response} from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import createError from 'http-errors';
import {mw} from 'request-ip';
import axios from 'axios';
import config from 'config';

import  {StatusCodes, ReasonPhrases} from 'http-status-codes';


import ApiResponse from './utils/api-response';
import { UserInfoValidation, validate } from './validations';
import asyncResolver from './utils/asyncResolve';
const app:Express = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(mw());

if(process.env.NODE_ENV == 'development'){
    app.use(morgan('dev'));
}



app.get('/user-info', UserInfoValidation.info, validate, asyncResolver(async (req:Request, res:Response, next:NextFunction) =>{
    const {ip} = req.query;
    const apiKey = config.get<string>('api-key')
    // const response = await axios.get("https://dataservice.accuweather.com/locations/v1/cities/search?apikey="+apiKey+"&q=" +city +"")
    const response = await axios.get("http://dataservice.accuweather.com/locations/v1/cities/ipaddress?apikey="+apiKey+"&q="+ip+"")
    const region= response.data.Region
    const country= response.data.Country
    const locationKey = response.data.Key;
    return (new ApiResponse(res)).setData({locationKey, region, country}).sendToJson();
}))


app.get('/news',  UserInfoValidation.news, validate, asyncResolver(async(req:Request, res:Response, next: NextFunction)=>{
    const {key} = req.query;
    const apiKey = config.get<string>('api-key')
    const response = await axios.get("http://dataservice.accuweather.com/forecasts/v1/daily/5day/"+key+"?apikey="+apiKey+"")
    return (new ApiResponse(res)).setData({forecast:response.data.DailyForecasts}).sendToJson();
}))

app.get('/user/weather',  UserInfoValidation.info, validate, asyncResolver(async(req:Request, res:Response, next: NextFunction)=>{
    const {ip} = req.query;
    const apiKey = config.get<string>('api-key')
    const response = await axios.get("http://dataservice.accuweather.com/locations/v1/cities/ipaddress?apikey="+apiKey+"&q="+ip+"")
    const locationKey = response.data.Key;
    const weatherResponse = await axios.get("http://dataservice.accuweather.com/forecasts/v1/daily/1day/"+locationKey+"?apikey="+apiKey+"&metric=true")
    return (new ApiResponse(res)).setData({temperature:weatherResponse.data.DailyForecasts[0].Temperature}).sendToJson();
}))



app.use(function(req:Request, res:Response, next:NextFunction){
    next(createError(StatusCodes.NOT_FOUND));
});

app.use((err:any, req:Request, res:Response, next:NextFunction) =>{
    const stack:any = {};
    if(process.env.NODE_ENV == 'development'){
        stack.stack = err.stack;
    }
    if(err instanceof createError.HttpError || process.env.NODE_ENV == 'development'){
        return new ApiResponse(res).setMessage(err.message).setStatusCode(err.status || StatusCodes.INTERNAL_SERVER_ERROR).setData(stack).sendToJson();
    }

    if(process.env.NODE_ENV == 'production'){
        return new ApiResponse(res).setMessage(ReasonPhrases.INTERNAL_SERVER_ERROR).setStatusCode(err.status || StatusCodes.INTERNAL_SERVER_ERROR).sendToJson();
    }
})


export default app;