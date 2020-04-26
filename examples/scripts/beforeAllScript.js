module.exports = async (testProperties) => {
    let configs = testProperties.configs;
    let JsonBuilder = require("../../index").JsonBuilder;
    configs.body = new JsonBuilder()
        .set("$.title", "Using Default Body Title from Configs updated in BeforeAll script")
        .set("$.body", "Using Default Body Title from Configs updated in BeforeAll script")
        .get("$");
};
