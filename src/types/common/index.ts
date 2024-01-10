type ValueType = string | number | boolean;

export type Union<
  T extends { [key: string]: ValueType } | ReadonlyArray<ValueType>,
> = T extends ReadonlyArray<ValueType>
  ? T[number]
  : T extends { [key: string]: infer U }
  ? U
  : never;

export interface IFile {
  fieldname?: string;
  originalname?: string;
  encoding?: string;
  mimetype?: string;
  buffer?: any;
  size?: number;
}

export type FileType = IFile;
