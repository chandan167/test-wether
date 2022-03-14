"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
class ApiResponse {
    constructor(response) {
        this.status = http_status_codes_1.StatusCodes.OK;
        this.message = '';
        this.data = {};
        this.response = response;
    }
    setStatusCode(status) {
        this.status = status;
        return this;
    }
    setMessage(message) {
        this.message = message;
        return this;
    }
    setData(data) {
        this.data = data;
        return this;
    }
    sendToJson() {
        return this.response.status(this.status).json(Object.assign({ status: this.status, message: this.message }, this.data));
    }
}
exports.default = ApiResponse;
//# sourceMappingURL=api-response.js.map