
export interface VideoViewerState {
    loadedVideo: string | null;
    videoData?: Array<any>;
    standardData?: any;
    correctionData?: any;
    stopCurrentTime: number;
    isVideoPlay: boolean;
    currentFrame: number;
    error?: Error | any;
    isLoading: boolean;
}

export const initialState: VideoViewerState = {
    loadedVideo: null ,
    videoData: [],
    standardData: null,
    correctionData: null,
    stopCurrentTime: 0,
    isVideoPlay: false,
    currentFrame: 0,
    error: null,
    isLoading: true,
};
