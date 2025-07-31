"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordingFields = exports.recordingOperations = void 0;
exports.recordingOperations = [
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
                value: 'uploadRecording',
                description: 'Upload a recording for analysis',
                action: 'Upload recording',
            },
        ],
        default: 'uploadRecording',
    },
];
exports.recordingFields = [
    // Upload Recording Fields
    {
        displayName: 'Download URL',
        name: 'downloadUrl',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['recording'],
                operation: ['uploadRecording'],
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
                operation: ['uploadRecording'],
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
                operation: ['uploadRecording'],
            },
        },
        default: '',
        description: 'Language code for the recording. If left blank, MeetGeek will auto-detect',
    },
];
