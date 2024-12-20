import { Rule, SchematicContext, Tree, apply, mergeWith, template, url, move } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { Schema } from '../models/Ischema';



export default function diConfigModuleSchematic(options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    _context.logger.info(`Generating DI Config Module: ${options.moduleName}`);

    const sourceTemplates = url('./files');
    const parameterizedTemplates = apply(sourceTemplates, [
      template({
        ...options, // User inputs (e.g., moduleName, configInterfaceName, tokenName)
        name: options.moduleName, // Map `moduleName` to `name`
        ...strings, // Utility functions
      }),
      move(`src/app/${strings.dasherize(options.moduleName)}`), // Destination folder
    ]);

    return mergeWith(parameterizedTemplates)(tree, _context);
  };
}
