import React, { useState, useRef } from "react";
import { useParams } from 'react-router-dom';
import { Button } from "react-bootstrap";
import axios from 'axios';
import DailyIframe from '@daily-co/daily-js';

const BASE_URL = 'http://localhost:3000';

// let callFrame = DailyIframe.wrap(MY_IFRAME);

const View = () => {
  const { name } = useParams();
  const [room, setRoom] = useState(null);
  const [callUrl, setCallUrl] = useState(null);
  const [token, setToken] = useState(null)
  const iFrameRef = useRef();
  let callFrame;


  const createMeetingToken = async () => {
    const tokenResp = await axios.post(`${BASE_URL}/streams/test/token`);
    setToken(tokenResp.data)
  }

  const joinRoom = async () => {
    const roomResp = await axios.get(`${BASE_URL}/streams/${name}`);
    setRoom(roomResp.data);
    setCallUrl(roomResp.data.url);
  }

  const joinCall = () => {
    callFrame = DailyIframe.wrap(iFrameRef.current);
    callFrame.join({ url: `${callUrl}?t=${token}` });
  }

  const endCall = async () => {
    callFrame.leave();
  };

  return (
    <div>
      <h1> Join Stream! </h1>
      <Button onClick={createMeetingToken}>Create Meeting Token</Button>
      <Button onClick={joinRoom}> Join Room </Button>
      <Button onClick={joinCall}> Join Call </Button>
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

export default View; 