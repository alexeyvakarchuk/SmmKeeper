// const mongoose = require("mongoose");

const InstAcc = require("../models/InstAcc");
const InstTask = require("../models/InstTask");

const { asyncForEach } = require("../api/utils");

// mongoose.Promise = Promise;

// mongoose.connect("mongodb://localhost/smmkeeper");

(async () => {
  const tasks = await InstTask.find({});

  await asyncForEach(tasks, async ({ username }) => {
    const { profileId } = await InstAcc.findOne({ username }, "profileId");

    console.log(profileId);

    try {
      await InstTask.updateMany(
        { username },
        {
          $set: {
            profileId
          }
        }
      );

      // await acc.save();
    } catch (e) {
      console.log("Mongoose query error :: ", e);
    }
  });
})();
