var appInTest = require("../app");
var moment = require('moment');

console.log(appInTest.util);
describe("calculate Age", function () {
  it("should return 30 for birthdate of '1983/9/9'", function () {
    var age = appInTest.util('1983/9/9');
    expect(age).toBe(30);
  });

});