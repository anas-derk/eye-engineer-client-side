/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  env: {
    BASE_API_URL: process.env.NODE_ENV === "development" ? "http://localhost:5500" : "https://api.eyeengineer.com",
    WEBSITE_URL: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://eyeengineer.com",
    userTokenNameInLocalStorage: "e-e-u-t",
    websiteName: "Eye Engineer",
    userlanguageFieldNameInLocalStorage: "eye-engineer-store-language",
    userThemeModeFieldNameInLocalStorage: "eye-engineer-light-mode",
    contactNumber: "+963984944832",
    contactEmail: "info@eyeengineer.com"
  },
  async headers() {
    return [
      {
        source: process.env.NODE_ENV === "development" ? "//localhost:5500/(.*)" : "//api.eyeengineer.com/(.*)",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://eyeengineer.com",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ]
      }
    ];
  }
}

module.exports = nextConfig;