import type {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IRequestOptions,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

export class MeetGeekTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'MeetGeek Trigger',
		name: 'meetGeekTrigger',
		icon: 'file:meetgeekicon.svg',
		group: ['trigger'],
		version: 1,
		description: 'Starts the workflow when MeetGeek events occur',
		defaults: {
			name: 'MeetGeek Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
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
					}
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
			{
				displayName: 'Make Token (Use this one until n8n integration card will be added)',
				name: 'makeToken',
				typeOptions: {
					password: true,
				},
				type: 'string',
				default: '',
				required: true,
				description: 'Generate your token by going to [Integrations](https://app.meetgeek.ai/integrations) -> Make API Card.',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				// Check if webhook already exists
				if (webhookData.webhookId) {
					return true;
				}

				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const credentials = await this.getCredentials('meetGeekApi');
			    const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const eventType = this.getNodeParameter('eventType') as string;
				const name = this.getNodeParameter('name') as string;
				const makeToken = this.getNodeParameter('makeToken') as string;

				const baseUrl = credentials.token.toString().startsWith('us-')
					? 'https://us.meetgeek.ai'
					: 'https://app.meetgeek.ai';

				const body = {
					hookUrl: webhookUrl,
					eventType: eventType,
					name: name,
				};

				const headers = {
					"MAKE-TOKEN": makeToken
				};

				const options = {
					method: 'POST',
					headers: headers,
					qs: {},
					uri: `${baseUrl}/integrations/make/subscribe`,
					body,
					json: true,
					useQuerystring: true,
				} as IRequestOptions;

				console.log('MeetGeek Webhook - Create:', JSON.stringify(options, null, 2));

				try {
					const responseData = await this.helpers.request(options);

					console.log(responseData)

					if (responseData.id === undefined) {
						// Required data is missing so was not successful
						return false;
					}

					webhookData.webhookId = responseData.id as string;
					return true;
				} catch (error) {
					return false;
				}
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const credentials = await this.getCredentials('meetGeekApi');
				const makeToken = this.getNodeParameter('makeToken') as string;

				const headers = {
					"MAKE-TOKEN": makeToken
				};

				if (webhookData.webhookId !== undefined) {
					const baseUrl = credentials.token.toString().startsWith('us-')
						? 'https://us.meetgeek.ai'
						: 'https://app.meetgeek.ai';

					const body = {
						hookUrl_id: webhookData.webhookId,
					};

					const options = {
						method: 'DELETE',
						headers: headers,
						qs: {},
						uri: `${baseUrl}/integrations/make/unsubscribe`,
						body,
						json: true,
						useQuerystring: true,
					} as IRequestOptions;

					console.log('MeetGeek Webhook - Delete:', JSON.stringify(options, null, 2));

					try {
						const responseData = await this.helpers.request(options);
						console.log(responseData);
					} catch (error) {
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

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		// The data to return and so start the workflow with
		const bodyData = this.getBodyData();

		return {
			workflowData: [this.helpers.returnJsonArray(bodyData)],
		};
	}
}