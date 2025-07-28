import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IDataObject,
	IRequestOptions,
} from 'n8n-workflow';

export class MeetGeek implements INodeType {
	description: INodeTypeDescription = {
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
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
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
				],
				default: 'getDetails',
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
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);
		let responseData;

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'meeting') {
					if (operation === 'getDetails') {
						const meetingId = this.getNodeParameter('meetingId', i) as string;


						const options = {
							method: 'GET',
							qs: {},
							uri: `/v1/meetings/${meetingId}`,
							body: {},
							json: true,
							useQuerystring: true,
						} satisfies IRequestOptions;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'meetGeekApi',
							options,
						);
						returnData.push({ json: responseData });
					}
				}

				if (resource === 'recording') {
					if (operation === 'upload') {
						const downloadUrl = this.getNodeParameter('downloadUrl', i) as string;
						const template = this.getNodeParameter('template', i) as string;
						const languageCode = this.getNodeParameter('languageCode', i) as string;


						const body: IDataObject = {
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
							uri: `/v1/upload`,
							body,
							json: true,
							useQuerystring: true,
						} satisfies IRequestOptions;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'meetGeekApi',
							options,
						);
						returnData.push({ json: responseData });
					}
				}

				if (resource === 'highlight') {
					if (operation === 'get') {
						const meetingId = this.getNodeParameter('meetingId', i) as string;


						const options = {
							method: 'GET',
							qs: {},
							uri: `/v1/meetings/${meetingId}/highlights`,
							body: {},
							json: true,
							useQuerystring: true,
						} satisfies IRequestOptions;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'meetGeekApi',
							options,
						);
						returnData.push({ json: responseData });
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : String(error);
					returnData.push({ json: { error: errorMessage } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}