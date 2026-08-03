import axios from "axios";

const adzuna = axios.create({
  baseURL: "https://api.adzuna.com/v1/api/jobs/us",
  timeout: 10000,
});

const getCompaniesWithJuniorJobs = async (page = 1) => {
  try {
    const response = await adzuna.get(`/search/${page}`, {
      params: {
        app_id: process.env.ADZUNA_APP_ID,
        app_key: process.env.ADZUNA_APP_KEY,
        what_or: "junior entry-level graduate associate",
        title_only: "junior entry-level graduate",
        results_per_page: 50,
        sort_by: "date",
        max_days_old: 30,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
