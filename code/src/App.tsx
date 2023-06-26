import {PropertyGrid} from './components/PropertyGrid';
import {Box} from '@mui/material';
import json from '../../base2JSON.json';

export function App() {
  return <Box sx={{padding: '20px'}}>{PropertyGrid(JSON.stringify(json))}</Box>;
}
