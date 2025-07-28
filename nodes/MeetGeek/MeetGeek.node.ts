import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IDataObject,
	IRequestOptions,
	NodeApiError,
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
						name: 'Get Many',
						value: 'getMany',
						description: 'Get list of meetings',
						action: 'Get many meetings',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a meeting by ID',
						action: 'Get meeting',
					},
				],
				default: 'getMany',
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
						name: 'Get Many',
						value: 'getMany',
						description: 'Get list of highlights for a meeting',
						action: 'Get many highlights',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a highlight by ID',
						action: 'Get highlight',
					},
				],
				default: 'getMany',
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
						name: 'Get Many',
						value: 'getMany',
						description: 'Get list of teams',
						action: 'Get many teams',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a team by ID',
						action: 'Get team',
					},
				],
				default: 'getMany',
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
						name: 'Get Many',
						value: 'getMany',
						description: 'Get list of transcripts for a meeting',
						action: 'Get many transcripts',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a transcript by ID',
						action: 'Get transcript',
					},
				],
				default: 'getMany',
			},
			// Meeting Get Fields
			{
				displayName: 'Meeting ID',
				name: 'meetingId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['meeting'],
						operation: ['get'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the meeting to retrieve',
			},
			// Meeting Get Many Fields
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['meeting'],
						operation: ['getMany'],
					},
				},
				default: false,
				description: 'Whether to return all results by automatically paginating through all pages',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['meeting'],
						operation: ['getMany'],
						returnAll: [false],
					},
				},
				default: 10,
				description: 'Maximum number of meetings to return per page',
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
			// Highlight Get Many Fields
			{
				displayName: 'Meeting ID',
				name: 'meetingId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['highlight'],
						operation: ['getMany'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the meeting to get highlights for',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['highlight'],
						operation: ['getMany'],
					},
				},
				default: false,
				description: 'Whether to return all results by automatically paginating through all pages',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['highlight'],
						operation: ['getMany'],
						returnAll: [false],
					},
				},
				default: 10,
				description: 'Maximum number of highlights to return per page',
			},
			// Highlight Get Fields
			{
				displayName: 'Highlight ID',
				name: 'highlightId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['highlight'],
						operation: ['get'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the highlight to retrieve',
			},
			// Team Get Many Fields
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['team'],
						operation: ['getMany'],
					},
				},
				default: false,
				description: 'Whether to return all results by automatically paginating through all pages',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['team'],
						operation: ['getMany'],
						returnAll: [false],
					},
				},
				default: 10,
				description: 'Maximum number of teams to return per page',
			},
			// Team Get Fields
			{
				displayName: 'Team ID',
				name: 'teamId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['team'],
						operation: ['get'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the team to retrieve',
			},
			// Transcript Get Many Fields
			{
				displayName: 'Meeting ID',
				name: 'meetingId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['transcript'],
						operation: ['getMany'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the meeting to get transcripts for',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['transcript'],
						operation: ['getMany'],
					},
				},
				default: false,
				description: 'Whether to return all results by automatically paginating through all pages',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['transcript'],
						operation: ['getMany'],
						returnAll: [false],
					},
				},
				default: 10,
				description: 'Maximum number of transcripts to return per page',
			},
			// Transcript Get Fields
			{
				displayName: 'Transcript ID',
				name: 'transcriptId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['transcript'],
						operation: ['get'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the transcript to retrieve',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
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
					if (operation === 'get') {
						const meetingId = this.getNodeParameter('meetingId', i) as string;


						const options = {
							method: 'GET',
							qs: {},
							baseURL: baseURL,
							uri: `/v1/meetings/${meetingId}`,
							body: {},
							json: true,
							useQuerystring: true,
						} as IRequestOptions;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'meetGeekApi',
							options,
						);
					}

					if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						let limit = this.getNodeParameter('limit', i) as number;

						if (returnAll) {
							// Get all results by paginating
							let allMeetings: any[] = [];
							let nextCursor: string | undefined = undefined;
							
							do {
								const qs: any = {};
								if (nextCursor) {
									qs.cursor = nextCursor;
								}

								const options = {
									method: 'GET',
									qs,
									baseURL: baseURL,
									uri: `/v1/meetings`,
									body: {},
									json: true,
									useQuerystring: true,
								} as IRequestOptions;

								console.log('MeetGeek API Request - Get Many Meetings (Paginated):', JSON.stringify(options, null, 2));

								const pageData = await this.helpers.requestWithAuthentication.call(
									this,
									'meetGeekApi',
									options,
								);

								if (pageData.meetings && Array.isArray(pageData.meetings)) {
									allMeetings = allMeetings.concat(pageData.meetings);
								}

								nextCursor = pageData.pagination?.next_cursor;
							} while (nextCursor);

							responseData = { meetings: allMeetings };
						} else {
							// Single page request
							const qs: any = { limit };

							const options = {
								method: 'GET',
								qs,
								baseURL: baseURL,
								uri: `/v1/meetings`,
								body: {},
								json: true,
								useQuerystring: true,
							} as IRequestOptions;

							console.log('MeetGeek API Request - Get Many Meetings:', JSON.stringify(options, null, 2));

							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'meetGeekApi',
								options,
							);
						}
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
							baseURL: baseURL,
							uri: `/v1/upload`,
							body,
							json: true,
							useQuerystring: true,
						} as IRequestOptions;

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'meetGeekApi',
							options,
						);
					}
				}

				if (resource === 'highlight') {
					if (operation === 'getMany') {
						const meetingId = this.getNodeParameter('meetingId', i) as string;

						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const cursor = this.getNodeParameter('cursor', i) as string;

						if (returnAll) {
							// Get all results by paginating
							let allHighlights: any[] = [];
							let nextCursor = cursor || undefined;
							
							do {
								const qs: any = {};
								if (nextCursor) {
									qs.cursor = nextCursor;
								}

								const options = {
									method: 'GET',
									qs,
									baseURL: baseURL,
									uri: `/v1/meetings/${meetingId}/highlights`,
									body: {},
									json: true,
									useQuerystring: true,
								} as IRequestOptions;

								console.log('MeetGeek API Request - Get Many Highlights (Paginated):', JSON.stringify(options, null, 2));

								const pageData = await this.helpers.requestWithAuthentication.call(
									this,
									'meetGeekApi',
									options,
								);

								if (pageData.highlights && Array.isArray(pageData.highlights)) {
									allHighlights = allHighlights.concat(pageData.highlights);
								}

								nextCursor = pageData.pagination?.next_cursor;
							} while (nextCursor);

							responseData = allHighlights;
						} else {
							// Single page request
							const limit = this.getNodeParameter('limit', i) as number;
							const qs: any = { limit };

							const options = {
								method: 'GET',
								qs,
								baseURL: baseURL,
								uri: `/v1/meetings/${meetingId}/highlights`,
								body: {},
								json: true,
								useQuerystring: true,
							} as IRequestOptions;

							console.log('MeetGeek API Request - Get Many Highlights:', JSON.stringify(options, null, 2));

							const pageData = await this.helpers.requestWithAuthentication.call(
								this,
								'meetGeekApi',
								options,
							);

							// Return only the highlights array, respecting the limit
							if (pageData.highlights && Array.isArray(pageData.highlights)) {
								responseData = pageData.highlights.slice(0, limit);
							} else {
								responseData = [];
							}
						}
					}

					if (operation === 'get') {
						const highlightId = this.getNodeParameter('highlightId', i) as string;

						const options = {
							method: 'GET',
							qs: {},
							baseURL: baseURL,
							uri: `/v1/highlights/${highlightId}`,
							body: {},
							json: true,
							useQuerystring: true,
						} as IRequestOptions;

						console.log('MeetGeek API Request - Get Highlight:', JSON.stringify(options, null, 2));

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'meetGeekApi',
							options,
						);
					}
				}

				if (resource === 'team') {
					if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const cursor = this.getNodeParameter('cursor', i) as string;
						let limit = this.getNodeParameter('limit', i) as number;

						if (returnAll) {
							// Get all results by paginating
							let allTeams: any[] = [];
							let nextCursor = cursor || undefined;
							
							do {
								const qs: any = {};
								if (nextCursor) {
									qs.cursor = nextCursor;
								}

								const options = {
									method: 'GET',
									qs,
									baseURL: baseURL,
									uri: `/v1/teams`,
									body: {},
									json: true,
									useQuerystring: true,
								} as IRequestOptions;

								console.log('MeetGeek API Request - Get Many Teams (Paginated):', JSON.stringify(options, null, 2));

								const pageData = await this.helpers.requestWithAuthentication.call(
									this,
									'meetGeekApi',
									options,
								);

								if (pageData.teams && Array.isArray(pageData.teams)) {
									allTeams = allTeams.concat(pageData.teams);
								}

								nextCursor = pageData.pagination?.next_cursor;
							} while (nextCursor);

							responseData = { teams: allTeams };
						} else {
							// Single page request
							const qs: any = { limit };
							if (cursor) {
								qs.cursor = cursor;
							}

							const options = {
								method: 'GET',
								qs,
								baseURL: baseURL,
								uri: `/v1/teams`,
								body: {},
								json: true,
								useQuerystring: true,
							} as IRequestOptions;

							console.log('MeetGeek API Request - Get Many Teams:', JSON.stringify(options, null, 2));

							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'meetGeekApi',
								options,
							);
						}
					}

					if (operation === 'get') {
						const teamId = this.getNodeParameter('teamId', i) as string;

						const options = {
							method: 'GET',
							qs: {},
							baseURL: baseURL,
							uri: `/v1/teams/${teamId}`,
							body: {},
							json: true,
							useQuerystring: true,
						} as IRequestOptions;

						console.log('MeetGeek API Request - Get Team:', JSON.stringify(options, null, 2));

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'meetGeekApi',
							options,
						);
					}
				}

				if (resource === 'transcript') {
					if (operation === 'getMany') {
						const meetingId = this.getNodeParameter('meetingId', i) as string;

						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						let limit = this.getNodeParameter('limit', i) as number;

						if (returnAll) {
							// Get all results by paginating
							let allTranscripts: any[] = [];
							let nextCursor: string | undefined = undefined;
							
							do {
								const qs: any = {};
								if (nextCursor) {
									qs.cursor = nextCursor;
								}

								const options = {
									method: 'GET',
									qs,
									baseURL: baseURL,
									uri: `/v1/meetings/${meetingId}/transcripts`,
									body: {},
									json: true,
									useQuerystring: true,
								} as IRequestOptions;

								console.log('MeetGeek API Request - Get Many Transcripts (Paginated):', JSON.stringify(options, null, 2));

								const pageData = await this.helpers.requestWithAuthentication.call(
									this,
									'meetGeekApi',
									options,
								);

								if (pageData.transcripts && Array.isArray(pageData.transcripts)) {
									allTranscripts = allTranscripts.concat(pageData.transcripts);
								}

								nextCursor = pageData.pagination?.next_cursor;
							} while (nextCursor);

							responseData = { transcripts: allTranscripts };
						} else {
							// Single page request
							const qs: any = { limit };

							const options = {
								method: 'GET',
								qs,
								baseURL: baseURL,
								uri: `/v1/meetings/${meetingId}/transcripts`,
								body: {},
								json: true,
								useQuerystring: true,
							} as IRequestOptions;

							console.log('MeetGeek API Request - Get Many Transcripts:', JSON.stringify(options, null, 2));

							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'meetGeekApi',
								options,
							);
						}
					}

					if (operation === 'get') {
						const transcriptId = this.getNodeParameter('transcriptId', i) as string;

						const options = {
							method: 'GET',
							qs: {},
							baseURL: baseURL,
							uri: `/v1/transcripts/${transcriptId}`,
							body: {},
							json: true,
							useQuerystring: true,
						} as IRequestOptions;

						console.log('MeetGeek API Request - Get Transcript:', JSON.stringify(options, null, 2));

						console.log('MeetGeek API Request - Get Meeting:', JSON.stringify(options, null, 2));

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'meetGeekApi',
							options,
						);
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ 
						error: error as NodeApiError, 
						json: {} 
					});
					continue;
				}
				throw error;
			}

			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(responseData as IDataObject[]),
				{ itemData: { item: i } },
			);
			returnData.push(...executionData);
	}
		return [returnData];
	}
}