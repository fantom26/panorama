import store from '@/store';

import { Provider } from 'react-redux';
import InboxScreen from '@/pages/InboxScreen';

function App() {
  return (
    <Provider store={store}>
      <InboxScreen />
    </Provider>
  );
}

export default App;
