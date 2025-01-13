import {
    Rule,
    SchematicContext,
    Tree,
    apply,
    mergeWith,
    template,
    url,
    move,
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { Schema } from '../../models/Ischema';
import { getNormalizedPathFromWorkspaceRoot } from '../utils/path-utils';

export function createModule(options: Schema, context: SchematicContext): Rule {
    return (tree: Tree) => {
        const normalizedPath = getNormalizedPathFromWorkspaceRoot(tree, context);

        context.logger.info(`Generating files in normalized path: ${normalizedPath}`);

        const sourceTemplates = url('./files');

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
