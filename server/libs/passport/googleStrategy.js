const passport = require("koa-passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { clientID, clientSecret } = require("server/config/keys").google; // This keys are not added to repository because of security
const { baseURL } = require("config");
const authentificateByProfile = require("./authentificateByProfile");
const axios = require("axios");

passport.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: `${baseURL}/api/sign-in/google/redirect`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let permissionError;

        const email = profile.emails[0].value;

        if (!email) {
          permissionError = "You need to allow access to your email adress";
        }

        if (permissionError) {
          // revoke facebook auth, so that next time facebook will ask it again (otherwise it won't)
          let response = await axios({
            method: "POST",
            url: `https://accounts.google.com/o/oauth2/revoke?token=${accessToken}`
          });

          if (response.status !== 200) {
            throw new Error(
              "Google auth delete call returned invalid result " + response
            );
          }
        }

        // This function will check profiles from db and will merge them if nesessary
        authentificateByProfile(profile, done);
      } catch (err) {
        console.log(err);
        done(err);
      }
    }
  )
);
