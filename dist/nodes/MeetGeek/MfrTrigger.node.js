"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MfrTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class MfrTrigger {
    constructor() {
        this.description = {
            displayName: 'mfr Trigger',
            name: 'mfrTrigger',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:mfrLogo.png',
            group: ['trigger'],
            version: 1,
            description: 'Starts the workflow when MFR events occur',
            defaults: {
                name: 'mfr Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'mfrApi',
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
                // {
                // 	name: 'setup',
                // 	httpMethod: 'GET',
                // 	responseMode: 'onReceived',
                // 	path: 'webhook',
                // },
            ],
            properties: [
                {
                    displayName: 'WebHookType',
                    name: 'WebHookType',
                    required: true,
                    type: 'options',
                    placeholder: 'Add Webhook Type',
                    options: [
                        {
                            name: 'New Appointment',
                            value: 'NewAppointment'
                        },
                        {
                            name: 'New Company',
                            value: 'NewCompany'
                        },
                        {
                            name: 'New Service Object',
                            value: 'NewServiceObject'
                        },
                        {
                            name: 'New Service Request',
                            value: 'NewServiceRequest'
                        },
                        {
                            name: 'Service Request State Changed',
                            value: 'ServiceRequestStateChanged'
                        },
                    ],
                    default: 'NewAppointment'
                },
                {
                    displayName: 'External ID',
                    name: 'ExternalId',
                    type: 'string',
                    default: '',
                },
            ],
        };
        this.webhookMethods = {
            default: {
                async checkExists() {
                    const webhookData = this.getWorkflowStaticData('node');
                    const webhookUrl = this.getNodeWebhookUrl('default');
                    const WebHookType = this.getNodeParameter('WebHookType');
                    const ExternalId = this.getNodeParameter('ExternalId');
                    const { value } = await GenericFunctions_1.mfrApiRequest.call(this, 'GET', '/WebHooks', {});
                    for (const webhook of value) {
                        // Check if webhook matches by type, callback URL, and optional ExternalId if provided
                        const externalIdMatches = ExternalId ? webhook.ExternalId === ExternalId : true;
                        if (webhook.WebHookType === WebHookType &&
                            webhook.CallbackUrl === webhookUrl &&
                            externalIdMatches) {
                            webhookData.webhookId = webhook.Id;
                            return true;
                        }
                    }
                    // If it did not error then the webhook exists
                    return false;
                },
                async create() {
                    const webhookData = this.getWorkflowStaticData('node');
                    const webhookUrl = this.getNodeWebhookUrl('default');
                    const WebHookType = this.getNodeParameter('WebHookType');
                    const ExternalId = this.getNodeParameter('ExternalId');
                    const body = {
                        //	  'odata.metadata': 'https://portal.mobilefieldreport.com/$metadata#WebHooks/@Element',
                        CallbackUrl: webhookUrl,
                        'WebHookType': WebHookType,
                        'ExternalId': ExternalId
                    };
                    const responseData = await GenericFunctions_1.mfrApiRequest.call(this, 'POST', '/WebHooks', body);
                    if (responseData.Id === undefined || responseData.CallbackUrl === undefined) {
                        // Required data is missing so was not successful
                        return false;
                    }
                    webhookData.webhookId = responseData.Id;
                    return true;
                },
                async delete() {
                    const webhookData = this.getWorkflowStaticData('node');
                    if (webhookData.webhookId !== undefined) {
                        const body = {};
                        try {
                            await GenericFunctions_1.mfrApiRequest.call(this, 'DELETE', `/WebHooks(${webhookData.webhookId}L)`, body);
                        }
                        catch (error) {
                            return false;
                        }
                        // Remove from the static workflow data so that it is clear
                        // that no webhooks are registered anymore
                        delete webhookData.webhookId;
                        delete webhookData.webhookEvents;
                        delete webhookData.hookSecret;
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
exports.MfrTrigger = MfrTrigger;
