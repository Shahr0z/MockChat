import { LogBox, SafeAreaView, Text } from 'react-native'
import React from 'react'
import StackNavigation from './src/navigation/stacks'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/store';

const App = () => {

  LogBox.ignoreAllLogs()

  return (
    <Provider store={store}>
      <PersistGate loading={<Text style={{ textAlign: 'center', color: 'red', fontSize: 33 }}>Loading...</Text>} persistor={persistor}>
        <SafeAreaView style={{ flex: 1 }}>
          <StackNavigation />
        </SafeAreaView>
      </PersistGate>
    </Provider>
  )
}

export default App
