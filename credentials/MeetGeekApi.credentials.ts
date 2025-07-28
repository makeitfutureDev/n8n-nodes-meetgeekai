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
			description: 'Go to the Integration Tab screen from Settings to find your Token',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'ZAPIER-TOKEN': '={{$credentials.token}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.token.startsWith("us-") ? "https://app.meetgeek.ai" : "https://app2.meetgeek.ai"}}',
			url: '/integrations/zapier/connect',
			method: 'GET',
		},
	};
}