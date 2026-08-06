import fetchKalilAtsCompanies from "./seeds/kalil.js";
import { saveAtsCompanies } from "./saveAtsCompanies.js";

export const runKalilImport = async (): Promise<void> => {
  console.log("[Kalil Import] Starting...");

  try {
    const companies = await fetchKalilAtsCompanies();

    if (companies.length === 0) {
      console.log("[Kalil Import] No companies received.");
      return;
    }

    const result = await saveAtsCompanies(companies);

    console.log(
      `[Kalil Import] Received: ${companies.length}, ` +
        `added: ${result.added}, updated: ${result.updated}`,
    );
  } catch (error: unknown) {
    console.error(
      "[Kalil Import] Failed:",
      error instanceof Error ? error.message : error,
    );
  }
};

export default runKalilImport;
