export interface PhotoViewerState {
    loadedPhoto: string | null;
    photoData?: Array<any>;
    currentFrame: number;
    error?: Error | any;
    isLoading: boolean;
}

export const initialState: PhotoViewerState = {
    loadedPhoto: null ,
    photoData: [],
    currentFrame: 0,
    error: null,
    isLoading: true,
};
