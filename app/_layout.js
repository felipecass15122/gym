
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

export default function Layout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0f172a' } }} />
    </View>
  );
}
