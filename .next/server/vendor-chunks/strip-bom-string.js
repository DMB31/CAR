"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/strip-bom-string";
exports.ids = ["vendor-chunks/strip-bom-string"];
exports.modules = {

/***/ "(rsc)/./node_modules/strip-bom-string/index.js":
/*!************************************************!*\
  !*** ./node_modules/strip-bom-string/index.js ***!
  \************************************************/
/***/ ((module) => {

eval("/*!\n * strip-bom-string <https://github.com/jonschlinkert/strip-bom-string>\n *\n * Copyright (c) 2015, 2017, Jon Schlinkert.\n * Released under the MIT License.\n */ \nmodule.exports = function(str) {\n    if (typeof str === \"string\" && str.charAt(0) === \"\\uFEFF\") {\n        return str.slice(1);\n    }\n    return str;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvc3RyaXAtYm9tLXN0cmluZy9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Q0FLQyxHQUVEO0FBRUFBLE9BQU9DLE9BQU8sR0FBRyxTQUFTQyxHQUFHO0lBQzNCLElBQUksT0FBT0EsUUFBUSxZQUFZQSxJQUFJQyxNQUFNLENBQUMsT0FBTyxVQUFVO1FBQ3pELE9BQU9ELElBQUlFLEtBQUssQ0FBQztJQUNuQjtJQUNBLE9BQU9GO0FBQ1QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYXItaW1wb3J0LWxhbmRpbmcvLi9ub2RlX21vZHVsZXMvc3RyaXAtYm9tLXN0cmluZy9pbmRleC5qcz83YzViIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogc3RyaXAtYm9tLXN0cmluZyA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvc3RyaXAtYm9tLXN0cmluZz5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUsIDIwMTcsIEpvbiBTY2hsaW5rZXJ0LlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzdHIpIHtcbiAgaWYgKHR5cGVvZiBzdHIgPT09ICdzdHJpbmcnICYmIHN0ci5jaGFyQXQoMCkgPT09ICdcXHVmZWZmJykge1xuICAgIHJldHVybiBzdHIuc2xpY2UoMSk7XG4gIH1cbiAgcmV0dXJuIHN0cjtcbn07XG4iXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsInN0ciIsImNoYXJBdCIsInNsaWNlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/strip-bom-string/index.js\n");

/***/ })

};
;