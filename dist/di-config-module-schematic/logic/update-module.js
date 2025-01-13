"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateModule = updateModule;
const core_1 = require("@angular-devkit/core");
const path_utils_1 = require("../utils/path-utils");
const file_utils_1 = require("../utils/file-utils");
const file_utils_2 = require("../utils/file-utils");
function updateModule(options, context) {
    return (tree) => {
        var _a;
        const normalizedPath = (0, path_utils_1.getNormalizedPathFromWorkspaceRoot)(tree, context);
        const moduleFileName = `${core_1.strings.dasherize(options.moduleName)}.module.ts`;
        const modulePath = `${normalizedPath}/${moduleFileName}`;
        context.logger.info(`Looking for module at: ${modulePath}`);
        if (!tree.exists(modulePath)) {
            throw new Error(`Module not found in the normalized path: ${modulePath}`);
        }
        let moduleContent = (_a = tree.read(modulePath)) === null || _a === void 0 ? void 0 : _a.toString('utf-8');
        if (!moduleContent) {
            throw new Error(`Failed to read module: ${modulePath}`);
        }
        context.logger.info(`Updating module at: ${modulePath}`);
        if (!moduleContent.includes('static forRoot')) {
            moduleContent = (0, file_utils_1.addForRootMethod)(moduleContent, options, context);
            tree.overwrite(modulePath, moduleContent);
        }
        else {
            context.logger.info(`forRoot already exists in ${modulePath}. Skipping modification.`);
        }
        (0, file_utils_2.generateMissingFiles)(tree, normalizedPath, options);
        return tree;
    };
}
//# sourceMappingURL=update-module.js.map