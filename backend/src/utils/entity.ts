export interface  imgInfo {
    name: string;
    metadata: {
        distance: number,
        efl: number,
        fl: number,
        dof: number,
    }
}

export interface  IMetaObject {
  unit: string;
  value: number;
}

export interface  IParseObject {
  unit: string;
  name: string;
}
