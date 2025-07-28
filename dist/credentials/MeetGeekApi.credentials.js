"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetGeekApi = void 0;
class MeetGeekApi {
    constructor() {
        this.name = 'meetGeekApi';
        this.displayName = 'MeetGeek API';
        this.documentationUrl = 'https://docs.meetgeek.ai';
        this.properties = [
            {
                displayName: 'Token',
                name: 'token',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                required: true,
                description: 'Generate your API key by going to Integrations -> Public API Card',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    'Authorization': 'Bearer {{$credentials.token}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: 'https://api.meetgeek.ai',
                url: '/v1/meetings',
                method: 'GET',
            },
        };
    }
}
exports.MeetGeekApi = MeetGeekApi;
