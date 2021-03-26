import { createAction, props } from '@ngrx/store';

export const SetVideoURl = createAction(
  '[VideoPlayer] Set Video URl',
  props<{ url: string | null}>()
);

export const SetVideoDuration = createAction(
  '[VideoPlayer] Set Video URl',
  props<{ duration: number }>()
);

export const ChangeCurrentTimeFromControls = createAction(
  '[VideoPlayer] Change Current Time From Controls',
  props<{ currentTime: number }>()
);

export const ChangeReadyToPlayStatus = createAction(
  '[VideoPlayer] Change Ready To Play Status',
  props<{ isReadyToPlay: boolean}>()
);

export const PlayVideo = createAction(
  '[VideoPlayer] Play',
  props<{ isPlay: boolean}>()
);

export const FindFrame = createAction(
  '[VideoPlayer] Find Frame',
  props<{ frameNumber: number }>()
);

export const FindCurrentTime = createAction(
  '[VideoPlayer] Find Current Time',
  props<{ currentTime: number }>()
);

export const ChangePlayerSpeed = createAction(
  '[VideoPlayer] Change Player Speed',
  props<{ playbackRate: number }>()
);

export const ChangeFPS = createAction(
  '[VideoPlayer] Change FPS',
  props<{ fps: number }>()
);

export const Error = createAction(
  '[VideoPlayer] Error',
  props<{ error: Error | any }>()
);

export const DeleteStateData = createAction(
    '[VideoViewer] Delete State Data',
  );
