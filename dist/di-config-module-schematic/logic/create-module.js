"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModule = createModule;
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
const path_utils_1 = require("../utils/path-utils");
function createModule(options, context) {
    return (tree) => {
        const normalizedPath = (0, path_utils_1.getNormalizedPathFromWorkspaceRoot)(tree, context);
        context.logger.info(`Generating files in normalized path: ${normalizedPath}`);
        const sourceTemplates = (0, schematics_1.url)('./files');
        const parameterizedTemplates = (0, schematics_1.apply)(sourceTemplates, [
            (0, schematics_1.template)({
                ...options,
                name: options.moduleName,
                ...core_1.strings,
            }),
            (0, schematics_1.move)(normalizedPath),
        ]);
        return (0, schematics_1.mergeWith)(parameterizedTemplates)(tree, context);
    };
}
//# sourceMappingURL=create-module.js.map