import { Rule, SchematicContext, Tree, apply, mergeWith, move, template, url } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { Schema } from '../models/Ischema';
import * as path from 'path';
import * as fs from 'fs';

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
    // Get normalized path from workspace root
    const normalizedPath = getNormalizedPathFromWorkspaceRoot(tree, context);

    context.logger.info(
      `Generating files in normalized path: ${normalizedPath}`
    );

    // Load template files
    const sourceTemplates = url('./files');

    // Apply templates and move files to the resolved relative path
    const parameterizedTemplates = apply(sourceTemplates, [
      template({
        ...options,
        name: options.moduleName,
        ...strings,
      }),
      move(normalizedPath),
    ]);

    return mergeWith(parameterizedTemplates)(tree, context);
  };
}

function updateModule(options: Schema, context: SchematicContext): Rule {
  return (tree: Tree) => {
    const normalizedPath = getNormalizedPathFromWorkspaceRoot(tree, context);
    const moduleFileName = `${strings.dasherize(options.moduleName)}.module.ts`;
    const modulePath = `${normalizedPath}/${moduleFileName}`;

    context.logger.info(`Looking for module at: ${modulePath}`);

    if (!tree.exists(modulePath)) {
      throw new Error(`Module not found in the normalized path: ${modulePath}`);
    }

    const moduleContent = tree.read(modulePath)?.toString('utf-8');
    if (!moduleContent) {
      throw new Error(`Failed to read module: ${modulePath}`);
    }

    context.logger.info(`Updating module at: ${modulePath}`);

    // Add forRoot logic if not present
    if (!moduleContent.includes('static forRoot')) {
      const updatedContent = addForRootMethod(moduleContent, options, context);
      tree.overwrite(modulePath, updatedContent);
      context.logger.info(`Added forRoot to ${modulePath}`);
    } else {
      context.logger.info(`forRoot already exists in ${modulePath}. Skipping modification.`);
    }

    // Generate missing files in the normalized path
    generateMissingFiles(tree, normalizedPath, options);

    return tree;
  };
}


/**
 * Adds the forRoot method to the module content if it doesn't already exist.
 */
function addForRootMethod(
  moduleContent: string,
  options: Schema,
  context: SchematicContext
): string {
  // Match the class declaration for the module
  const classDeclarationRegex = new RegExp(
    `export class ${strings.classify(options.moduleName)}Module\\s*\\{`,
    'm'
  );
  const match = moduleContent.match(classDeclarationRegex);

  if (!match) {
    context.logger.error(
      `Module class "export class ${strings.classify(
        options.moduleName
      )}Module" not found in module content.`
    );
    throw new Error(
      `Module class "export class ${strings.classify(
        options.moduleName
      )}Module" not found. Could not add forRoot method.`
    );
  }

  const forRootMethod = `
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
  `;

  // Insert the forRoot method inside the class
  const updatedContent = moduleContent.replace(
    classDeclarationRegex,
    (match) => `${match}\n${forRootMethod}`
  );

  context.logger.info(`forRoot method added to module class.`);
  return updatedContent;
}



/**
 * Locates the workspace root and calculates the normalized path.
 */
function getNormalizedPathFromWorkspaceRoot(_tree: Tree, context: SchematicContext): string {
  // Start at the current directory
  const currentDir = process.cwd();
  context.logger.info(`Current directory: ${currentDir}`);

  // Locate the workspace root
  let workspaceRoot: string | null = null;
  let currentPath = currentDir;

  while (currentPath !== path.parse(currentPath).root) {
    if (fs.existsSync(path.join(currentPath, 'nx.json')) || fs.existsSync(path.join(currentPath, 'angular.json'))) {
      workspaceRoot = currentPath;
      break;
    }
    currentPath = path.dirname(currentPath);
  }

  if (!workspaceRoot) {
    throw new Error('Could not locate workspace root (nx.json or angular.json).');
  }

  context.logger.info(`Workspace root: ${workspaceRoot}`);

  // Calculate the normalized path
  const relativePath = path
    .relative(workspaceRoot, currentDir)
    .replace(/\\/g, '/'); // Ensure forward slashes for consistency

  if (!relativePath || relativePath.startsWith('..')) {
    throw new Error(
      `The current directory (${currentDir}) is not within the workspace root (${workspaceRoot}).`
    );
  }

  return relativePath;
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

