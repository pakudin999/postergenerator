export interface FileData {
    file: File;
    previewUrl: string;
}

export interface FormData {
    uploadedFile: FileData | null;
    personFile: FileData | null;
    personFiles: FileData[];
    posterDescription: string;
    generatedPrompt: string;
    isProMode: boolean;
    isBatchPersonMode: boolean;
    batchResults: any;
}

export interface PersonImagePayload {
    base64: string;
    mime: string;
}
