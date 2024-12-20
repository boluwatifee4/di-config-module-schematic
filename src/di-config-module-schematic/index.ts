import { Rule, SchematicContext, Tree, apply, mergeWith, template, url, move } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { Schema } from '../models/Ischema';



export default function diConfigModuleSchematic(options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    _context.logger.info(`Generating module with the following details:`);
    _context.logger.info(`Module Name: ${options.moduleName}`);
    _context.logger.info(`Config Interface Name: ${options.configInterfaceName}`);
    _context.logger.info(`Injection Token Name: ${options.tokenName}`);

    const sourceTemplates = url('./files'); // Template files
    const parameterizedTemplates = apply(sourceTemplates, [
      template({
        ...options, // Inject options into templates
        ...strings, // Utility functions like classify, dasherize, etc.
      }),
      move(`src/app/${strings.dasherize(options.moduleName)}`), // Target location
    ]);

    return mergeWith(parameterizedTemplates)(tree, _context);
  };
}