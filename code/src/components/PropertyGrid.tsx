import FormControl from '@mui/material/FormControl';
import {ArrayStringProperty} from './ArrayStringProperty';
import {BoolProperty} from './BoolProperty';
import {EditEnumProperty} from './EditEnumProperty';
import {EnumProperty} from './EnumProperty';
import {FileProperty} from './FileProperty';
import {FloatProperty} from './FloatProperty';
import {IntProperty} from './IntProperty';
import {MultiChoiceProperty} from './MultiChoiceProperty';
import {PropertyCategory} from './PropertyCategory';
import {StringProperty} from './StringProperty';
import {UIntProperty} from './UIntProperty';
import type {PropertyCategoryProps, PropertyType} from '../types';
import {useMemo, useEffect} from 'react';
import {FlagsProperty} from './FlagsProperty';

function getComponentFromPropElemData(data: PropertyType) {
  if ('Class' in data && data.Class) {
    switch (data.Class) {
      case 'wxMultiChoiceProperty': {
        return MultiChoiceProperty(data);
      }
      case 'wxFlagsProperty': {
        return FlagsProperty(data);
      }
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
      case 'wxFileProperty': {
        return FileProperty(data);
      }
      case 'wxIntProperty': {
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
const arrayPropertiesNames: Array<string> = [];

export function PropertyGrid(inComingJSON: string) {
  const json = JSON.parse(inComingJSON);
  const arrayProperties: Array<PropertyCategoryProps> = useMemo(() => json.Modules.Module.Properties.Property, [json]);

  const arrComponents = arrayProperties.map((property) => {
    if (property.Class == 'wxPropertyCategory' && property.Property) {
      let propertyCategoryData = {
        Class: property.Class,
        Name: property.Name,
        Label: property.Label,
        Property: property.Property,
        children: property.Property.map((elem) => {
          arrayPropertiesNames.push(elem.Name);
          return getComponentFromPropElemData(elem as PropertyType);
        }),
        arrayPropertiesNames,
      };
      arrayPropertiesNames.push(property.Name);

      return PropertyCategory(propertyCategoryData);
    } else {
      return null;
    }
  });

  function getValues() {
    return arrayPropertiesNames.reduce((prev: Record<string, string | Array<string>>, cur: string) => {
      let localStorageValue = localStorage.getItem(cur);
      if (localStorageValue) {
        if (cur == 'MultiChoiceName' || cur == 'FlagsName') {
          prev[cur] = localStorageValue.split(',');
        }
        prev[cur] = localStorageValue;
      }
      return prev;
    }, {});
  }

  function setValues(incomingJson: string, valuesObject: Record<string, string | string[]>) {
    const parsedJson = JSON.parse(incomingJson);
    const newJson = JSON.parse(JSON.stringify(parsedJson));
    newJson.Modules.Module.Properties.Property.forEach((property: any) => {
      property.Property.forEach((prop: any) => {
        if (valuesObject.hasOwnProperty(prop.Name)) {
          if (Array.isArray(valuesObject[prop.Name])) {
            prop.value = JSON.stringify(valuesObject[prop.Name]);
          }
          prop.Value = valuesObject[prop.Name];
        }
      });
    });
    const newJsonString = JSON.stringify(newJson, null, 2);
    return newJsonString;
  }

  useEffect(() => {
    alert(setValues(inComingJSON, getValues()));
  }, []);

  return <FormControl sx={{display: 'flex', flexDirection: 'column', gap: '20px'}}>{arrComponents}</FormControl>;
}
