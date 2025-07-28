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
                description: 'Go to the Integration Tab screen from Settings to find your Token',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    'ZAPIER-TOKEN': '={{$credentials.token}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '={{$credentials.token.startsWith("us-") ? "https://app.meetgeek.ai" : "https://app2.meetgeek.ai"}}',
                url: '/integrations/zapier/connect',
                method: 'GET',
            },
        };
    }
}
exports.MeetGeekApi = MeetGeekApi;
