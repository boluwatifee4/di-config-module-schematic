import * as path from 'path';
import * as fs from 'fs';
import { SchematicContext, Tree } from '@angular-devkit/schematics';

export function getNormalizedPathFromWorkspaceRoot(_tree: Tree, context: SchematicContext): string {
    const currentDir = process.cwd();
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

    const relativePath = path.relative(workspaceRoot, currentDir).replace(/\\/g, '/');
    if (!relativePath || relativePath.startsWith('..')) {
        throw new Error(`The current directory (${currentDir}) is not within the workspace root (${workspaceRoot}).`);
    }

    return relativePath;
}
