"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = diConfigModuleSchematic;
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
function diConfigModuleSchematic(options) {
    return (tree, _context) => {
        _context.logger.info(`Generating DI Config Module: ${options.moduleName}`);
        const sourceTemplates = (0, schematics_1.url)('./files');
        const parameterizedTemplates = (0, schematics_1.apply)(sourceTemplates, [
            (0, schematics_1.template)(Object.assign(Object.assign(Object.assign({}, options), { name: options.moduleName }), core_1.strings)),
            (0, schematics_1.move)(`src/app/${core_1.strings.dasherize(options.moduleName)}`), // Destination folder
        ]);
        return (0, schematics_1.mergeWith)(parameterizedTemplates)(tree, _context);
    };
}
//# sourceMappingURL=index.js.map