"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = diConfigModuleSchematic;
const create_module_1 = require("./logic/create-module");
const update_module_1 = require("./logic/update-module");
function diConfigModuleSchematic(options) {
    return (_tree, context) => {
        context.logger.info(`Action selected: ${options.action}`);
        switch (options.action) {
            case 'create':
                return (0, create_module_1.createModule)(options, context);
            case 'update':
                return (0, update_module_1.updateModule)(options, context);
            default:
                throw new Error('Invalid action. Please choose either "create" or "update".');
        }
    };
}
//# sourceMappingURL=index.js.map