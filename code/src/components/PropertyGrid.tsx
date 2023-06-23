import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import json from '../../../base2JSON.json';
import {ReactNode, useMemo} from 'react';
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

import type {NonEmptyObject} from '../types';

type PropertyType = {
  Property?: Array<PropertyType>;
  Class: string;
  Name: string;
  Label: string;
  Help?: string;
  Attribute?: NonEmptyObject | Array<NonEmptyObject>;
  Choices?: NonEmptyObject;
  Value?: Array<string> | string;
  WildCard?: string;
  ShowFullPath?: string;
  InitialPath?: string;
  DialogTitle?: string;
};

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
      console.log(data.Attribute && Array.isArray(data.Attribute), 'FILE');
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
    default:
      return null;
  }
}

export function PropertyGrid() {
  const arrayProperties = useMemo(() => json.Modules.Module.Properties.Property, [json]);

  return (
    <Box sx={{minWidth: 120}}>
      <FormControl fullWidth sx={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
        {arrayProperties.map((property) => {
          if (property && property.Class == 'wxPropertyCategory') {
            let propertyCategoryData = {
              Class: property.Class,
              Name: property.Name,
              Label: property.Label,
              children: property.Property.map((elem) => getComponentFromPropElemData(elem as PropertyType)),
            };
            return PropertyCategory(propertyCategoryData);
          }
        })}
      </FormControl>
    </Box>
  );
}
