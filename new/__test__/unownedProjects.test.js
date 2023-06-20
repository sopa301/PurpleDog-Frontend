import '@testing-library/jest-dom';
import * as React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';
import UnownedProjects from '../src/components/projects/unownedProjects';

test('Shows projects correctly', () => {
  const [projs, setProjs] = React.useState();
  render(<UnownedProjects array={projs} setArray={setProjs}/>);
  // not done
  expect(screen.get)
})