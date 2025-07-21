const MALE_URL = "https://w1.pngwing.com/pngs/743/500/png-transparent-circle-silhouette-logo-user-user-profile-green-facial-expression-nose-cartoon-thumbnail.png";
const FEMALE_URL = "https://w7.pngwing.com/pngs/129/292/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon-thumbnail.png";
const BASE_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://tech-mate-frontend.vercel.app/";
module.exports = { MALE_URL, FEMALE_URL, BASE_URL}