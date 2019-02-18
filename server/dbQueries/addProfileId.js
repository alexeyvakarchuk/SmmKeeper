const mongoose = require("mongoose");

const InstAcc = require("../models/InstAcc");

const { asyncForEach } = require("../api/utils");

mongoose.Promise = Promise;

mongoose.connect("mongodb://localhost/smmkeeper");

(async () => {
  const accs = await InstAcc.find({});

  await asyncForEach(accs, async ({ profileId }) => {
    // const acc = await InstAcc.findOne({ profileId }, "interactions");

    try {
      await InstAcc.update(
        { profileId },
        {
          $set: {
            "interactions.$[].profileId": profileId
          }
        },
        { multi: true }
      );

      // await acc.save();
    } catch (e) {
      console.log("Mongoose query error :: ", e);
    }
  });
})();
