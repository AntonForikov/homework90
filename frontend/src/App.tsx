import './App.css';
import {useEffect, useRef, useState} from "react";
import {ChatMessage, IncomingMessage} from "./types";
import * as React from "react";

function App() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [messageText, setMessageText] = useState('');
    const [username, setUsername] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const ws = useRef<WebSocket | null>(null);

    const changeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const changeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageText(e.target.value);
    };

    const sendUsername = (e: React.FormEvent) => {
        e.preventDefault();
        if (!ws.current) return;

        ws.current.send(JSON.stringify({type: 'SET_USERNAME', payload: username}));
        setIsLoggedIn(true);
    };

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!ws.current) return;

        ws.current.send(JSON.stringify({type: 'SEND_MESSAGE', payload: messageText}));
    };

    useEffect(() => {
        ws.current = new WebSocket('ws://127.0.0.1:8000/paint');

        ws.current.addEventListener('close', () => console.log('Connection closed'));

        ws.current.addEventListener('message', (msg) => {
            const parsedMsg = JSON.parse(msg.data) as IncomingMessage;

            if (parsedMsg.type === 'WELCOME') {
                console.log(parsedMsg.payload);
            }

            if (parsedMsg.type === 'NEW_MESSAGE') {
                setMessages((prevState) => [...prevState, parsedMsg.payload]);
            }

            return () => {
                if (ws.current) ws.current.close();
            };
        });
    }, []);

    return (
        <>
            {!isLoggedIn
                ? <div>
                    <form onSubmit={sendUsername}>
                        <input
                            name='username'
                            value={username}
                            onChange={changeUsername}
                        />
                        <button type='submit'>LogIn</button>
                    </form>
                </div>
                : <div>
                    <form onSubmit={sendMessage}>
                        <input
                            name='messageText'
                            value={messageText}
                            onChange={changeMessage}
                        />
                        <button type='submit'>Send</button>
                    </form>
                    {messages.map((message, idx) => (
                        <div key={idx}>
                            <b>{message.username}: </b> {message.text}
                        </div>
                    ))}
                </div>
            }
        </>

    )
        ;
}

export default App;
