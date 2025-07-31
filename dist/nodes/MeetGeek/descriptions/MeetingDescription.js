"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meetingFields = exports.meetingOperations = void 0;
exports.meetingOperations = [
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
                action: 'Get many meetings',
            },
            {
                name: 'Get',
                value: 'getMeeting',
                description: 'Get a meeting by ID',
                action: 'Get meeting',
            },
        ],
        default: 'getManyMeetings',
    },
];
exports.meetingFields = [
    {
        displayName: 'Meeting ID',
        name: 'meetingId',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['meeting'],
                operation: ['getMeeting'],
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
];
