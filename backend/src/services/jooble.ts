import axios from "axios";

const api = axios.create({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
  },
});

const discoverCompaniesFromJooble = async () => {
  try {
    const response = await api.post(
      `https://jooble.org/api/${process.env.JOOBLE_API_KEY}`,
      {
        keywords:
          '"Junior Software Engineer" OR "Entry Level Software Engineer"',
        location: "USA",
        page: "1",
      },
    );

    const jobs = response.data.jobs || [];

    return jobs.map((job: any) => ({
      source: "jooble",
      company_name: job.company,
      title: job.title,
      redirect_url: job.link,
      publication_date: job.updated,
    }));
  } catch (error: any) {
    console.log(error.config.url);
    console.error("[Jooble API Error]:", error);
    return [];
  }
};

export default discoverCompaniesFromJooble;
