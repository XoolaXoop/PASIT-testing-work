import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import json from '../../../base2JSON.json';
import {ArrayStringProperty} from './ArrayStringProperty';
import {BoolProperty} from './BoolProperty';
import {DirProperty} from './DirProperty';
import {EditEnumProperty} from './EditEnumProperty';
import {EnumProperty} from './EnumProperty';
import {FileProperty} from './FileProperty';
import {FlagsProperty} from './FlagsProperty';
import {FloatProperty} from './FloatProperty';
import {IntProperty} from './IntProperty';
import {MultiChoiceProperty} from './MultiChoiceProperty';
import {PropertyCategory} from './PropertyCategory';
import {StringProperty} from './StringProperty';
import {UIntProperty} from './UIntProperty';
import type {PropertyType} from '../types';
import type {PropertyCategoryProps} from '../types';

import {useMemo} from 'react';

function getNumberFromString(numberStr: string) {
  let arrSymbols = numberStr.split('');
  if (arrSymbols[0] == '-') {
    let arrSymbolsSliced = arrSymbols.slice(1);
    console.log('spliced', arrSymbolsSliced, arrSymbols, numberStr);
    let numberInt = Number(arrSymbolsSliced.join());
    if (!isNaN(numberInt)) {
      return numberInt;
    }
  } else if (!isNaN(Number(numberStr))) {
    return Number(numberStr);
  } else {
    throw new Error('invalid data type');
  }
}

function getComponentFromPropElemData(data: PropertyType) {
  switch (data.Class) {
    case 'wxMultiChoiceProperty': {
      if (typeof data.Choices == 'object' && Array.isArray(data.Value)) {
        return MultiChoiceProperty({...data, Value: data.Value, Choices: data.Choices});
      } else {
        throw new Error('MultiChoiceProperty - не верно переданные данные');
      }
    }
    //TODO Поправить компонент FLagsProperty
    case 'wxFlagsProperty': {
      if (typeof data.Choices == 'object' && Array.isArray(data.Value)) {
        return FlagsProperty({...data, Value: data.Value, Choices: data.Choices});
      } else {
        throw new Error('FlagsProperty - не верно переданные данные');
      }
    }
    case 'wxArrayStringProperty': {
      if (
        data.Attribute &&
        !Array.isArray(data.Attribute) &&
        data.Attribute.Name === 'Delimiter' &&
        typeof data.Attribute.text === 'string' &&
        typeof data.Value === 'string'
      ) {
        let attributeText: string = data.Attribute.text;
        let StringPropertyValue = data.Value;
        return ArrayStringProperty({
          ...data,
          Value: StringPropertyValue,
          Attribute: {Name: 'Delimiter', text: attributeText},
        });
      } else {
        throw new Error('ArrayStringProperty - не верно переданные данные');
      }
    }
    case 'wxBoolProperty': {
      if (
        data.Attribute &&
        !Array.isArray(data.Attribute) &&
        data.Attribute.Name == 'UseCheckbox' &&
        typeof data.Attribute.text === 'string' &&
        (data.Value === '0' || data.Value === '1')
      ) {
        let BoolPropertyValue: '0' | '1' = data.Value;
        return BoolProperty({...data, Value: BoolPropertyValue});
      } else {
        throw new Error('BoolProperty - не верно переданные данные');
      }
    }
    case 'wxEnumProperty': {
      if (typeof data.Choices === 'object' && typeof data.Value === 'string') {
        let EnumPropertyValue: string = data.Value;
        let EnumPropertyChoices = data.Choices;
        return EnumProperty({...data, Value: EnumPropertyValue, Choices: EnumPropertyChoices});
      } else {
        throw new Error('EnumProperty - не верно переданные данные');
      }
    }
    case 'wxEditEnumProperty': {
      if (typeof data.Choices === 'object' && typeof data.Value === 'string') {
        let EditEnumPropertyValue: string = data.Value;
        let EnumPropertyChoices = data.Choices;
        return EditEnumProperty({...data, Value: EditEnumPropertyValue, Choices: EnumPropertyChoices});
      } else {
        throw new Error('EditEnumProperty - не верно переданные данные');
      }
    }
    case 'wxStringProperty': {
      if (typeof data.Value == 'string') {
        let stringPropertyValue: string = data.Value;
        return StringProperty({...data, Value: stringPropertyValue});
      } else {
        throw new Error('StringProperty - не верно переданные данные');
      }
    }
    case 'wxDirProperty': {
      return DirProperty((str: string) => console.log(str));
    }
    case 'wxFileProperty': {
      if (data.Attribute && Array.isArray(data.Attribute)) {
        let ShowFullPathValue: string = data.Attribute[0].text;
        let DialogTitleValue: string = data.Attribute[1].text;
        let WildcardValue: string = data.Attribute[2].text;
        let InitialPathValue: string = data.Attribute[3].text;
        return FileProperty({
          ...data,
          ShowFullPath: ShowFullPathValue,
          DialogTitle: DialogTitleValue,
          Wildcard: WildcardValue,
          InitialPath: InitialPathValue,
        });
      } else {
        throw new Error('wxFileProperty - не верно переданные данные');
      }
    }
    case 'wxIntProperty': {
      if (Array.isArray(data.Attribute) && typeof data.Value == 'string') {
        let arrAttributesValues = data.Attribute.map((attributeObj) => attributeObj.text);
        let [maxValueStr, minValueStr, Units, InlineHelp] = arrAttributesValues;
        let [maxValueInt, minValueInt, ValueInt] = [maxValueStr, minValueStr, data.Value].map((elem) =>
          getNumberFromString(elem)
        );
        if (typeof maxValueInt == 'number' && typeof minValueInt == 'number' && typeof ValueInt == 'number') {
          return IntProperty({
            ...data,
            maxValue: maxValueInt,
            minValue: minValueInt,
            InlineHelp: InlineHelp,
            Units: Units,
            Value: ValueInt,
          });
        } else {
          throw new Error('wxIntProperty - не верно переданные данные');
        }
      } else {
        throw new Error('wxIntProperty - не верно переданные данные');
      }
    }
    case 'wxFloatProperty': {
      if (Array.isArray(data.Attribute) && typeof data.Value == 'string') {
        let arrAttributesValues = data.Attribute.map((attributeObj) => attributeObj.text);
        let [maxValueStr, minValueStr, Units, InlineHelp, PrecisionStr] = arrAttributesValues;
        let [maxValueInt, minValueInt, ValueInt, PrecisionInt] = [
          maxValueStr,
          minValueStr,
          data.Value,
          PrecisionStr,
        ].map((elem) => getNumberFromString(elem));
        if (
          typeof maxValueInt == 'number' &&
          typeof minValueInt == 'number' &&
          typeof ValueInt == 'number' &&
          typeof PrecisionInt == 'number'
        ) {
          return FloatProperty({
            ...data,
            maxValue: maxValueInt,
            minValue: minValueInt,
            InlineHelp,
            Precision: PrecisionInt,
            Units: Units,
            Value: ValueInt,
          });
        } else {
          throw new Error('wxFloatProperty - не верно переданные данные');
        }
      } else {
        throw new Error('wxFloatProperty - не верно переданные данные');
      }
    }
    case 'wxUIntProperty': {
      if (Array.isArray(data.Attribute) && typeof data.Value == 'string') {
        let arrAttributesValues = data.Attribute.map((attributeObj) => attributeObj.text);
        let [ConditionVisible, maxValue, Units, InlineHelp, Base, Prefix] = arrAttributesValues;
        let Value = data.Value;
        if (typeof maxValue == 'string' && typeof Value == 'string' && Base && Prefix) {
          return UIntProperty({
            ...data,
            maxValue,
            InlineHelp,
            Units: Units,
            Value,
            Base,
            Prefix,
            ConditionVisible,
          });
        } else {
          throw new Error('wxFloatProperty - не верно переданные данные');
        }
      } else {
        throw new Error('wxFloatProperty - не верно переданные данные');
      }
    }
    default:
      return null;
  }
}

export function PropertyGrid() {
  //fetch запрос делаем условно, и у нас есть json
  const arrayProperties = useMemo(() => json.Modules.Module.Properties.Property, [json]);

  const arrComponents = arrayProperties.map((property) => {
    let propertyCategoryData = {
      Class: property.Class,
      Name: property.Name,
      Label: property.Label,
      children: property.Property.map((elem) => getComponentFromPropElemData(elem as PropertyType)),
    };
    return PropertyCategory(propertyCategoryData);
  });

  return (
    <Box sx={{minWidth: 120}}>
      <FormControl fullWidth sx={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
        {arrComponents}
      </FormControl>
    </Box>
  );
}
