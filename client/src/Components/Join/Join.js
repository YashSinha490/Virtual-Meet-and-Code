import React, { useContext, useEffect, useRef, useParams, useState } from 'react';
import { SocketContext } from '../../SocketContext';
import './Join.css';
import homeIcon from '../../assets/video-call.png';
import { message } from 'antd';
import Spinner from '../../common/Spinner';
import Navbar from '../Navbar/Navbar';
import { useAuth0, User } from '@auth0/auth0-react';

const Join = (props) => {
  const {
    callAccepted,
    name,
    setName,
    stream,
    setStream,
    callUser,
    meetingCode,
    setMeetingCode,
    newMeet,
  } = useContext(SocketContext);
  // const {user,isAuthenticated}=useAuth0();
  const myPreviewVideo = useRef();
  // const [name,setName] = useState(user.name);
  useEffect(() => {
    if (!newMeet && meetingCode.length === 0) {
      props.history.push('/');
      window.location.reload();
      return;
    }
    // if (stream) return;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((res) => {
        res.getAudioTracks()[0].enabled = false;
        setStream(res);
        myPreviewVideo.current.srcObject = res;
      });
  }, []);

  useEffect(() => {
    if (callAccepted) props.history.push('meet');
  }, [callAccepted]);

  return (
    <>
      <Navbar />
      <div className='join-page'>
        <div>
          <div className='video-div'>
            {stream ? (
              <video
                width='250'
                height='140'
                src=''
                ref={myPreviewVideo}
                autoPlay
                muted
              ></video>
            ) : (
              <Spinner />
            )}
          </div>
          {stream && (
            <>
              <input
                type='text'
                placeholder='Enter your name'
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <div className='join-btns-div'>
                {newMeet ? (
                  <button
                    className='btn'
                    onClick={() => {
                      if (name.trim().length === 0) {
                        message.error('Please enter your name');
                        return;
                      }
                      props.history.push('meet');
                    }}
                  >
                    Start
                  </button>
                ) : (
                  <button
                    className='btn'
                    onClick={() => {
                      if (name.trim().length === 0) {
                        message.error('Please enter your name');
                        return;
                      }

                      callUser(meetingCode);
                    }}
                  >
                    Join now
                  </button>
                )}
                <button
                  className='btn'
                  onClick={() => {
                    setMeetingCode('');
                    props.history.push('/');
                    window.location.reload();
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Join;
