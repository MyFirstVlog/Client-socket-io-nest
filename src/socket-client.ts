import { Manager, Socket } from "socket.io-client";

let socket : Socket;

export const connectToServer = (token: string) => {
    // localhost:3000/socket.io/socket.io.js

    const manager = new Manager('localhost:3000/socket.io/socket.io.js', {
        extraHeaders: {
            authentication: token,
        }
    });

    socket?.removeAllListeners(); // evita el problema del disconnected permanente
    socket = manager.socket('/');

    addListeners();
}

const addListeners = () => {
    
    const clienteUl = document.querySelector('#clients-ul')!;
    const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
    const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;
    const messagesUl = document.querySelector<HTMLUListElement>('#messages-ul')!;
    const serverStauslabel = document.querySelector('#server-status')!;

    socket.on('connect', () => {
        console.log('connected');
        serverStauslabel.innerHTML = 'connected';        
    });

    socket.on('disconnect', () => {
        console.log('disconnected');
        serverStauslabel.innerHTML = 'disconnected';
    });

    socket.on('clients-updated', (clients: string[]) => {
        console.log(clients);
        let clientsHTML = '';

        clients.forEach(client => {
            clientsHTML += `
                <li>${client}</li>
            `
        });

        clienteUl.innerHTML = clientsHTML;
    });

    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if(messageInput.value.trim().length <= 0) return;

        socket.emit('message-from-client',{
            id: 'YO!!!', message: messageInput.value
        },);

        messageInput.value = '';
    });

    socket.on('messages-from-server', (payload: {fullName: string, message: string}) => {
        console.log({payload});
        const newMessage = `
            <li>
                <strong>${payload.fullName}</strong>
                <span>${payload.message}</span>
            </li>
        `
        const li = document.createElement('li');
        li.innerHTML = newMessage;
        messagesUl.append(li);
    })
}