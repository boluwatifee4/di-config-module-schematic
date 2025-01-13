"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMissingFiles = generateMissingFiles;
exports.addForRootMethod = addForRootMethod;
const core_1 = require("@angular-devkit/core");
function generateMissingFiles(tree, dir, options) {
    const configPath = `${dir}/${core_1.strings.dasherize(options.moduleName)}-config.interface.ts`;
    const tokenPath = `${dir}/${core_1.strings.dasherize(options.moduleName)}-injection-tokens.ts`;
    if (!tree.exists(configPath)) {
        tree.create(configPath, `
      export interface ${core_1.strings.classify(options.configInterfaceName)} {
          // Define your configuration properties here
      }
    `);
    }
    if (!tree.exists(tokenPath)) {
        tree.create(tokenPath, `
      import { InjectionToken } from '@angular/core';
      import { ${core_1.strings.classify(options.configInterfaceName)} } from './${core_1.strings.dasherize(options.moduleName)}-config.interface';

      export const ${options.tokenName} = new InjectionToken<${core_1.strings.classify(options.configInterfaceName)}>('${options.tokenName}');
    `);
    }
}
function addForRootMethod(moduleContent, options, _context) {
    const classDeclarationRegex = new RegExp(`export class ${core_1.strings.classify(options.moduleName)}Module\\s*\\{`, 'm');
    const match = moduleContent.match(classDeclarationRegex);
    if (!match) {
        throw new Error(`Module class "${core_1.strings.classify(options.moduleName)}Module" not found.`);
    }
    const forRootMethod = `
  static forRoot(config: ${core_1.strings.classify(options.configInterfaceName)}): ModuleWithProviders<${core_1.strings.classify(options.moduleName)}Module> {
    return {
      ngModule: ${core_1.strings.classify(options.moduleName)}Module,
      providers: [
        { provide: ${options.tokenName}, useValue: config },
      ],
    };
  }
  `;
    return moduleContent.replace(classDeclarationRegex, `${match[0]}\n${forRootMethod}`);
}
//# sourceMappingURL=file-utils.js.map