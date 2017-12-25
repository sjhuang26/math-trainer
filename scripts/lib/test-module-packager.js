define(["aime-classes", "aime-loader", "amc-10-classes", "amc-10-loader", "amc-12-classes", "amc-12-loader"], (a, b, c, d, e, f) => ({
  classes: {
    aime: a,
    amc10: c,
    amc12: e
  },
  loader: {
    aime: b,
    amc10: d,
    amc12: f
  },
  TEST_DATA: [
    {
      name: "AIME",
      systemName: "aime",
    },
    {
      name: "AMC 10",
      systemName: "amc10"
    },
    {
      name: "AMC 12",
      systemName: "amc12"
    }
  ]
}));