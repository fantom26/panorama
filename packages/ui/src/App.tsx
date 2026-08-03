import { Provider } from 'react-redux'

import InboxScreen from '@/pages/InboxScreen'
import store from '@/store'

function App() {
  return (
    <Provider store={store}>
      <InboxScreen />
    </Provider>
  )
}

export default App
