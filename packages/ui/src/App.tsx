import { Provider } from 'react-redux'

import Screen from '@/pages/Screen'
import store from '@/store'

function App() {
  return (
    <Provider store={store}>
      <Screen />
    </Provider>
  )
}

export default App
