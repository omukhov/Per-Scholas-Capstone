import axios from "axios";

const adzuna = axios.create({
  baseURL: "https://api.adzuna.com/v1/api/jobs/us",
  timeout: 10000,
});

const discoverCompaniesFromAdzuna = async (page = 1) => {
  try {
    const response = await adzuna.get(`/search/${page}`, {
      params: {
        app_id: process.env.ADZUNA_APP_ID,
        app_key: process.env.ADZUNA_APP_KEY,
        what_or:
          "junior OR junior-level OR entry-level OR graduate OR associate OR new grad OR software engineer OR frontend developer OR web developer",

        what_exclude:
          "senior OR sr OR lead OR staff OR principal OR manager OR director OR architect OR head OR vp OR vice president",
        results_per_page: 50,
        sort_by: "date",
        max_days_old: 7,
      },
    });

    return response.data.results;
  } catch (error) {
    console.log(error);
  }
};

export default discoverCompaniesFromAdzuna;
