import type { INodeProperties } from 'n8n-workflow';

export const teamOperations: INodeProperties[] = [
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
						value: 'getManyTeams',
						description: 'Get list of teams',
						action: 'Get many teams',
					},
					{
						name: 'Get Team Meetings',
						value: 'getTeamMeetings',
						description: 'Get team meetings',
						action: 'Gets team meetings',
					},
				],
				default: 'getManyTeams',
			},
];

export const teamFields: INodeProperties[] = [
// Team Get Many Fields
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['team'],
						operation: ['getManyTeams']
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
						operation: ['getTeamMeetings'],
					},
				},
				default: '',
				required: true,
				description: 'ID of the team(share/view access).',
			},
]
