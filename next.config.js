/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  env: {
    BASE_API_URL: process.env.NODE_ENV === "development" ? "http://localhost:5500" : "https://api.asfourintlco.com",
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
        source: process.env.NODE_ENV === "development" ? "//localhost:5500/(.*)" : "//api.asfourintlco.com/(.*)",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://asfourintlco.com",
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
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "credentialless",
          },
          {
            key: "Referrer-Policy",
            value: "no-referrer-when-downgrade",
          },
        ]
      }
    ];
  }
}

module.exports = nextConfig;