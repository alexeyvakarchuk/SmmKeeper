import React from "react";

const styles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  width: "100%",
  height: "100%"
};

const Center = storyFn => <div style={styles}>{storyFn()}</div>;

export default Center;
