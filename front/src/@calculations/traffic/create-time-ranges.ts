import { CorrectionInformation } from '../../app/models/traffic-models/index';

export function CreateTimeRange(info: CorrectionInformation): any[] {
  if (info.frameDataRoad.length === 1) {
    const startFirst = 0;
    const endFirst = info.frameDataRoad[0].currentTime;
    return [startFirst, endFirst];
  }
  const start = info.frameDataRoad[info.frameDataRoad.length - 2].currentTime;
  const end = info.frameDataRoad[info.frameDataRoad.length - 1].currentTime;
  return [start, end];
}
