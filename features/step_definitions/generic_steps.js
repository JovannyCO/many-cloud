const {
  BeforeAll,
  AfterAll,
  Given,
  When,
  Then,
  setDefaultTimeout
} = require("cucumber");

const assert = require("assert");

Given("I create a {string} integration", function(name) {
  this.integration = require("../../").integration(name);
});

When("I call the function {string} on the integration", async function(func) {
  this.function_result = await this.connection[func].apply(this);
});

When(
  "I call the function {string} on the integration with parameters: {string}",
  async function(func, params_) {
    let params = params_.split(",");
    for (let i = 0; i < params.length; i++) {
      if (params[i] === "null") {
        params[i] = null;
      } else if (params[i] === "undefined") {
        params[i] = undefined;
      } else if (!isNaN(params[i])) {
        params[i] = parseInt(params[i]);
      }
    }

    this.function_result = await this.connection[func].apply(this, params);
  }
);

When(
  "I call the function {string} on the integration with parameters saved as world key: {string}",
  async function(func, world_key) {
    this.function_result = await this.connection[func].apply(
      this,
      this[world_key].split(",")
    );
  }
);

Then("the length of {string} must be {int}", function(string, int) {
  assert.equal(this.function_result[string].length, int);
});

Then("delete the file identified by the world key: {string}", async function(
  world_key
) {
  await this.connection["delete_file"](this[world_key]);
});

Then("the result field: {string} should be: {string}", function(
  source,
  expected
) {
  assert.equal(this.function_result[source], expected);
});

Then("the result is undefined", function() {
  assert.equal(this.function_result, undefined);
});

Then("print the result", function() {
  console.log(this.function_result);
});