const User = require("server/models/User");

const makeProviderId = profile => `${profile.provider}:${profile.id}`;

const mergeProfile = async (user, profile) => {
  if (!user.displayName && profile.displayName) {
    user.displayName = profile.displayName;
  }

  user.providers.push({
    name: profile.provider,
    nameId: makeProviderId(profile),
    profile
  });

  await user.save();
};

module.exports = async (profile, done) => {
  const email = profile.emails[0].value;

  const providerNameId = makeProviderId(profile);

  let connectedUser = await User.findOne({
    "providers.nameId": providerNameId,
    email
  });

  // If user haven't connected selected social we'll check whether he already registered for that email or not
  if (!connectedUser) {
    const registeredUser = await User.findOne({ email });

    if (registeredUser) {
      // If user already registered, but only with login/email
      await mergeProfile(registeredUser, profile);

      done(null, registeredUser);
    } else {
      // If user haven't ever registered
      const userReq = {
        email,
        displayName: profile.displayName,
        providers: [
          {
            name: profile.provider,
            nameId: providerNameId,
            profile
          }
        ]
      };

      const user = await User.create(userReq);
      done(null, user);
    }
  } else {
    // connecting google to providers
    for (let i = 0; i < connectedUser.providers.length; i++) {
      const provider = connectedUser.providers[i];
      if (provider.nameId === providerNameId) {
        provider.remove();
        // i--;
      }
    }

    await mergeProfile(connectedUser, profile);

    connectedUser = await User.findOne({
      "providers.nameId": providerNameId,
      email
    });

    done(null, connectedUser);
  }
};
