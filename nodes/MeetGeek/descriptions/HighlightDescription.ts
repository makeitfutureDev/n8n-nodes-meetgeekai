import type { INodeProperties } from 'n8n-workflow';

export const highlightOperations: INodeProperties[] = [
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
						value: 'getManyHighlights',
						description: 'Get list of highlights for a meeting',
						action: 'Get many highlights',
					},
				],
				default: 'getManyHighlights',
			},
];

export const highlightFields: INodeProperties[] = [
// Highlight Get Many Fields
			{
				displayName: 'Meeting ID',
				name: 'meetingId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['highlight'],
						operation: ['getManyHighlights'],
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
						operation: ['getManyHighlights'],
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
						operation: ['getManyHighlights'],
						returnAll: [false],
					},
				},
				default: 10,
				description: 'Maximum number of highlights to return per page',
			},
		
]
