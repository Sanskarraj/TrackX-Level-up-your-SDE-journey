import type { NextConfig } from "next";
const nextConfig: NextConfig = {

env: {
GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET
},

images:{
  domains:["lh3.googleusercontent.com"],
}

}
export default nextConfig;
