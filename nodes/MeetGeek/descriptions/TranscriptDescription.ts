import type { INodeProperties } from 'n8n-workflow';

export const transcriptOperations: INodeProperties[] = [
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
						value: 'getManyTranscripts',
						description: 'Get list of transcripts for a meeting',
						action: 'Get many transcripts',
					},
					{
						name: 'Get',
						value: 'getTranscript',
						description: 'Get a transcript by ID',
						action: 'Get transcript',
					},
				],
				default: 'getManyTranscripts',
			},
];

export const transcriptFields: INodeProperties[] = [
// Transcript Get Many Fields
            {
                displayName: 'Meeting ID',
                name: 'meetingId',
                type: 'string',
                displayOptions: {
                    show: {
                        resource: ['transcript'],
                        operation: ['getManyTranscripts'],
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
                        operation: ['getManyTranscripts'],
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
                        operation: ['getManyTranscripts'],
                        returnAll: [false],
                    },
                },
                default: 10,
                description: 'Maximum number of transcripts to return per page',
            },
]
