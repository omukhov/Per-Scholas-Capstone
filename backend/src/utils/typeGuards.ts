import { IUnifiedJobInput } from "../types/services.js";

export const isUnifiedJob = (
  job: IUnifiedJobInput | null,
): job is IUnifiedJobInput => {
  return job !== null;
};

export const isNotNull = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};
