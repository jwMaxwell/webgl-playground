const fs = require("fs");

const initJson = () => {
  console.log(process.cwd());
  const file = "./channels/";
  const channels = [...fs.readdirSync(file)].sort();
  const res = {};
  channels.map((f, i) => {
    res[`iChannel${i}`] = `.${file}${f}`;
  });

  fs.writeFileSync("./src/channels.json", JSON.stringify(res), "utf8");
};

module.exports = { initJson };
