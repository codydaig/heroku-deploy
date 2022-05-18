const p = require("phin");
const core = require("@actions/core");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const createCatFile = ({ email, api_key }) => `cat >~/.netrc <<EOF
machine api.heroku.com
    login ${email}
    password ${api_key}
machine git.heroku.com
    login ${email}
    password ${api_key}
EOF`;

// Input Variables
let heroku = {
  api_key: core.getInput("heroku_api_key"),
  email: core.getInput("heroku_email"),
  app_name: core.getInput("heroku_app_name"),
};

try {
  execSync(createCatFile({ email: heroku.email, api_key: heroku.api_key }));
  execSync("heroku git:remote --app " + heroku.app_name);
  execSync(`git push heroku HEAD:master --force`);
  core.setOutput("status", "Successfully deployed staging");
} catch (err) {
  core.setFailed(err.toString());
}
