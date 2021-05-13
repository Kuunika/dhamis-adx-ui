export interface IValue {
  "product-code": string;
  value: number;
  "concept-name"?: string;
}
export interface IFacility {
  "facility-code": string;
  values: Array<IValue>;
}
export interface IDhamisResponse {
  description: string;
  "reporting-period": string;
  facilities: Array<IFacility>;
}

export type Facility = {
  id: number;
  facilityName: string;
};

export type Quarter = {
  id: number;
  year: number;
  quarter: number;
};
