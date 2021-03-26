export interface VideoPlayerState {
    videoURl: string | null;
    currentTime: number;
    currentTimeFromControls: number;
    isVideoPlay: boolean;
    currentFrame: number;
    videoDuration: number;
    playbackRate: number;
    framePerSecond: number;
    isReadyToPlay: boolean;
    error?: Error | any;
}

export const initialState: VideoPlayerState = {
    videoURl: null,
    currentTime: 0,
    currentTimeFromControls: 0,
    isVideoPlay: false,
    isReadyToPlay: false,
    videoDuration: 0,
    currentFrame: 0,
    playbackRate: 1,
    framePerSecond: 25,
    error: null
};
