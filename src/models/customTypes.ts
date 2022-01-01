export type PlayerEstimateType = {
  id: string;
  name: string;
  estimate: number;
  time: number;
};

export type EstimateReportOfTicket = {
  actualEstimate: number;
  playersEstimate: PlayerEstimateType[];
};

export type ReportType = {
  [id: string]: EstimateReportOfTicket;
};
