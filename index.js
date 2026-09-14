/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import Store from './src/redux/Store';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();


const ToolHoundApp = () => {
    return (
        <Provider store={Store}>

            <App />
        </Provider>
    );
};

AppRegistry.registerComponent(appName, () => ToolHoundApp);

