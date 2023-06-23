export type NonEmptyObject = Record<keyof any, any> & {[Symbol.iterator]: any};
