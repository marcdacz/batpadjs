describe("Core: JsonBuilder Tests", () => {
  const chai = require("chai");
  const expect = chai.expect;
  const fs = require("fs");
  const { join } = require("path");
  const JsonBuilder = require("../../core/jsonBuilder");
  let scenarios = [
    { field: "$.nullValue", addValue: null, updateValue: undefined },
    { field: "$.undefinedValue", addValue: undefined, updateValue: null },
    {
      field: "$.stringValue",
      addValue: "stringValue",
      updateValue: "newStringValue",
    },
    { field: "$.intValue", addValue: 235, updateValue: 105 },
    { field: "$.floatValue", addValue: 23.5, updateValue: 10.5 },
    { field: "$.boolValue", addValue: true, updateValue: false },
    { field: "$.arrayValue", addValue: [1, 2, 3], updateValue: [4, 5, 6] },
    {
      field: "$.objectValue",
      addValue: { obj1: "obj1", obj2: "obj2" },
      updateValue: { obj3: "obj3", obj4: [1, 2, 3] },
    },
  ];

  describe("JsonBuilder: CRUD Operations", () => {
    let jsonBody;
    let jb;

    before(() => {
      jsonBody = {
        field: "value",
      };
      jb = new JsonBuilder(jsonBody);
    });

    for (const scenario of scenarios) {
      it(`Adding field ${scenario.field}`, () => {
        jb.add(scenario.field, scenario.addValue);
        expect(jb.get(scenario.field)).to.equal(scenario.addValue);
      });

      it(`Updating field ${scenario.field}`, () => {
        jb.update(scenario.field, scenario.updateValue);
        expect(jb.get(scenario.field)).to.equal(scenario.updateValue);
      });

      it(`Deleting field ${scenario.field}`, () => {
        jb.delete(scenario.field);
        expect(jb.get(scenario.field)).to.equal(undefined);
      });
    }
  });

  describe("JsonBuilder: Other Operations", () => {
    let json = {
      multipleSameFieldNames: {
        item1: {
          fieldName: "fieldValue",
        },
        item2: {
          fieldName: "fieldValue",
        },
        item3: {
          fieldName: "fieldValue",
        },
      },
    };

    it("should be able to initialise with empty json", () => {
      let jb = new JsonBuilder();
      expect(jb.get("$")).to.deep.equal({});
    });

    it("should be able to initialise existing json", () => {
      let jb = new JsonBuilder(json);
      expect(jb.get("$")).to.deep.equal(json);
    });

    it("should be able to save json", () => {
      let jsonFileName = join(__dirname, "base.json");
      if (fs.existsSync(jsonFileName)) fs.unlinkSync(jsonFileName);
      expect(fs.existsSync(jsonFileName)).to.be.false;

      let jb = new JsonBuilder(json);
      jb.save(jsonFileName);
      expect(fs.existsSync(jsonFileName)).to.be.true;
      expect(require(jsonFileName)).to.deep.equal(json);
      fs.unlinkSync(jsonFileName);
    });

    it("should be able to set multiple json path values - null", () => {
      let jb = new JsonBuilder(json);
      jb.update("$..fieldName", "newFieldValue");
      let fieldValues = jb.getAll("$..fieldName");
      expect(fieldValues).to.have.length(3);
      fieldValues.forEach((fieldValue) => {
        expect(fieldValue).to.equal("newFieldValue");
      });
    });
  });
});
