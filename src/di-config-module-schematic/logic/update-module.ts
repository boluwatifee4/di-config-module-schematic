import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { Schema } from '../../models/Ischema';
import { strings } from '@angular-devkit/core';
import { getNormalizedPathFromWorkspaceRoot } from '../utils/path-utils';
import { addForRootMethod } from '../utils/file-utils';
import { generateMissingFiles } from '../utils/file-utils';

export function updateModule(options: Schema, context: SchematicContext): Rule {
    return (tree: Tree) => {
        const normalizedPath = getNormalizedPathFromWorkspaceRoot(tree, context);
        const moduleFileName = `${strings.dasherize(options.moduleName)}.module.ts`;
        const modulePath = `${normalizedPath}/${moduleFileName}`;

        context.logger.info(`Looking for module at: ${modulePath}`);

        if (!tree.exists(modulePath)) {
            throw new Error(`Module not found in the normalized path: ${modulePath}`);
        }

        let moduleContent = tree.read(modulePath)?.toString('utf-8');
        if (!moduleContent) {
            throw new Error(`Failed to read module: ${modulePath}`);
        }

        context.logger.info(`Updating module at: ${modulePath}`);

        if (!moduleContent.includes('static forRoot')) {
            moduleContent = addForRootMethod(moduleContent, options, context);
            tree.overwrite(modulePath, moduleContent);
        } else {
            context.logger.info(`forRoot already exists in ${modulePath}. Skipping modification.`);
        }

        generateMissingFiles(tree, normalizedPath, options);

        return tree;
    };
}
