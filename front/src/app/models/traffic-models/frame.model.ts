import { FrameInformation } from './frame-information.model';

export interface FrameDataRoad {
  frame_number: string;
  frame_file: string;
  video_time: string;
  frame_data: FrameInformation;
  comment?: string;
}
