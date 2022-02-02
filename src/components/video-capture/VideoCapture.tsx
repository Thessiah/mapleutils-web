import { PropsWithChildren, useEffect, useReducer, useRef } from 'react';
import NotVisibleImage from '@components/video-capture/NotVisibleImage';
import NotVisibleVideo from '@components/video-capture/NotVisibleVideo';
import Canvas from '@components/video-capture/Canvas';
import CaptureButtons from '@components/video-capture/CaptureButtons';
import CaptureViewer from '@components/video-capture/CaptureViewer';
import CaptureHelp from '@components/video-capture/CaptureHelp';

const FPS_60 = 1000 / 60;

interface VideoState {
    stream: MediaProvider | null;
    canvasStream: MediaProvider | null;
    isCapturing: boolean;
    x: number;
    y: number;
    ratio: number;
    showJump: boolean;
}


const videoStateReducer = (state: VideoState, payload: Partial<VideoState>): VideoState => {
    return { ...state, ...payload };
};


interface VideoCaptureProps {
}

const VideoCapture = (props: PropsWithChildren<VideoCaptureProps>) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const computedRef = useRef<HTMLVideoElement | null>(null);
    const platform48 = useRef<HTMLImageElement | null>(null);
    const jump48 = useRef<HTMLImageElement | null>(null);

    const [{ canvasStream, stream, isCapturing, x, y, ratio, showJump }, dispatch] = useReducer(videoStateReducer, {
        stream: null,
        canvasStream: null,
        isCapturing: false,
        x: 2,
        y: 25,
        ratio: 100,
        showJump: true,
    });

    const handleStop = () => {
        // @ts-ignore
        stream?.getTracks().forEach((track) => track.stop());
        // @ts-ignore
        canvasStream?.getTracks().forEach((track) => track.stop());

        dispatch({
            stream: null,
            canvasStream: null,
            isCapturing: false,
        });
    };

    const handleRecording = async () => {
        const mediaDevices = navigator.mediaDevices;
        const stream: MediaProvider = await mediaDevices.getDisplayMedia({
            video: {
                frameRate: 30,
                aspectRatio: 1,
            },
            audio: false,
        });
        // on inactive is not defined in ts
        // @ts-ignore
        stream.oninactive = handleStop;
        dispatch({
            stream,
            isCapturing: true,
        });
    };


    const handleClickCapturePause = () => {
        if (isCapturing) {
            handleStop();
        } else {
            handleRecording();
        }
    };

    const handleClickPip = () => {
        if (computedRef.current) {
            // @ts-ignore
            computedRef.current.requestPictureInPicture();
            // @ts-ignore
            computedRef.current.onleavepictureinpicture = () => computedRef.current.pause();
            computedRef.current.play();
        }
    };

    const handleToggleJump = () => dispatch({ showJump: !showJump });

    const handleReset = () => {
        dispatch({
            x: 2,
            y: 25,
            ratio: 100,
        });
    };


    useEffect(() => {
        if (canvasRef.current) {
            if (isCapturing) {
                const interval = setInterval(() => {
                    const ctx = canvasRef.current!.getContext('2d')!;
                    ctx.drawImage(videoRef.current!, x, y, (260 * ratio) / 100, (156 * ratio) / 100, 0, 0, 260, 156);
                    ctx.drawImage(platform48!.current!, 0, 0);

                    if (showJump) ctx.drawImage(jump48!.current!, 0, 0);
                }, FPS_60);
                return () => clearInterval(interval);
            } else {
                const ctx = canvasRef.current!.getContext('2d')!;
                ctx.clearRect(0, 0, 260, 156);
            }
        }
    });

    useEffect(() => {
        dispatch({ canvasStream: canvasRef.current!.captureStream(60) });
    }, [stream]);

    useEffect(() => {
        if (computedRef.current) {
            computedRef.current.srcObject = canvasStream;
        }
    }, [canvasStream]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            if (stream) {
                // @ts-ignore
                const settings = stream.getVideoTracks()[0].getSettings();
                const { width, height } = settings;
                videoRef.current.width = width;
                videoRef.current.height = height;
            }
        }
    }, [stream]);


    return (
        <>
            <CaptureHelp />
            <CaptureButtons isCapturing={isCapturing}
                            showJump={showJump}
                            onClickCapture={handleClickCapturePause}
                            onClickPiP={handleClickPip}
                            onToggleShowJump={handleToggleJump} />

            <NotVisibleImage src={'/images/48_platforms.png'} ref={platform48} />
            <NotVisibleImage src={'/images/48_jump.png'} ref={jump48} />
            <NotVisibleVideo ref={videoRef} autoPlay />
            <NotVisibleVideo ref={computedRef} />
            <Canvas
                isVisible={isCapturing}
                ref={canvasRef}
                width={260}
                height={156}
            />
            {
                isCapturing && (
                    <CaptureViewer
                        x={x}
                        y={y}
                        ratio={ratio}
                        onChangeX={x => dispatch({ x })}
                        onChangeY={y => dispatch({ y })}
                        onChangeRatio={ratio => dispatch({ ratio })}
                        onReset={handleReset} />
                )
            }


        </>
    );
};

export default VideoCapture;