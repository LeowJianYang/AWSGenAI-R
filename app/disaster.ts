export type DisasterData = {
  id: string;
  title: string;
  pubDate: string;
  eventid: string;
  location: string;
  eventtype: string;
  alertlevel: string;
  severity?: string;
  level?: {
    unit: string;
    value: number;
  };
  lat?: number;
  lon?: number;
};
