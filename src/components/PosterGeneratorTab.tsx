import React, { useState, useCallback } from 'react';
import { fileToBase64 } from '../utils/fileUtils';
import { generatePosterPrompt, generateCompositePosterPrompt } from '../services/geminiService';
import { InfoButton } from './shared/InfoButton';
import { CopyButton } from './shared/CopyButton';
import { TextAreaInput } from './shared/FormControls';
import { RetroToggleSwitch } from './shared/RetroToggleSwitch';
import { FileData, PersonImagePayload } from '../types';

interface PosterGeneratorTabProps {
    showModal: (title: string, message: string) => void;
    showLoadingModal: (title: string, message: string) => void;
    hideLoadingModal: () => void;
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    onReset: () => void;
}

export const PosterGeneratorTab = React.memo<PosterGeneratorTabProps>(
    ({ showModal, showLoadingModal, hideLoadingModal, formData, setFormData, onReset }) => {
        const {
            uploadedFile,
            personFile,
            personFiles,
            posterDescription,
            generatedPrompt,
            isProMode,
            isBatchPersonMode,
        } = formData;

        const [isDragging, setIsDragging] = useState(false);
        const [isDraggingPerson, setIsDraggingPerson] = useState(false);

        const handleFile = useCallback(
            (file: File | undefined, type: 'style' | 'person') => {
                if (!file) return;
                if (!['image/jpeg', 'image/png'].includes(file.type)) {
                    showModal('Invalid File Type', 'Please upload a valid JPG or PNG image.');
                    return;
                }

                setFormData((prev: any) => {
                    let targetFileKey = 'uploadedFile';
                    if (type === 'person') targetFileKey = 'personFile';

                    const prevFile = prev[targetFileKey];
                    if (prevFile) URL.revokeObjectURL(prevFile.previewUrl);

                    return {
                        ...prev,
                        [targetFileKey]: { file, previewUrl: URL.createObjectURL(file) },
                        generatedPrompt: '',
                        batchResults: null,
                    };
                });
            },
            [showModal, setFormData]
        );

        const handleBatchPersonFiles = useCallback(
            (files: FileList | null) => {
                if (!files || files.length === 0) return;
                const validFiles = Array.from(files).filter((file) =>
                    ['image/jpeg', 'image/png'].includes(file.type)
                );

                if (validFiles.length === 0) {
                    showModal('Invalid File Type', 'Please upload valid JPG or PNG images.');
                    return;
                }

                const newPersonFiles = validFiles.map((file) => ({
                    file,
                    previewUrl: URL.createObjectURL(file),
                }));

                setFormData((prev: any) => {
                    if (prev.personFiles) {
                        prev.personFiles.forEach((f: any) => URL.revokeObjectURL(f.previewUrl));
                    }
                    return {
                        ...prev,
                        personFiles: newPersonFiles,
                        batchResults: null,
                        generatedPrompt: '',
                    };
                });
            },
            [showModal, setFormData]
        );

        const handleClearBatchFiles = useCallback(() => {
            if (personFiles) {
                personFiles.forEach((f: any) => URL.revokeObjectURL(f.previewUrl));
            }
            setFormData((prev: any) => ({ ...prev, personFiles: [], batchResults: null }));
        }, [personFiles, setFormData]);

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();

            if (!uploadedFile) {
                showModal('Missing Style Image', 'Please upload a Style Reference image.');
                return;
            }
            if (!posterDescription.trim()) {
                showModal('Missing Description', 'Please enter a description for your poster.');
                return;
            }

            if (isProMode && isBatchPersonMode) {
                if (!personFiles || personFiles.length === 0) {
                    showModal(
                        'Missing Images',
                        'Group Mode is ON. Please upload at least one person image.'
                    );
                    return;
                }
                showLoadingModal(
                    'Generating Composite',
                    `Compositing ${personFiles.length} people into one poster prompt...`
                );

                try {
                    const styleBase64 = await fileToBase64(uploadedFile.file);
                    const personImagesPayload: PersonImagePayload[] = await Promise.all(
                        personFiles.map(async (p: any) => ({
                            base64: await fileToBase64(p.file),
                            mime: p.file.type,
                        }))
                    );

                    const prompt = await generateCompositePosterPrompt(
                        styleBase64,
                        uploadedFile.file.type,
                        posterDescription,
                        personImagesPayload
                    );

                    setFormData((prev: any) => ({ ...prev, generatedPrompt: prompt, batchResults: null }));
                } catch (error) {
                    showModal(
                        'Composite Generation Failed',
                        error instanceof Error ? error.message : 'An unknown error occurred.'
                    );
                } finally {
                    hideLoadingModal();
                }
            } else {
                if (isProMode && !personFile) {
                    showModal(
                        'Missing Person Image',
                        'Pro Mode is ON. Please upload an image of the person you want to composite.'
                    );
                    return;
                }

                const modeText = isProMode
                    ? 'Pro Mode: Compositing Person into Poster...'
                    : 'Designing Poster Prompt...';
                showLoadingModal('Generating Prompt', modeText);

                try {
                    const styleBase64 = await fileToBase64(uploadedFile.file);
                    let personBase64 = null;
                    if (isProMode && personFile) {
                        personBase64 = await fileToBase64(personFile.file);
                    }

                    const prompt = await generatePosterPrompt(
                        styleBase64,
                        uploadedFile.file.type,
                        posterDescription,
                        personBase64,
                        personFile?.file.type
                    );

                    setFormData((prev: any) => ({ ...prev, generatedPrompt: prompt, batchResults: null }));
                } catch (error) {
                    showModal(
                        'Generation Failed',
                        error instanceof Error ? error.message : 'An unknown error occurred.'
                    );
                } finally {
                    hideLoadingModal();
                }
            }
        };

        return (
            <div>
                <div className="flex justify-between items-center text-center mb-4">
                    <div className="flex-1" />
                    <h1 className="text-2xl md:text-3xl font-bold flex-1 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                        Poster Prompt Generator
                    </h1>
                    <div className="flex-1 flex justify-end">
                        <InfoButton title="About Poster Generator">
                            <p>Create professional poster prompts by analyzing the style of a reference image.</p>
                            <p className="mt-2">
                                Upload any reference image to copy its artistic style, and optionally composite one
                                or more people into the scene using Pro Mode.
                            </p>
                        </InfoButton>
                    </div>
                </div>

                <p className="text-center text-slate-400 mb-8">
                    Copy the look and feel of any reference image and design your custom poster prompt.
                </p>

                <div className="mb-6 flex flex-col items-center gap-3">
                    <div className="flex items-center bg-slate-800 p-3 rounded-full border border-slate-700 shadow-md">
                        <RetroToggleSwitch
                            id="poster-pro-mode"
                            checked={isProMode || false}
                            onChange={() =>
                                setFormData((prev: any) => ({
                                    ...prev,
                                    isProMode: !prev.isProMode,
                                    isBatchPersonMode: false,
                                }))
                            }
                        />
                        <label htmlFor="poster-pro-mode" className="ml-4 cursor-pointer mr-2">
                            <div className="text-sm font-bold text-white uppercase tracking-wider">
                                Pro Mode: Composite Person
                            </div>
                        </label>
                    </div>
                    {isProMode && (
                        <div className="flex items-center bg-slate-800/50 p-2 rounded-lg animate-fade-in">
                            <RetroToggleSwitch
                                id="poster-batch-mode"
                                checked={isBatchPersonMode || false}
                                onChange={() =>
                                    setFormData((prev: any) => ({
                                        ...prev,
                                        isBatchPersonMode: !prev.isBatchPersonMode,
                                        personFiles: [],
                                        personFile: null,
                                        batchResults: null,
                                        generatedPrompt: '',
                                    }))
                                }
                            />
                            <label
                                htmlFor="poster-batch-mode"
                                className="ml-3 cursor-pointer text-xs font-medium text-slate-300"
                            >
                                Multi-Person Composite Mode (Group Poster)
                            </label>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div
                        className={`grid grid-cols-1 ${isProMode ? 'md:grid-cols-3' : 'md:grid-cols-2'
                            } gap-8 transition-all duration-500 ease-in-out`}
                    >
                        {/* Style Reference Upload */}
                        <div className="space-y-2">
                            <h3 className="text-center text-orange-400 font-bold">1. Style Reference Image</h3>
                            <div
                                onDragOver={(e: React.DragEvent) => {
                                    e.preventDefault();
                                    setIsDragging(true);
                                }}
                                onDragLeave={(e: React.DragEvent) => {
                                    e.preventDefault();
                                    setIsDragging(false);
                                }}
                                onDrop={(e: React.DragEvent) => {
                                    e.preventDefault();
                                    setIsDragging(false);
                                    handleFile(e.dataTransfer.files[0], 'style');
                                }}
                                className={`relative group bg-slate-700 rounded-lg p-4 text-center border-2 transition-all duration-300 min-h-[200px] flex items-center justify-center ${isDragging ? 'border-orange-500 border-dashed bg-slate-600' : 'border-slate-600'
                                    }`}
                            >
                                {uploadedFile ? (
                                    <>
                                        <img
                                            src={uploadedFile.previewUrl}
                                            alt="Style preview"
                                            className="max-h-48 w-auto object-contain rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormData((prev: any) => ({
                                                    ...prev,
                                                    uploadedFile: null,
                                                    generatedPrompt: '',
                                                    batchResults: null,
                                                }))
                                            }
                                            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Remove image"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </>
                                ) : (
                                    <div>
                                        <label
                                            htmlFor="poster-upload"
                                            className="cursor-pointer text-sm text-orange-400 hover:text-orange-300 font-medium"
                                        >
                                            Click to upload Reference
                                        </label>
                                        <p className="text-xs text-slate-400 mt-1">or drag & drop</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="poster-upload"
                                    className="hidden"
                                    accept="image/jpeg,image/png"
                                    onChange={(e) => handleFile(e.target.files?.[0], 'style')}
                                />
                            </div>
                        </div>

                        {/* Person Image Upload (Pro Mode) */}
                        {isProMode && (
                            <div className="space-y-2 animate-fade-in">
                                <h3 className="text-center text-green-400 font-bold">
                                    {isBatchPersonMode ? '2. Group People to Composite' : '2. Person to Composite'}
                                </h3>

                                {isBatchPersonMode ? (
                                    <div
                                        onDragOver={(e: React.DragEvent) => {
                                            e.preventDefault();
                                            setIsDraggingPerson(true);
                                        }}
                                        onDragLeave={(e: React.DragEvent) => {
                                            e.preventDefault();
                                            setIsDraggingPerson(false);
                                        }}
                                        onDrop={(e: React.DragEvent) => {
                                            e.preventDefault();
                                            setIsDraggingPerson(false);
                                            handleBatchPersonFiles(e.dataTransfer.files);
                                        }}
                                        className={`relative group bg-slate-700 rounded-lg p-4 text-center border-2 transition-all duration-300 min-h-[200px] flex flex-col items-center justify-center ${isDraggingPerson
                                                ? 'border-green-500 border-dashed bg-slate-600'
                                                : 'border-slate-600'
                                            }`}
                                    >
                                        {personFiles && personFiles.length > 0 ? (
                                            <>
                                                <div className="grid grid-cols-3 gap-2 w-full mb-2 max-h-36 overflow-y-auto custom-scrollbar p-1">
                                                    {personFiles.map((fileData: any, index: number) => (
                                                        <img
                                                            key={index}
                                                            src={fileData.previewUrl}
                                                            alt={`Person ${index}`}
                                                            className="h-16 w-full object-cover rounded-md border border-slate-500"
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-sm text-white font-medium mb-2">
                                                    {personFiles.length} person(s) in group
                                                </p>
                                                <div className="flex gap-2">
                                                    <label
                                                        htmlFor="batch-person-upload"
                                                        className="cursor-pointer bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-3 rounded transition-colors"
                                                    >
                                                        Add More
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={handleClearBatchFiles}
                                                        className="bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-3 rounded transition-colors"
                                                    >
                                                        Clear All
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div>
                                                <label
                                                    htmlFor="batch-person-upload"
                                                    className="cursor-pointer text-sm text-green-400 hover:text-green-300 font-medium"
                                                >
                                                    Click to upload Group
                                                </label>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    Combine multiple photos into one prompt
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            id="batch-person-upload"
                                            className="hidden"
                                            accept="image/jpeg,image/png"
                                            multiple
                                            onChange={(e) => handleBatchPersonFiles(e.target.files)}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        onDragOver={(e: React.DragEvent) => {
                                            e.preventDefault();
                                            setIsDraggingPerson(true);
                                        }}
                                        onDragLeave={(e: React.DragEvent) => {
                                            e.preventDefault();
                                            setIsDraggingPerson(false);
                                        }}
                                        onDrop={(e: React.DragEvent) => {
                                            e.preventDefault();
                                            setIsDraggingPerson(false);
                                            handleFile(e.dataTransfer.files[0], 'person');
                                        }}
                                        className={`relative group bg-slate-700 rounded-lg p-4 text-center border-2 transition-all duration-300 min-h-[200px] flex items-center justify-center ${isDraggingPerson
                                                ? 'border-green-500 border-dashed bg-slate-600'
                                                : 'border-slate-600'
                                            }`}
                                    >
                                        {personFile ? (
                                            <>
                                                <img
                                                    src={personFile.previewUrl}
                                                    alt="Person preview"
                                                    className="max-h-48 w-auto object-contain rounded-md"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setFormData((prev: any) => ({
                                                            ...prev,
                                                            personFile: null,
                                                            generatedPrompt: '',
                                                            batchResults: null,
                                                        }))
                                                    }
                                                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title="Remove image"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </button>
                                            </>
                                        ) : (
                                            <div>
                                                <label
                                                    htmlFor="person-upload"
                                                    className="cursor-pointer text-sm text-green-400 hover:text-green-300 font-medium"
                                                >
                                                    Click to upload Person
                                                </label>
                                                <p className="text-xs text-slate-400 mt-1">or drag & drop</p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            id="person-upload"
                                            className="hidden"
                                            accept="image/jpeg,image/png"
                                            onChange={(e) => handleFile(e.target.files?.[0], 'person')}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Content Description */}
                        <div className="space-y-2">
                            <h3 className="text-center text-slate-200 font-bold">
                                {isProMode ? '3. Poster Content' : '2. Poster Content'}
                            </h3>
                            <TextAreaInput
                                label="Describe your poster topic:"
                                name="posterDescription"
                                value={posterDescription}
                                onChange={(e) =>
                                    setFormData((prev: any) => ({ ...prev, posterDescription: e.target.value }))
                                }
                                rows={8}
                                placeholder="e.g., A vintage travel poster for Mars. Feature a red landscape, a retro rocket ship, and bold typography saying 'Visit Mars'."
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            type="submit"
                            className="flex-1 w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center space-x-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>
                                {isBatchPersonMode ? `Generate Group Composite Prompt` : 'Generate Poster Prompt'}
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={onReset}
                            className="bg-slate-700 hover:bg-red-500/20 text-slate-300 hover:text-red-400 font-medium py-3 px-4 rounded-lg transition duration-300 ease-in-out"
                            title="Reset Tab"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z"
                                />
                            </svg>
                        </button>
                    </div>
                </form>

                {/* Result Section */}
                {generatedPrompt && (
                    <div className="mt-10 animate-fade-in">
                        <h2 className="text-xl font-bold text-slate-200 mb-4 border-b border-slate-700 pb-2">
                            Generated Poster Prompt
                        </h2>
                        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-bold text-orange-400">
                                    {isProMode && isBatchPersonMode
                                        ? 'Content + Style + Group Composite'
                                        : isProMode
                                            ? 'Content + Style + Composited Person'
                                            : 'Content + Style'}
                                </h3>
                                <CopyButton textToCopy={generatedPrompt} />
                            </div>
                            <textarea
                                value={generatedPrompt}
                                className="w-full bg-transparent border-0 text-slate-300 focus:ring-0 resize-none italic text-sm leading-relaxed"
                                rows={8}
                                readOnly
                            />
                        </div>
                    </div>
                )}

                <div className="text-center text-xs text-slate-500 mt-8 pt-4 border-t border-slate-700">
                    © {new Date().getFullYear()} @konten_beban
                </div>
            </div>
        );
    }
);
