import { AtsType } from "./models.js";

export interface IParsedAts {
  atsType: AtsType;
  atsSlug: string;
  jobId?: string;
}
