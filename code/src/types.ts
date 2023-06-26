export type {PropertyCategoryProps} from './components/PropertyCategory';
import type {ArrayStringPropertyProps} from './components/ArrayStringProperty';
import type {BoolPropertyProps} from './components/BoolProperty';
import type {EditEnumPropertyProps} from './components/EditEnumProperty';
import type {EnumPropertyProps} from './components/EnumProperty';
import type {FilePropertyProps} from './components/FileProperty';
import type {FloatPropertyProps} from './components/FloatProperty';
import type {IntPropertyProps} from './components/IntProperty';
import type {MultiChoicePropertyProps} from './components/MultiChoiceProperty';
import type {StringPropertyProps} from './components/StringProperty';
import type {UIntPropertyProps} from './components/UIntProperty';
import type {PropertyCategoryProps} from './components/PropertyCategory';
import type {FlagsPropertyProps} from './components/FlagsProperty';
export type NonEmptyObject = Record<keyof any, any> & {[Symbol.iterator]: any};

export type PropertyType =
  | ArrayStringPropertyProps
  | BoolPropertyProps
  | EditEnumPropertyProps
  | EnumPropertyProps
  | FilePropertyProps
  | FloatPropertyProps
  | IntPropertyProps
  | MultiChoicePropertyProps
  | StringPropertyProps
  | UIntPropertyProps
  | PropertyCategoryProps
  | FlagsPropertyProps;
