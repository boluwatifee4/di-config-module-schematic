import { Tree, SchematicContext } from '@angular-devkit/schematics';
import { Schema } from '../../models/Ischema';
export declare function generateMissingFiles(tree: Tree, dir: string, options: Schema): void;
export declare function addForRootMethod(moduleContent: string, options: Schema, _context: SchematicContext): string;
