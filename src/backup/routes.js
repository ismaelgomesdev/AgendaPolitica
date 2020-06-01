import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Main from './pages/Main';
import LoginScreen from './pages/Login';
const Routes = createAppContainer(createSwitchNavigator({ LoginScreen }));

export default Routes;