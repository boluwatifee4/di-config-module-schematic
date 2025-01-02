export interface Schema {
    action: 'create' | 'update';
    moduleName: string;
    configInterfaceName: string;
    tokenName: string;
}
