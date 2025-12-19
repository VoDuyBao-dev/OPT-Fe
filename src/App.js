import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routers/AppRouter'
import GlobalStyles from './assets/css/globalStyles';
import GribCustom from './assets/css/gribCustom/GribCustom';
function App() {
  return (
    <GlobalStyles>
      <GribCustom>
        <BrowserRouter>
          <AppRouter/>
        </BrowserRouter>
      </GribCustom>
    </GlobalStyles>
    
  )
}

export default App;
