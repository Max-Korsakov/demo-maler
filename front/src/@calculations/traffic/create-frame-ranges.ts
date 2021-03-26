import { CorrectionInformation } from '../../app/models/traffic-models/index';

export function CreateFrameRange(info: CorrectionInformation): any {
  if (info.frameDataRoad.length === 1) {
    const startFirst = 0;
    const endFirst = info.frameDataRoad[0].frame_number;
    return [startFirst, endFirst];
  }
  const start = info.frameDataRoad[info.frameDataRoad.length - 2].frame_number;
  const end = info.frameDataRoad[info.frameDataRoad.length - 1].frame_number;
  return [start, end];
}
