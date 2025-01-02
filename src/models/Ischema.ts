export interface Schema {
    action: 'create' | 'update'; // Action can be either 'create' or 'update'
    moduleName: string;          // Name of the module
    configInterfaceName: string; // Name of the configuration interface
    tokenName: string;           // Name of the InjectionToken
}
