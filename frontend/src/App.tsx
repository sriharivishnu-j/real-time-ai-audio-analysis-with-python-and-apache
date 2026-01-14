import React, { useState } from 'react';
import { motion } from 'framer-motion';

const App: React.FC = () => {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setAudioFile(event.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!audioFile) return;

        const formData = new FormData();
        formData.append('audio', audioFile);

        try {
            const response = await fetch('http://localhost:8000/analyse-audio/', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            setMessage('Error occurred while processing audio');
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
            <h1 className="text-2xl font-bold">Real-time AI Audio Analysis</h1>
            <input type="file" accept="audio/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500" />
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={handleSubmit} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                Analyze Audio
            </motion.button>
            {message && <p className="text-green-500">{message}</p>}
        </div>
    );
};

export default App;
