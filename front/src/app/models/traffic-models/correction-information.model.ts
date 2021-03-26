import { FrameDataRoad } from './frame.model';
import { FrameInformation } from './frame-information.model';

export class CorrectionInformation {
  public checkpoints: number[] = [];
  public frameDataRoad: any[] = [];
  public checkedRaws: any[] = [];
}
