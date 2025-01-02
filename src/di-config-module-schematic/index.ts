import { Rule, SchematicContext, Tree, apply, mergeWith, template, url, move } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { Schema } from '../models/Ischema';
import * as path from 'path';


export default function diConfigModuleSchematic(options: Schema): Rule {
  return (_tree: Tree, context: SchematicContext) => {
    context.logger.info(`Action selected: ${options.action}`);

    if (options.action === 'create') {
      return createModule(options, context);
    } else if (options.action === 'update') {
      return updateModule(options, context);
    }

    throw new Error('Invalid action. Please choose either "create" or "update".');
  };
}

function createModule(options: Schema, context: SchematicContext): Rule {
  return (tree: Tree) => {
    // Get the terminal's current working directory
    const currentDir = process.cwd();
    const workspaceRoot = tree.root.path; // The root of the virtual file system
    const relativeDir = path.relative(workspaceRoot, currentDir); // Map the real current directory to the virtual file system

    context.logger.info(`Creating module in: ${currentDir} (mapped to: ${relativeDir})`);

    // Load the template files
    const sourceTemplates = url('./files');

    // Apply template variables and move the files directly to the target directory
    const parameterizedTemplates = apply(sourceTemplates, [
      template({
        ...options, // User inputs
        name: options.moduleName, // Map `moduleName` to `name`
        ...strings, // Utility functions for casing
      }),
      move(relativeDir), // Move files to the resolved relative directory
    ]);

    // Merge the templates with the current Tree
    return mergeWith(parameterizedTemplates)(tree, context);
  };
}



function updateModule(options: Schema, context: SchematicContext): Rule {
  return (tree: Tree) => {
    const currentDir = process.cwd(); // Get the terminal's current directory
    const moduleFileName = `${strings.dasherize(options.moduleName)}.module.ts`;

    // Resolve the module path in the current directory
    const modulePath = `${currentDir}/${moduleFileName}`;

    if (!tree.exists(modulePath)) {
      throw new Error(`Module not found in the current directory: ${modulePath}`);
    }

    const moduleContent = tree.read(modulePath)?.toString('utf-8');
    if (!moduleContent) {
      throw new Error(`Failed to read module: ${modulePath}`);
    }

    context.logger.info(`Updating module at: ${modulePath}`);

    // Add forRoot logic if not present
    if (!moduleContent.includes('static forRoot')) {
      const updatedContent = moduleContent.replace(
        /@NgModule\(\{[^}]*\}\)/,
        (match) => `
          ${match}

          static forRoot(config: ${strings.classify(options.configInterfaceName)}): ModuleWithProviders<${strings.classify(
          options.moduleName
        )}Module> {
            return {
              ngModule: ${strings.classify(options.moduleName)}Module,
              providers: [
                { provide: ${options.tokenName}, useValue: config },
              ],
            };
          }
        `
      );
      tree.overwrite(modulePath, updatedContent);
      context.logger.info(`Added forRoot to ${modulePath}`);
    }

    // Generate missing files in the current directory
    generateMissingFiles(tree, currentDir, options);

    return tree; // Return the modified Tree
  };
}


function generateMissingFiles(tree: Tree, dir: string, options: Schema): void {
  const configPath = `${dir}/${strings.dasherize(options.moduleName)}-config.interface.ts`;
  const tokenPath = `${dir}/${strings.dasherize(options.moduleName)}-injection-tokens.ts`;

  if (!tree.exists(configPath)) {
    tree.create(configPath, `
      export interface ${strings.classify(options.configInterfaceName)} {
          // Define your configuration properties here
      }
    `);
  }

  if (!tree.exists(tokenPath)) {
    tree.create(tokenPath, `
      import { InjectionToken } from '@angular/core';
      import { ${strings.classify(options.configInterfaceName)} } from './${strings.dasherize(options.moduleName)}-config.interface';

      export const ${options.tokenName} = new InjectionToken<${strings.classify(
      options.configInterfaceName
    )}>('${options.tokenName}');
    `);
  }
}

