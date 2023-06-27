import {PropertyGrid} from './components/PropertyGrid';
import {Button, Paper} from '@mui/material';
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
    <Paper
      sx={{
        width: '300px',
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ErrorBoundary>
        <DownloadJSONButton saveJSONData={setJSONData} />
      </ErrorBoundary>
    </Paper>
  );
}
