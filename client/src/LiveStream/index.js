import React, { useState, useRef } from "react";
import { Button } from "react-bootstrap";
import axios from 'axios';
import DailyIframe from '@daily-co/daily-js';

const BASE_URL = 'http://localhost:3000';

// let callFrame = DailyIframe.wrap(MY_IFRAME);

const LiveStream = () => {
  const [room, setRoom] = useState(null);
  const [callUrl, setCallUrl] = useState(null);
  const [token, setToken] = useState(null)
  const iFrameRef = useRef();
  let callFrame;

  const createRoom = async () => {
    const resp = await axios.post(`${BASE_URL}/streams`)
    setRoom(resp.data);
    setCallUrl(resp.data.url);
  }

  const createOwnerToken = async () => {
    const resp = await axios.post(
      `${BASE_URL}/streams/${room.name}/token`, { isOwner: true });
    setToken(resp.data)
  }

  const startCall = async () => {
    callFrame = DailyIframe.wrap(iFrameRef.current);
    callFrame.join({ url: `${callUrl}?t=${token}` });
  }

  const deleteRoom = async () => {
    const msg = await axios.delete(`${BASE_URL}/streams/test`);
    setRoom(null);
  }

  const endCall = async () => {
    callFrame.leave();
  }

  return (
    <div>
      <h1> Live Stream! </h1>
      <Button onClick={createRoom}>Create Room</Button>
      <Button onClick={createOwnerToken}>Create Owner Token</Button>
      <Button onClick={startCall}> Start Call </Button>
      <Button onClick={deleteRoom}> Delete Room </Button>
      <Button onClick={endCall}> End Call </Button> <br />
      <iframe
        title="video call iframe"
        ref={iFrameRef}
        style={{ width: "1000px", height: "600px" }}
        allow="camera; microphone; autoplay"
      ></iframe>
    </div>
  );
};

export default LiveStream; 