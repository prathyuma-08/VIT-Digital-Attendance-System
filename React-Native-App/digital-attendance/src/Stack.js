import { createStackNavigator } from '@react-navigation/stack';
import Camera from './Camera';
import Home from './Home';

const Stack = createStackNavigator();

export default function MyStack() {
  return (
    <Stack.Navigator
    screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Home" component={Home}/>
      <Stack.Screen name="Camera" component={Camera}/>
    </Stack.Navigator>
  );
}