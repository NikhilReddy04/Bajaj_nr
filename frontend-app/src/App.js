import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

// WebSocket URL pointing to the Render backend
const client = new W3CWebSocket('wss://bajaj-nr.onrender.com');

function App() {
    const [inputData, setInputData] = useState('');
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState('');
    const [visibleSections, setVisibleSections] = useState({
        fullResponse: true
    });

    useEffect(() => {
        client.onopen = () => {
            console.log('WebSocket Client Connected');
        };

        client.onmessage = (message) => {
            console.log(message.data);
        };
    }, []);

    const isValidJSON = (str) => {
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            return false;
        }
    };

    const handleSubmit = async () => {
        if (!isValidJSON(inputData)) {
            setError('Invalid JSON format');
            return;
        }

        try {
            // Update the URL to point to the deployed backend on Render
            const response = await axios.post('https://bajaj-nr.onrender.com/bfhl', JSON.parse(inputData));
            setResponseData(response.data);
            setError('');
        } catch (error) {
            console.error('Error submitting data:', error);
            setError('Error submitting data: ' + error.message);
        }
    };

    const handleVisibilityChange = () => {
        setVisibleSections(prev => ({
            ...prev,
            fullResponse: !prev.fullResponse
        }));
    };

    return (
        <div>
            <h1>RA2111030010056</h1>
            <textarea
                rows="10"
                cols="50"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder='Enter JSON here...'
            />
            <br />
            <button onClick={handleSubmit}>Submit</button>

            {error && <div style={{ color: 'red' }}>{error}</div>}

            {responseData && (
                <div>
                    <h2>Response:</h2>
                    <label>
                        <input
                            type="checkbox"
                            checked={visibleSections.fullResponse}
                            onChange={handleVisibilityChange}
                        />
                        Full Response
                    </label>
                    {visibleSections.fullResponse && (
                        <div>
                            <pre>{JSON.stringify(responseData, null, 2)}</pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
