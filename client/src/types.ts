export interface IRegion {
    doc_id: string;
    name: string;
    latest_nrr: number;
    geometry: string;
}

export interface IDMZ {
    doc_id: string;
    id: string;
    name: string;
    area_name: string;
    region_id: string;
    strata: string;
    classification: string;
    domestic_connections: number;
    non_domestic_connections: number;
    total_connections: number;
    total_distribution_mains_length: number;
    shape_area: number;
    shape_length: number;
    geometry: string;
    latest_nrr: number;
}

export interface IHydraulic {
    dt: number;
    flow: number;
}

export interface INRR {
    value: number;
    timestamp: Date;
}