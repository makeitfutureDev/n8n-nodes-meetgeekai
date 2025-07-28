import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, IWebhookFunctions, IWebhookResponseData } from 'n8n-workflow';
export declare class MeetGeek implements INodeType {
    description: INodeTypeDescription;
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
    webhook(this: IWebhookFunctions): Promise<IWebhookResponseData>;
}
