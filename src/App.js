import React, {useState, useEffect, useRef} from 'react';
import './style.css';
import source from './data.js';

/*
Instruction: Write a simple chat using React and css. Iframe is added as a final result Points to do:
1. Modify the data in component and display the messages. Show the author and content of message. Messages should be sorted by date
2. Add the functionality of adding messages to the chat [DONE]
3. Use style.css to style chat [DONE]
4. Possible to scroll only content in chat [DONE]
5. Send message using `Enter` key [DONE]
6. Clear message after send [DONE]
7. After send message scroll chat to the last message [DONE]
8. If 2 or more messages are consecutive, hide the author [DONE]
9. Your own messages should appear on the right. Rest on the left [DONE]
*/

// let's suppose this is our ID in chat
const MY_CHAT_ID = 'Szymon';

export default function App() {
    const [sortedMessages, setSortedMessages] = useState([]);
    const [messageContent, setMessageContent] = useState('');

    const messagesContainerRef = useRef();

    useEffect(() => {
        const reduced = source.reduce((accumulator, currentValue) => {
            // Let's think if it is possible to simplify this line of code
            currentValue.message.forEach(message => {
                message.author = currentValue.author
                accumulator.push(message);
            })

            return accumulator;
        }, []);

        setSortedMessages(sortMessagesByTime(reduced));
    }, []);

    const sendMessage = (content, author) => {
        setSortedMessages([
            ...sortedMessages,
            {
                content,
                author,
                time: new Date().toISOString(),
            },
        ]);
        setMessageContent('');
    };

    useEffect(() => {
        messagesContainerRef.current.scrollTo({
            top: messagesContainerRef.current.scrollHeight,
            behavior: 'smooth'
        })
    }, [sortedMessages])

    const sortMessagesByTime = (messages) => {
        return messages.sort((a, b) => {
            if (a.time > b.time) {
                return 1;
            }
            if (a.time < b.time) {
                return -1;
            }
            return 0;
        });
    };

    const handleTypingMessage = (e) => {
        setMessageContent(e.target.value);
    };

    const handleSendMessage = (e) => {
        if (e.key !== 'Enter') {
            return;
        }

        const message = e.target.value;

        if (!message) {
            return;
        }

        sendMessage(message, MY_CHAT_ID);
    }

    const isPreviousMessageOnChatFromSameAuthor = (author, index) => {
        const message = sortedMessages?.[index - 1];

        if (!message) {
            return false;
        }

        return author === message.author;
    }

    // In real world we would use ID from database, but in this case
    // we generate key param for in loop generated components by author name, date and text
    const genKeyForMessage = (message) => {
        return message.author + message.content + message.time;
    }

    return (
        <>
            <div className={'chat-wrapper'}>
                <h1 className={'chat-header'}>Chat</h1>
                <div className={'messages-container'} ref={messagesContainerRef}>
                    {sortedMessages.map((message, index) => {
                        return (
                            <div key={genKeyForMessage(message)}
                                 className={`message-wrapper ${MY_CHAT_ID === message.author ? 'message-wrapper--owner' : ''}`}>
                                {!isPreviousMessageOnChatFromSameAuthor(message.author, index)
                                    && <div
                                        className={'message-author'}>{MY_CHAT_ID === message.author ? 'You' : message.author}</div>}
                                <div className={'message'}>
                                    {message.content}
                                </div>
                            </div>

                        );
                    })}
                </div>
                <div className={'message-input-container'}>
                    <input
                        placeholder={'Type a message'}
                        className={'input'}
                        value={messageContent}
                        onChange={handleTypingMessage}
                        onKeyDown={handleSendMessage}
                        type="text"
                    />
                </div>

            </div>
        </>
    );
}
