import { CarCounterData } from './car-counter.model';
import { TechnicalColorInformation } from './technical-color.model';

export interface FrameInformation {
  analysed_frame: number;
  count: number;
  lane_intersection_flags: boolean[];
  car_counter: CarCounterData[];
  class_label_to_color: TechnicalColorInformation;
  frames_range_saved: boolean;
}
