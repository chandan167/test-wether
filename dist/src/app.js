"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
require("./database");
const api_response_1 = __importDefault(require("./utils/api-response"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
if (process.env.NODE_ENV == 'development') {
    app.use((0, morgan_1.default)('dev'));
}
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND));
});
app.use((err, req, res, next) => {
    const stack = {};
    if (process.env.NODE_ENV == 'development') {
        stack.stack = err.stack;
    }
    if (err instanceof http_errors_1.default.HttpError || process.env.NODE_ENV == 'development') {
        return new api_response_1.default(res).setMessage(err.message).setStatusCode(err.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).setData(stack).sendToJson();
    }
    if (process.env.NODE_ENV == 'production') {
        return new api_response_1.default(res).setMessage(http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR).setStatusCode(err.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).sendToJson();
    }
});
exports.default = app;
//# sourceMappingURL=app.js.map