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
import {useMemo} from 'react';
import {FlagsProperty} from './FlagsProperty';
import {saveAs} from 'file-saver';
import Button from '@mui/material/Button';
import {Paper} from '@mui/material';
import {ErrorComponent} from '../ErrorComponent';

function getComponentFromPropElemData(data: PropertyType) {
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
  }
}

function parseNumber(str: string) {
  // Проверяем, начинается ли строка с префикса, указывающего на систему исчисления
  if (str.startsWith('0x')) {
    // Строка начинается с "0x", значит число представлено в шестнадцатеричной системе исчисления
    return parseInt(str, 16);
  } else if (str.startsWith('0b')) {
    // Строка начинается с "0b", значит число представлено в двоичной системе исчисления
    return parseInt(str.substr(2), 2);
  } else if (str.startsWith('0o')) {
    // Строка начинается с "0o", значит число представлено в восьмеричной системе исчисления
    return parseInt(str.substr(2), 8);
  } else {
    // Если строка не начинается с указанных префиксов, считаем число в десятичной системе исчисления
    return parseFloat(str);
  }
}

const arrayPropertiesNames: Array<string> = [];

export function PropertyGrid({inComingJSON}: {inComingJSON: string}) {
  try {
    const json = JSON.parse(inComingJSON);
    const arrayProperties: Array<PropertyCategoryProps> = useMemo(
      () => json.Modules.Module.Properties.Property,
      [json]
    );

    const arrComponents = arrayProperties.map((property) => {
      if (property.Class == 'wxPropertyCategory' && property.Property) {
        let propertyCategoryData = {
          Class: property.Class,
          Name: property.Name,
          Label: property.Label,
          Property: property.Property,
          children: property.Property.map((elem) => {
            arrayPropertiesNames.push(elem.Name);
            if ('Class' in elem && elem.Class) {
              return getComponentFromPropElemData(elem as PropertyType);
            }
            return null;
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
      return arrayPropertiesNames.reduce((prev: Record<string, string | Array<string> | number>, cur: string) => {
        let localStorageValue = localStorage.getItem(cur);
        if (localStorageValue) {
          console.log(cur);
          if (cur == 'MultiChoiceName' || cur == 'FlagsName') {
            prev[cur] = localStorageValue.split(', ');
          } else if (cur == 'IntName' || cur == 'FloatName' || cur == 'BoolName') {
            prev[cur] = Number(localStorageValue);
          } else if (cur == 'UIntName') {
            let num: number = parseInt(localStorageValue, 16);
            prev[cur] = num;
          } else {
            prev[cur] = localStorageValue;
          }
        }
        return prev;
      }, {});
    }

    function setValues(incomingJson: string, valuesObject: Record<string, string | string[] | number>) {
      const parsedJson = JSON.parse(incomingJson);
      const newJson = JSON.parse(JSON.stringify(parsedJson));
      newJson.Modules.Module.Properties.Property.forEach((property: any) => {
        property.Property.forEach((prop: any) => {
          if (valuesObject.hasOwnProperty(prop.Name)) {
            if (Array.isArray(valuesObject[prop.Name])) {
              prop.Value = JSON.stringify(valuesObject[prop.Name]);
            }

            prop.Value = valuesObject[prop.Name];
          }
        });
      });
      const newJsonString = JSON.stringify(newJson, null, 2);
      console.log(JSON.parse(newJsonString));
      return newJsonString;
    }

    const handleExportData = () => {
      const newJSONString = setValues(inComingJSON, getValues());
      const blob = new Blob([newJSONString], {type: 'application/json'});
      saveAs(blob, 'exportedData.json');
    };

    return (
      <FormControl sx={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
        <Paper
          sx={{
            marginRight: ' auto',
            width: '500px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '20px',
            padding: '20px',
          }}>
          {arrComponents}
          <Button
            sx={{width: '200px', margin: '0 auto'}}
            variant='contained'
            color='primary'
            onClick={handleExportData}>
            exportData
          </Button>
        </Paper>
      </FormControl>
    );
  } catch (error: any) {
    return ErrorComponent(error as Error);
  }
}
