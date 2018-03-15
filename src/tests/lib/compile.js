const vm         = require("vm");
const { rollup } = require("rollup");
const buble      = require("rollup-plugin-buble");

// Sourced from @tivac's Anthracite repository for converting es2015
// into commonjs for execution in tests.
module.exports = function(input, tgt) {
    tgt.exports = {};

    return rollup({
        input,
        plugins : [ buble() ]
    })
    .then((bundle) => bundle.generate({ format : "cjs" })
    .then((result) => {
        vm.runInThisContext(`(function(module, exports) { ${result.code} })`)(tgt, tgt.exports);
        
        return tgt;
    }));
};
