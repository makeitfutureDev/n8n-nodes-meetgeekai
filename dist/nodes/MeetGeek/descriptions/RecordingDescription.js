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
        description: 'Please consult the [appendix](https://docs.meetgeek.ai/api-reference/v1/appendix-template-names) for all available meeting template options.',
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
        description: 'Please consult the [appendix](https://docs.meetgeek.ai/api-reference/v1/appendix-language-codes) for all available language code options.',
    },
];
