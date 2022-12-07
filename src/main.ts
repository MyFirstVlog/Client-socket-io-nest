import './style.css'  
import { connectToServer } from './socket-client';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>
      Websocket client 
    </h1>

    <span>offline</span>
  </div>
`
connectToServer();
// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
