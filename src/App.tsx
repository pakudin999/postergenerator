import React, { useState } from 'react';
import { PosterGeneratorTab } from './components/PosterGeneratorTab';
import { Modal } from './components/shared/Modal';
import { LoadingModal } from './components/shared/LoadingModal';
import { FormData } from './types';

function App() {
    const initialFormData: FormData = {
        uploadedFile: null,
        personFile: null,
        personFiles: [],
        posterDescription: '',
        generatedPrompt: '',
        isProMode: false,
        isBatchPersonMode: false,
        batchResults: null,
    };

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '' });
    const [loadingState, setLoadingState] = useState({ isOpen: false, title: '', message: '' });

    const showModal = (title: string, message: string) => {
        setModalState({ isOpen: true, title, message });
    };

    const hideModal = () => {
        setModalState({ isOpen: false, title: '', message: '' });
    };

    const showLoadingModal = (title: string, message: string) => {
        setLoadingState({ isOpen: true, title, message });
    };

    const hideLoadingModal = () => {
        setLoadingState({ isOpen: false, title: '', message: '' });
    };

    const handleReset = () => {
        // Clean up object URLs
        if (formData.uploadedFile) {
            URL.revokeObjectURL(formData.uploadedFile.previewUrl);
        }
        if (formData.personFile) {
            URL.revokeObjectURL(formData.personFile.previewUrl);
        }
        if (formData.personFiles) {
            formData.personFiles.forEach((f) => URL.revokeObjectURL(f.previewUrl));
        }
        setFormData(initialFormData);
    };

    return (
        <div className="app-container">
            <div className="content-wrapper">
                <PosterGeneratorTab
                    showModal={showModal}
                    showLoadingModal={showLoadingModal}
                    hideLoadingModal={hideLoadingModal}
                    formData={formData}
                    setFormData={setFormData}
                    onReset={handleReset}
                />
            </div>

            <Modal isOpen={modalState.isOpen} onClose={hideModal} title={modalState.title}>
                <p>{modalState.message}</p>
            </Modal>

            <LoadingModal
                isOpen={loadingState.isOpen}
                title={loadingState.title}
                message={loadingState.message}
            />
        </div>
    );
}

export default App;
