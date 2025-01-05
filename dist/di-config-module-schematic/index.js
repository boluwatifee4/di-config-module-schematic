"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = diConfigModuleSchematic;
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
const path = require("path");
function diConfigModuleSchematic(options) {
    return (_tree, context) => {
        context.logger.info(`Action selected: ${options.action}`);
        if (options.action === 'create') {
            return createModule(options, context);
        }
        else if (options.action === 'update') {
            return updateModule(options, context);
        }
        throw new Error('Invalid action. Please choose either "create" or "update".');
    };
}
function createModule(options, context) {
    return (tree) => {
        // Locate the workspace root
        // if (tree.exists('nx.json') && tree.exists('angular.json')) {
        //   // find the dir path of either nx.json or angular.json without the help of find
        //   const dir = path.dirname(tree.getDir('nx.json').path);
        //   context.logger.info(`workspace root: ${dir}`);
        // }
        let workspaceRoots = null;
        // Traverse the virtual file system to locate nx.json or angular.json
        tree.visit((filePath) => {
            const normalizedPath = filePath.replace(/\\/g, '/'); // Normalize path separators
            if (normalizedPath.endsWith('nx.json') || normalizedPath.endsWith('angular.json')) {
                workspaceRoots = path.dirname(normalizedPath); // Get the directory containing the file
                return false; // Stop traversal once the file is found
            }
        });
        if (!workspaceRoots) {
            throw new Error('Could not find nx.json or angular.json in the virtual file system.');
        }
        context.logger.info(`workspace root: ${workspaceRoots}`);
        const workspaceRoot = findWorkspaceRoot(tree);
        context.logger.info(`workspace root: ${workspaceRoot}`);
        if (!workspaceRoot) {
            throw new Error('Could not locate workspace root (nx.json or angular.json).');
        }
        // Get the current directory where the schematic is run
        const currentDir = process.cwd();
        // Calculate the relative path from the workspace root to the current directory
        const relativePath = getRelativePath(workspaceRoot, currentDir);
        context.logger.info(`relative path: ${relativePath}`);
        if (!relativePath || relativePath.startsWith('..')) {
            throw new Error(`The current directory (${currentDir}) is not within the workspace root (${workspaceRoot}).`);
        }
        context.logger.info(`Generating files in: ${currentDir} (relative to workspace root: ${relativePath})`);
        // Load template files
        const sourceTemplates = (0, schematics_1.url)('./files');
        // Apply templates and move files to the resolved relative path
        const parameterizedTemplates = (0, schematics_1.apply)(sourceTemplates, [
            (0, schematics_1.template)(Object.assign(Object.assign(Object.assign({}, options), { name: options.moduleName }), core_1.strings)),
            (0, schematics_1.move)(relativePath),
        ]);
        return (0, schematics_1.mergeWith)(parameterizedTemplates)(tree, context);
    };
}
function getRelativePath(workspaceRoot, currentDir) {
    if (!currentDir.startsWith(workspaceRoot)) {
        return null; // Current directory is outside the workspace root
    }
    return currentDir.slice(workspaceRoot.length).replace(/^\/+/, ''); // Trim leading slashes
}
/**
 * Finds the root of the workspace by locating nx.json or angular.json.
 */
function findWorkspaceRoot(tree) {
    const potentialFiles = ['nx.json', 'angular.json'];
    let workspaceRoot = null;
    tree.visit((filePath) => {
        // Normalize paths for consistent comparison
        const normalizedPath = filePath.replace(/\\/g, '/');
        for (const file of potentialFiles) {
            if (normalizedPath.endsWith(`/${file}`)) {
                workspaceRoot = normalizedPath.replace(`/${file}`, ''); // Remove the filename
            }
        }
    });
    return workspaceRoot;
}
function updateModule(options, context) {
    return (tree) => {
        var _a;
        const currentDir = process.cwd(); // Get the terminal's current directory
        const moduleFileName = `${core_1.strings.dasherize(options.moduleName)}.module.ts`;
        // Resolve the module path in the current directory
        const modulePath = `${currentDir}/${moduleFileName}`;
        if (!tree.exists(modulePath)) {
            throw new Error(`Module not found in the current directory: ${modulePath}`);
        }
        const moduleContent = (_a = tree.read(modulePath)) === null || _a === void 0 ? void 0 : _a.toString('utf-8');
        if (!moduleContent) {
            throw new Error(`Failed to read module: ${modulePath}`);
        }
        context.logger.info(`Updating module at: ${modulePath}`);
        // Add forRoot logic if not present
        if (!moduleContent.includes('static forRoot')) {
            const updatedContent = moduleContent.replace(/@NgModule\(\{[^}]*\}\)/, (match) => `
          ${match}

          static forRoot(config: ${core_1.strings.classify(options.configInterfaceName)}): ModuleWithProviders<${core_1.strings.classify(options.moduleName)}Module> {
            return {
              ngModule: ${core_1.strings.classify(options.moduleName)}Module,
              providers: [
                { provide: ${options.tokenName}, useValue: config },
              ],
            };
          }
        `);
            tree.overwrite(modulePath, updatedContent);
            context.logger.info(`Added forRoot to ${modulePath}`);
        }
        // Generate missing files in the current directory
        generateMissingFiles(tree, currentDir, options);
        return tree; // Return the modified Tree
    };
}
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
//# sourceMappingURL=index.js.map