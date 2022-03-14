import {query} from 'express-validator';


export class UserInfoValidation{

    static info = [
        query('ip').notEmpty().withMessage('ip param is required').isIP().withMessage('enter valid ip address'),
    ]

    static news = [
        query('key').notEmpty().withMessage('key param is required').bail(),
    ]

}