import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class MeetGeekApi implements ICredentialType {
	name = 'meetGeekApi';
	displayName = 'MeetGeek API';
	documentationUrl = 'https://docs.meetgeek.ai';
	properties: INodeProperties[] = [
		{
			displayName: 'Token',
			name: 'token',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Generate your API key by going to Integrations -> Public API Card',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Authorization': '=Bearer {{$credentials.token}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.token.startsWith("us-") ? "https://api-us.meetgeek.ai" : "https://api-eu.meetgeek.ai"}}',
			url: '/v1/meetings',
			method: 'GET',
		},
	};
}