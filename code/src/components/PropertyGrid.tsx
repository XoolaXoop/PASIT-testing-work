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
import {useMemo} from 'react';



function getComponentFromPropElemData(data: PropertyType) {
  if ('Class' in data && data.Class) {
    switch (data.Class) {
      case 'wxMultiChoiceProperty': {
        return MultiChoiceProperty(data);
      }
      //TODO Поправить компонент FLagsProperty
      // case 'wxFlagsProperty': {
      //   return FlagsProperty(data);
      //   if (typeof data.Choices == 'object' && Array.isArray(data.Value)) {
      //     return FlagsProperty({...data, Value: data.Value, Choices: data.Choices});
      //   } else {
      //     throw new Error('FlagsProperty - не верно переданные данные');
      //   }
      // }
      case 'wxArrayStringProperty': {
        return ArrayStringProperty(data);
      }
      case 'wxBoolProperty': {
        return BoolProperty(data);
      }
      case 'wxEnumProperty': {
        return EnumProperty(data);
      }
      case 'wxEditEnumProperty': {
        return EditEnumProperty(data);
      }
      case 'wxStringProperty': {
        return StringProperty(data);
      }
      // case 'wxDirProperty': {
      //   return DirProperty((str: string) => console.log(str));
      // }
      case 'wxFileProperty': {
        return FileProperty(data);
      }
      case 'wxIntProperty': {
        console.log(data);
        return IntProperty(data);
      }
      case 'wxFloatProperty': {
        return FloatProperty(data);
      }
      case 'wxUIntProperty': {
        return UIntProperty(data);
      }
      default:
        return null;
    }
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

  return <FormControl sx={{display: 'flex', flexDirection: 'column', gap: '20px'}}>{arrComponents}</FormControl>;
}
