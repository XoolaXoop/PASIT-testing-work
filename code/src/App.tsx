import {PropertyGrid} from './components/PropertyGrid';
import {Button} from '@mui/material';
import {useState} from 'react';
import {ErrorBoundary} from './ErrorBoundary';

const DownloadJSONButton = ({saveJSONData}: {saveJSONData: (json: string) => void}) => {
  const handleDownload = () => {
    const fileUrl = '/base2JSON.json'; // Путь к файлу в папке public

    fetch(fileUrl)
      .then((response) => response.json())
      .then((data) => {
        saveJSONData(JSON.stringify(data));
      })
      .catch((error) => {
        console.error('Ошибка при загрузке файла:', error);
      });
  };

  return (
    <Button variant='contained' color='primary' onClick={handleDownload}>
      Загрузить JSON
    </Button>
  );
};

export function App() {
  const [JSONData, setJSONData] = useState<string>('');
  if (JSONData != '') {
    return (
      <ErrorBoundary>
        <PropertyGrid inComingJSON={JSONData} />
      </ErrorBoundary>
    );
  }
  return (
    <ErrorBoundary>
      <DownloadJSONButton saveJSONData={setJSONData} />
    </ErrorBoundary>
  );
}
