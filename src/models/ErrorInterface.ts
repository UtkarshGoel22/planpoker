type ErrorDataType = {
  [key: string]: any;
};

export interface ErrorInterface {
  message: string;
  errData: ErrorDataType;
}
