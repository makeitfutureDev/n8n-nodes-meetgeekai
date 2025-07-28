"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetGeek = void 0;
class MeetGeek {
    constructor() {
        this.description = {
            displayName: 'MeetGeek',
            name: 'meetGeek',
            icon: 'file:meetgeek.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Interact with MeetGeek API',
            defaults: {
                name: 'MeetGeek',
            },
            inputs: ["main" /* NodeConnectionType.Main */],
            outputs: ["main" /* NodeConnectionType.Main */],
            credentials: [
                {
                    name: 'meetGeekApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Meeting',
                            value: 'meeting',
                        },
                        {
                            name: 'Recording',
                            value: 'recording',
                        },
                        {
                            name: 'Highlight',
                            value: 'highlight',
                        },
                        {
                            name: 'Team',
                            value: 'team',
                        },
                        {
                            name: 'Transcript',
                            value: 'transcript',
                        },
                    ],
                    default: 'meeting',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['meeting'],
                        },
                    },
                    options: [
                        {
                            name: 'Get Details',
                            value: 'getDetails',
                            description: 'Get meeting details by ID',
                            action: 'Get meeting details',
                        },
                        {
                            name: 'Get Meeting',
                            value: 'getMeeting',
                            description: 'Search for a specific meeting',
                            action: 'Get meeting',
                        },
                        {
                            name: 'Get Meetings',
                            value: 'getMeetings',
                            description: 'Get list of meetings',
                            action: 'Get meetings',
                        },
                    ],
                    default: 'getMeeting',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['recording'],
                        },
                    },
                    options: [
                        {
                            name: 'Upload',
                            value: 'upload',
                            description: 'Upload a recording for analysis',
                            action: 'Upload recording',
                        },
                    ],
                    default: 'upload',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['highlight'],
                        },
                    },
                    options: [
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Get highlights for a meeting',
                            action: 'Get highlights',
                        },
                    ],
                    default: 'get',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['team'],
                        },
                    },
                    options: [
                        {
                            name: 'Get Teams',
                            value: 'getTeams',
                            description: 'Get list of teams',
                            action: 'Get teams',
                        },
                        {
                            name: 'Get Team Meetings',
                            value: 'getTeamMeetings',
                            description: 'Get meetings for a specific team',
                            action: 'Get team meetings',
                        },
                    ],
                    default: 'getTeams',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['transcript'],
                        },
                    },
                    options: [
                        {
                            name: 'Get Transcripts',
                            value: 'getTranscripts',
                            description: 'Get transcripts for a meeting',
                            action: 'Get transcripts',
                        },
                    ],
                    default: 'getTranscripts',
                },
                // Meeting Details Fields
                {
                    displayName: 'Meeting ID',
                    name: 'meetingId',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: ['meeting'],
                            operation: ['getDetails'],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'The ID of the meeting to retrieve details for',
                },
                // Get Meeting Fields
                {
                    displayName: 'Meeting ID',
                    name: 'meetingId',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: ['meeting'],
                            operation: ['getMeeting'],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'The ID of the meeting to search for',
                },
                // Get Meetings Fields
                {
                    displayName: 'Limit',
                    name: 'limit',
                    type: 'number',
                    displayOptions: {
                        show: {
                            resource: ['meeting'],
                            operation: ['getMeetings'],
                        },
                    },
                    default: 10,
                    description: 'Maximum number of meetings to return',
                },
                {
                    displayName: 'Offset',
                    name: 'offset',
                    type: 'number',
                    displayOptions: {
                        show: {
                            resource: ['meeting'],
                            operation: ['getMeetings'],
                        },
                    },
                    default: 0,
                    description: 'Number of meetings to skip',
                },
                // Upload Recording Fields
                {
                    displayName: 'Download URL',
                    name: 'downloadUrl',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: ['recording'],
                            operation: ['upload'],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'An accessible URL that initiates a direct download when accessed',
                },
                {
                    displayName: 'Template',
                    name: 'template',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: ['recording'],
                            operation: ['upload'],
                        },
                    },
                    default: '',
                    description: 'Meeting template to use. If left blank, MeetGeek will automatically select based on account settings',
                },
                {
                    displayName: 'Language Code',
                    name: 'languageCode',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: ['recording'],
                            operation: ['upload'],
                        },
                    },
                    default: '',
                    description: 'Language code for the recording. If left blank, MeetGeek will auto-detect',
                },
                // Get Highlights Fields
                {
                    displayName: 'Meeting ID',
                    name: 'meetingId',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: ['highlight'],
                            operation: ['get'],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'The ID of the meeting to retrieve highlights for',
                },
                // Get Teams Fields
                {
                    displayName: 'Limit',
                    name: 'limit',
                    type: 'number',
                    displayOptions: {
                        show: {
                            resource: ['team'],
                            operation: ['getTeams'],
                        },
                    },
                    default: 10,
                    description: 'Maximum number of teams to return',
                },
                // Get Team Meetings Fields
                {
                    displayName: 'Team ID',
                    name: 'teamId',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: ['team'],
                            operation: ['getTeamMeetings'],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'The ID of the team to get meetings for',
                },
                {
                    displayName: 'Limit',
                    name: 'limit',
                    type: 'number',
                    displayOptions: {
                        show: {
                            resource: ['team'],
                            operation: ['getTeamMeetings'],
                        },
                    },
                    default: 10,
                    description: 'Maximum number of meetings to return',
                },
                // Get Transcripts Fields
                {
                    displayName: 'Meeting ID',
                    name: 'meetingId',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: ['transcript'],
                            operation: ['getTranscripts'],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'The ID of the meeting to get transcripts for',
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        const credentials = await this.getCredentials('meetGeekApi');
        const baseURL = credentials.token.toString().startsWith('us-')
            ? 'https://app.meetgeek.ai'
            : 'https://app2.meetgeek.ai';
        let responseData;
        for (let i = 0; i < items.length; i++) {
            try {
                if (resource === 'meeting') {
                    if (operation === 'getDetails') {
                        const meetingId = this.getNodeParameter('meetingId', i);
                        const options = {
                            method: 'GET',
                            qs: {},
                            baseURL: baseURL,
                            uri: `/v1/meetings/${meetingId}`,
                            body: {},
                            json: true,
                            useQuerystring: true,
                        };
                        responseData = await this.helpers.requestWithAuthentication.call(this, 'meetGeekApi', options);
                    }
                    if (operation === 'getMeeting') {
                        const meetingId = this.getNodeParameter('meetingId', i);
                        const options = {
                            method: 'GET',
                            qs: {},
                            baseURL: baseURL,
                            uri: `/v1/meetings/${meetingId}`,
                            body: {},
                            json: true,
                            useQuerystring: true,
                        };
                        responseData = await this.helpers.requestWithAuthentication.call(this, 'meetGeekApi', options);
                    }
                    if (operation === 'getMeetings') {
                        const limit = this.getNodeParameter('limit', i);
                        const offset = this.getNodeParameter('offset', i);
                        const options = {
                            method: 'GET',
                            qs: {
                                limit,
                                offset,
                            },
                            baseURL: baseURL,
                            uri: `/v1/meetings`,
                            body: {},
                            json: true,
                            useQuerystring: true,
                        };
                        responseData = await this.helpers.requestWithAuthentication.call(this, 'meetGeekApi', options);
                    }
                }
                if (resource === 'recording') {
                    if (operation === 'upload') {
                        const downloadUrl = this.getNodeParameter('downloadUrl', i);
                        const template = this.getNodeParameter('template', i);
                        const languageCode = this.getNodeParameter('languageCode', i);
                        const body = {
                            download_url: downloadUrl,
                        };
                        if (template) {
                            body.template_name = template;
                        }
                        if (languageCode) {
                            body.language_code = languageCode;
                        }
                        const options = {
                            method: 'POST',
                            qs: {},
                            baseURL: baseURL,
                            uri: `/v1/upload`,
                            body,
                            json: true,
                            useQuerystring: true,
                        };
                        responseData = await this.helpers.requestWithAuthentication.call(this, 'meetGeekApi', options);
                    }
                }
                if (resource === 'highlight') {
                    if (operation === 'get') {
                        const meetingId = this.getNodeParameter('meetingId', i);
                        const options = {
                            method: 'GET',
                            qs: {},
                            baseURL: baseURL,
                            uri: `/v1/meetings/${meetingId}/highlights`,
                            body: {},
                            json: true,
                            useQuerystring: true,
                        };
                        responseData = await this.helpers.requestWithAuthentication.call(this, 'meetGeekApi', options);
                    }
                }
                if (resource === 'team') {
                    if (operation === 'getTeams') {
                        const limit = this.getNodeParameter('limit', i);
                        const options = {
                            method: 'GET',
                            qs: {
                                limit,
                            },
                            baseURL: baseURL,
                            uri: `/v1/teams`,
                            body: {},
                            json: true,
                            useQuerystring: true,
                        };
                        responseData = await this.helpers.requestWithAuthentication.call(this, 'meetGeekApi', options);
                    }
                    if (operation === 'getTeamMeetings') {
                        const teamId = this.getNodeParameter('teamId', i);
                        const limit = this.getNodeParameter('limit', i);
                        const options = {
                            method: 'GET',
                            qs: {
                                limit,
                            },
                            baseURL: baseURL,
                            uri: `/v1/teams/${teamId}/meetings`,
                            body: {},
                            json: true,
                            useQuerystring: true,
                        };
                        responseData = await this.helpers.requestWithAuthentication.call(this, 'meetGeekApi', options);
                    }
                }
                if (resource === 'transcript') {
                    if (operation === 'getTranscripts') {
                        const meetingId = this.getNodeParameter('meetingId', i);
                        const options = {
                            method: 'GET',
                            qs: {},
                            baseURL: baseURL,
                            uri: `/v1/meetings/${meetingId}/transcripts`,
                            body: {},
                            json: true,
                            useQuerystring: true,
                        };
                        responseData = await this.helpers.requestWithAuthentication.call(this, 'meetGeekApi', options);
                    }
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        error: error,
                        json: {}
                    });
                    continue;
                }
                throw error;
            }
            const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
            returnData.push(...executionData);
        }
        return [returnData];
    }
}
exports.MeetGeek = MeetGeek;
