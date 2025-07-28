"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetGeekTrigger = void 0;
class MeetGeekTrigger {
    constructor() {
        this.description = {
            displayName: 'MeetGeek Trigger',
            name: 'meetGeekTrigger',
            icon: 'file:meetgeek.svg',
            group: ['trigger'],
            version: 1,
            description: 'Starts the workflow when MeetGeek events occur',
            defaults: {
                name: 'MeetGeek Trigger',
            },
            inputs: [],
            outputs: ["main" /* NodeConnectionType.Main */],
            credentials: [
                {
                    name: 'meetGeekApi',
                    required: true,
                },
            ],
            webhooks: [
                {
                    name: 'default',
                    httpMethod: 'POST',
                    responseMode: 'onReceived',
                    path: 'webhook',
                },
            ],
            properties: [
                {
                    displayName: 'Event Type',
                    name: 'eventType',
                    required: true,
                    type: 'options',
                    placeholder: 'Select Event Type',
                    options: [
                        {
                            name: 'New Highlight',
                            value: 'HIGHLIGHT_CREATED',
                            description: 'Triggers when a highlight is created',
                        },
                        {
                            name: 'New Meeting',
                            value: 'MEETING_CREATED',
                            description: 'Triggers when a meeting is created',
                        },
                        {
                            name: 'Share Highlight',
                            value: 'HIGHLIGHT_SHARED',
                            description: 'Triggers when a highlight is shared',
                        },
                        {
                            name: 'Share Meeting',
                            value: 'MEETING_SHARED',
                            description: 'Triggers when a meeting is shared',
                        },
                    ],
                    default: 'HIGHLIGHT_CREATED',
                },
                {
                    displayName: 'Flow Name',
                    name: 'name',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Name for this webhook flow',
                },
            ],
        };
        this.webhookMethods = {
            default: {
                async checkExists() {
                    const webhookData = this.getWorkflowStaticData('node');
                    const credentials = await this.getCredentials('meetGeekApi');
                    const webhookUrl = this.getNodeWebhookUrl('default');
                    const eventType = this.getNodeParameter('eventType');
                    const name = this.getNodeParameter('name');
                    // Check if webhook already exists
                    if (webhookData.webhookId) {
                        return true;
                    }
                    return false;
                },
                async create() {
                    const webhookData = this.getWorkflowStaticData('node');
                    const credentials = await this.getCredentials('meetGeekApi');
                    const webhookUrl = this.getNodeWebhookUrl('default');
                    const eventType = this.getNodeParameter('eventType');
                    const name = this.getNodeParameter('name');
                    const baseUrl = credentials.token.toString().startsWith('us-')
                        ? 'https://app.meetgeek.ai'
                        : 'https://app2.meetgeek.ai';
                    const body = {
                        hookUrl: webhookUrl,
                        eventType: eventType,
                        name: name,
                    };
                    const options = {
                        method: 'POST',
                        qs: {},
                        uri: `${baseUrl}/integrations/zapier/subscribe`,
                        body,
                        json: true,
                        useQuerystring: true,
                    };
                    try {
                        const responseData = await this.helpers.request(options);
                        if (responseData.id === undefined) {
                            // Required data is missing so was not successful
                            return false;
                        }
                        webhookData.webhookId = responseData.id;
                        return true;
                    }
                    catch (error) {
                        return false;
                    }
                },
                async delete() {
                    const webhookData = this.getWorkflowStaticData('node');
                    const credentials = await this.getCredentials('meetGeekApi');
                    if (webhookData.webhookId !== undefined) {
                        const baseUrl = credentials.token.toString().startsWith('us-')
                            ? 'https://app.meetgeek.ai'
                            : 'https://app2.meetgeek.ai';
                        const body = {
                            hookUrl_id: webhookData.webhookId,
                        };
                        const options = {
                            method: 'DELETE',
                            qs: {},
                            uri: `${baseUrl}/integrations/zapier/unsubscribe`,
                            body,
                            json: true,
                            useQuerystring: true,
                        };
                        try {
                            await this.helpers.request(options);
                        }
                        catch (error) {
                            return false;
                        }
                        // Remove from the static workflow data so that it is clear
                        // that no webhooks are registered anymore
                        delete webhookData.webhookId;
                    }
                    return true;
                },
            },
        };
    }
    async webhook() {
        // The data to return and so start the workflow with
        const bodyData = this.getBodyData();
        return {
            workflowData: [this.helpers.returnJsonArray(bodyData)],
        };
    }
}
exports.MeetGeekTrigger = MeetGeekTrigger;
