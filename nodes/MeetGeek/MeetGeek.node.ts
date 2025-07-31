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

import { highlightFields, highlightOperations } from './descriptions/HighlightDescription';				
import { meetingFields, meetingOperations } from './descriptions/MeetingDescription';
import { recordingFields, recordingOperations } from './descriptions/RecordingDescription';
import { teamFields, teamOperations } from './descriptions/TeamDescription';
import { transcriptFields, transcriptOperations } from './descriptions/TranscriptDescription';

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
			
			// HIGHLIGHT
			...highlightOperations,
			...highlightFields,
			// MEETING
			...meetingOperations,
			...meetingFields,
			// RECORDING
			...recordingOperations,
			...recordingFields,
			// TEAM
			...teamOperations,
			...teamFields,	
			// TRANSCRIPT
			...transcriptOperations,
			...transcriptFields
			
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
					if (operation === 'getMeeting') {
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

					if (operation === 'getManyMeetings') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const limit = returnAll ? 0 : (this.getNodeParameter('limit', i) as number);

						// Always perform paginated requests
						let allMeetings: any[] = [];
						let nextCursor: string | undefined = undefined;
						
						do {
							const qs: any = {};
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
					if (operation === 'getManyHighlights') {
						const meetingId = this.getNodeParameter('meetingId', i) as string;

						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const limit = returnAll ? 0 : (this.getNodeParameter('limit', i) as number);

						// Always perform paginated requests
						let allHighlights: any[] = [];
						let nextCursor: string | undefined = undefined;
						
						do {
							const qs: any = {};
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
					if (operation === 'getManyTeams') {
						const limit = this.getNodeParameter('limit', i) as number;

						const qs: any = {};
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
						} as IRequestOptions;

						console.log('MeetGeek API Request - Get Many Teams:', JSON.stringify(options, null, 2));

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'meetGeekApi',
							options,
						);

						console.log(responseData)
					}

					if (operation === 'getTeam') {
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
				if (operation === 'getManyTranscripts') {
						const meetingId = this.getNodeParameter('meetingId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						// Always perform paginated requests
						const limit = returnAll ? 0 : (this.getNodeParameter('limit', i) as number);
						let allSentences: any[] = [];
						let nextCursor: string | undefined = undefined;
						
						do {
							const qs: any = {};
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
							} as IRequestOptions;

							console.log('MeetGeek API Request - Get Many Transcripts (Paginated):', JSON.stringify(options, null, 2));

							const pageData = await this.helpers.requestWithAuthentication.call(
								this,
								'meetGeekApi',
								options,
							);

							if (pageData.sentences && Array.isArray(pageData.sentences)) {
								allSentences = allSentences.concat(pageData.sentences);
							}

							nextCursor = pageData.pagination?.next_cursor;
							
						} while (nextCursor && (returnAll || allSentences.length < limit));

						// If not returnAll, slice to the requested limit
						responseData = returnAll ? allSentences : allSentences.slice(0, limit);
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