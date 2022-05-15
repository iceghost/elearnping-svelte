export interface Sites {
    [category: string]: Site[];
}

export interface Site {
    id: number;
    fullname: string;
}

export interface Update {
    site: Site;
    from: string;
    to: string;
    updates: [
        {
            module: Module;
            areas: Area[];
        }
    ];
}

export interface Module {
    id: number;
    name: string;
    modname: string;
}

export interface Area {
    name: string;
}
