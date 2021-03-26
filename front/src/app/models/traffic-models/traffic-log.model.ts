export interface TrafficLogData {
  ids: number[];
  frame: number;
  row: number;
  carType: string;
  oldValue: number;
  flagValue: number;
  comment?: string;
}
