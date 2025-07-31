import type { INodeProperties } from 'n8n-workflow';

export const meetingOperations: INodeProperties[] = [
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
						value: 'getManyMeetings',
						description: 'Get list of meetings',
						action: 'Gets many meetings',
					},
					{
						name: 'Get Meeting details',
						value: 'getMeeting',
						description: 'Get a meeting by ID',
						action: 'Gets a meeting by ID',
					},
					{
						name: 'Get Meeting summary',
						value: 'getMeetingSummary',
						description: 'Get meeting summary by ID',
						action: 'Gets meeting summary by ID',
					},
				],
				default: 'getManyMeetings',
			},
];

export const meetingFields: INodeProperties[] = [
{
				displayName: 'Meeting ID',
				name: 'meetingId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['meeting'],
						operation: ['getMeeting', 'getMeetingSummary'],
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
						operation: ['getManyMeetings'],
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
						operation: ['getManyMeetings'],
						returnAll: [false],
					},
				},
				default: 10,
				description: 'Maximum number of meetings to return per page',
			},

]
