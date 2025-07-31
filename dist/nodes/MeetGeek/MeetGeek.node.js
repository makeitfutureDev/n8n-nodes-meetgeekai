"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetGeek = void 0;
const HighlightDescription_1 = require("./descriptions/HighlightDescription");
const MeetingDescription_1 = require("./descriptions/MeetingDescription");
const RecordingDescription_1 = require("./descriptions/RecordingDescription");
const TeamDescription_1 = require("./descriptions/TeamDescription");
const TranscriptDescription_1 = require("./descriptions/TranscriptDescription");
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
                // HIGHLIGHT
                ...HighlightDescription_1.highlightOperations,
                ...HighlightDescription_1.highlightFields,
                // MEETING
                ...MeetingDescription_1.meetingOperations,
                ...MeetingDescription_1.meetingFields,
                // RECORDING
                ...RecordingDescription_1.recordingOperations,
                ...RecordingDescription_1.recordingFields,
                // TEAM
                ...TeamDescription_1.teamOperations,
                ...TeamDescription_1.teamFields,
                // TRANSCRIPT
                ...TranscriptDescription_1.transcriptOperations,
                ...TranscriptDescription_1.transcriptFields
            ],
        };
    }
    async execute() {
        var _a, _b, _c;
        const items = this.getInputData();
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        const credentials = await this.getCredentials('meetGeekApi');
        const baseURL = credentials.token.toString().startsWith('us-')
            ? 'https://api-us.meetgeek.ai'
            : 'https://api-eu.meetgeek.ai';
        let responseData;
        for (let i = 0; i < items.length; i++) {
            try {
                if (resource === 'meeting') {
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
                    if (operation === 'getManyMeetings') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const limit = returnAll ? 0 : this.getNodeParameter('limit', i);
                        // Always perform paginated requests
                        let allMeetings = [];
                        let nextCursor = undefined;
                        do {
                            const qs = {};
                            if (nextCursor) {
                                qs.cursor = nextCursor;
                            }
                            if (!returnAll && limit > 0) {
                                qs.limit = limit;
                            }
                            const options = {
                                method: 'GET',
                                qs,
                                baseURL: baseURL,
                                uri: `/v1/meetings`,
                                body: {},
                                json: true,
                                useQuerystring: true,
                            };
                            console.log('MeetGeek API Request - Get Many Meetings (Paginated):', JSON.stringify(options, null, 2));
                            const pageData = await this.helpers.requestWithAuthentication.call(this, 'meetGeekApi', options);
                            if (pageData.meetings && Array.isArray(pageData.meetings)) {
                                allMeetings = allMeetings.concat(pageData.meetings);
                            }
                            nextCursor = (_a = pageData.pagination) === null || _a === void 0 ? void 0 : _a.next_cursor;
                            // If not returnAll, stop when we reach the limit
                            if (!returnAll && allMeetings.length >= limit) {
                                break;
                            }
                        } while (nextCursor);
                        // If not returnAll, slice to the requested limit
                        const meetings = returnAll ? allMeetings : allMeetings.slice(0, limit);
                        responseData = { meetings };
                    }
                }
                if (resource === 'recording') {
                    if (operation === 'uploadRecording') {
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
                    if (operation === 'getManyHighlights') {
                        const meetingId = this.getNodeParameter('meetingId', i);
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const limit = returnAll ? 0 : this.getNodeParameter('limit', i);
                        // Always perform paginated requests
                        let allHighlights = [];
                        let nextCursor = undefined;
                        do {
                            const qs = {};
                            if (nextCursor) {
                                qs.cursor = nextCursor;
                            }
                            if (!returnAll && limit > 0) {
                                qs.limit = limit;
                            }
                            const options = {
                                method: 'GET',
                                qs,
                                baseURL: baseURL,
                                uri: `/v1/meetings/${meetingId}/highlights`,
                                body: {},
                                json: true,
                                useQuerystring: true,
                            };
                            console.log('MeetGeek API Request - Get Many Highlights (Paginated):', JSON.stringify(options, null, 2));
                            const pageData = await this.helpers.requestWithAuthentication.call(this, 'meetGeekApi', options);
                            if (pageData.highlights && Array.isArray(pageData.highlights)) {
                                allHighlights = allHighlights.concat(pageData.highlights);
                            }
                            nextCursor = (_b = pageData.pagination) === null || _b === void 0 ? void 0 : _b.next_cursor;
                            // If not returnAll, stop when we reach the limit
                            if (!returnAll && allHighlights.length >= limit) {
                                break;
                            }
                        } while (nextCursor);
                        // If not returnAll, slice to the requested limit
                        const highlights = returnAll ? allHighlights : allHighlights.slice(0, limit);
                        responseData = { highlights };
                    }
                    if (operation === 'getHighlight') {
                        const highlightId = this.getNodeParameter('highlightId', i);
                        const options = {
                            method: 'GET',
                            qs: {},
                            baseURL: baseURL,
                            uri: `/v1/highlights/${highlightId}`,
                            body: {},
                            json: true,
                            useQuerystring: true,
                        };
                        console.log('MeetGeek API Request - Get Highlight:', JSON.stringify(options, null, 2));
                        responseData = await this.helpers.requestWithAuthentication.call(this, 'meetGeekApi', options);
                    }
                }
                if (resource === 'team') {
                    if (operation === 'getManyTeams') {
                        const limit = this.getNodeParameter('limit', i);
                        const qs = {};
                        if (limit > 0) {
                            qs.limit = limit;
                        }
                        const options = {
                            method: 'GET',
                            qs,
                            baseURL: baseURL,
                            uri: `/v1/teams`,
                            body: {},
                            json: true,
                            useQuerystring: true,
                        };
                        console.log('MeetGeek API Request - Get Many Teams:', JSON.stringify(options, null, 2));
                        responseData = await this.helpers.requestWithAuthentication.call(this, 'meetGeekApi', options);
                        console.log(responseData);
                    }
                    if (operation === 'getTeam') {
                        const teamId = this.getNodeParameter('teamId', i);
                        const options = {
                            method: 'GET',
                            qs: {},
                            baseURL: baseURL,
                            uri: `/v1/teams/${teamId}`,
                            body: {},
                            json: true,
                            useQuerystring: true,
                        };
                        console.log('MeetGeek API Request - Get Team:', JSON.stringify(options, null, 2));
                        responseData = await this.helpers.requestWithAuthentication.call(this, 'meetGeekApi', options);
                    }
                }
                if (resource === 'transcript') {
                    if (operation === 'getManyTranscripts') {
                        const meetingId = this.getNodeParameter('meetingId', i);
                        const returnAll = this.getNodeParameter('returnAll', i);
                        // Always perform paginated requests
                        const limit = returnAll ? 0 : this.getNodeParameter('limit', i);
                        let allSentences = [];
                        let nextCursor = undefined;
                        do {
                            const qs = {};
                            if (nextCursor) {
                                qs.cursor = nextCursor;
                            }
                            if (!returnAll && limit > 0) {
                                qs.limit = limit;
                            }
                            const options = {
                                method: 'GET',
                                qs,
                                baseURL: baseURL,
                                uri: `/v1/meetings/${meetingId}/transcript`,
                                body: {},
                                json: true,
                                useQuerystring: true,
                            };
                            console.log('MeetGeek API Request - Get Many Transcripts (Paginated):', JSON.stringify(options, null, 2));
                            const pageData = await this.helpers.requestWithAuthentication.call(this, 'meetGeekApi', options);
                            if (pageData.sentences && Array.isArray(pageData.sentences)) {
                                allSentences = allSentences.concat(pageData.sentences);
                            }
                            nextCursor = (_c = pageData.pagination) === null || _c === void 0 ? void 0 : _c.next_cursor;
                        } while (nextCursor && (returnAll || allSentences.length < limit));
                        // If not returnAll, slice to the requested limit
                        responseData = returnAll ? allSentences : allSentences.slice(0, limit);
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
