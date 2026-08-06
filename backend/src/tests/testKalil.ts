import fetchKalilAtsCompanies from "../services/seeds/kalil.js";

const testKalil = async (): Promise<void> => {
  console.log("[Test Kalil] Starting...");

  const companies = await fetchKalilAtsCompanies();

  const greenhouseCount = companies.filter(
    (company) => company.ats_type === "greenhouse",
  ).length;

  const leverCount = companies.filter(
    (company) => company.ats_type === "lever",
  ).length;

  const ashbyCount = companies.filter(
    (company) => company.ats_type === "ashby",
  ).length;

  console.log({
    total: companies.length,
    greenhouse: greenhouseCount,
    lever: leverCount,
    ashby: ashbyCount,
  });

  console.dir(companies.slice(0, 5), {
    depth: null,
  });
};

testKalil().catch((error: unknown) => {
  console.error(
    "[Test Kalil] Failed:",
    error instanceof Error ? error.message : error,
  );

  process.exitCode = 1;
});
