import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Party, User } from '../types';
import { BodyLogger } from './components/BodyLogger';
import { PartyContext, UserContext } from './lib/context';
import theme from './theme';

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [party, setParty] = useState<Party | null>(null);
  const [availableParties, setAvailableParties] = useState<Array<Party>>([]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <PartyContext.Provider value={{ party, availableParties, setParty, setAvailableParties }}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <BodyLogger />
          </ThemeProvider>
        </BrowserRouter>
      </PartyContext.Provider>
    </UserContext.Provider>
  );
}
