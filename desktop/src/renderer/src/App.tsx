import React, { useEffect, useState } from 'react';

const App: React.FC = () => {
    const [message, setMessage] = useState<string>('');

    // useEffect(() => {
    //     // Example of using the IPC bridge
    //     window.api.receive('fromMain', (data: string) => {
    //         setMessage(data);
    //     });
    // }, []);
    //
    // const sendMessage = () => {
    //     window.api.send('toMain', 'Hello from renderer!');
    // };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Diary Desktop App</h1>
            <button>Send Message to Main</button>
            {message && <p>Response: {message}</p>}
        </div>
    );
};

export default App;
