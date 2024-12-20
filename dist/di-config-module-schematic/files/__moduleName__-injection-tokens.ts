import { InjectionToken } from '@angular/core';
import { <%= classify(moduleName) %>Config } from './<%= dasherize(moduleName) %>-config.interface';

export const <%= tokenName %> = new InjectionToken<<%= classify(moduleName) %>Config>('<%= tokenName %>');
