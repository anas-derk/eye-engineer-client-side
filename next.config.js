/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  env: {
    BASE_API_URL: process.env.NODE_ENV === "development" ? "http://localhost:3030" : "https://api.asfourintlco.com",
    WEBSITE_URL: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://eyeengineer.com",
    USER_TOKEN_NAME_IN_LOCAL_STORAGE: "e-e-u-t",
    WEBSITE_NAME: "Eye Engineer",
    USER_LANGUAGE_FIELD_NAME_IN_LOCAL_STORAGE: "eye-engineer-store-language",
    USER_THEME_MODE_FIELD_NAME_IN_LOCAL_STORAGE: "eye-engineer-light-mode",
    CONTACT_NUMBER: "+963984944832",
    CONTACT_EMAIL: "info@eyeengineer.com",
    FACEBOOK_LINK: "https://www.facebook.com/eyeengineer?mibextid=ZbWKwL",
    INSTAGRAM_LINK: "https://www.instagram.com/eyeengineer?igsh=MzRlODBiNWFlZA==",
    TIKTOK_LINK: "https://www.tiktok.com/@eye_engineer?_t=ZS-8u7kr3I8J3x&_r=1",
    TEAMS_LINK: "https://teams.live.com/l/community/FEAG3TGynF-xu-I6AI",
  },
  async headers() {
    return [
      {
        source: process.env.NODE_ENV === "development" ? "//localhost:3030/(.*)" : "//api.asfourintlco.com/(.*)",
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
        ]
      }
    ];
  }
}

module.exports = nextConfig;