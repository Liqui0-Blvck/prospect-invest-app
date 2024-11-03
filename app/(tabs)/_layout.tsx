import React from 'react';
import { Tabs } from 'expo-router';
import { Colors, ColorsNative } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet, View } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';


type CustomTabBarIconProps = {
  name: string;
  color: string;
  focused?: boolean;
};

const CustomTabBarIcon: React.FC<CustomTabBarIconProps> = ({ name, color, focused }) => {
  return (
    <View style={{ alignItems: 'center' }}>
      <TabBarIcon
        //@ts-ignore 
        name={name} 
        color={color} 
      />
      {focused && (
        <View
          style={{
            borderRadius: 55,
            height: 8,
            width: 8,
            backgroundColor: `${color}`,
            marginTop: 5,
          }}
        />
      )}
    </View>
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <Tabs
      initialRouteName='index' // Cambia esto para asegurarte que es 'index'
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarLabel: () => null, // Ocultar el label del tab
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: 'transparent',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 60,
          margin: 'auto',
        },
        tabBarInactiveTintColor: '#C4C4C4',
      }}
    >
      <Tabs.Screen
        name="leads"
        options={{
          title: 'Leads',
          tabBarIcon: ({ color, focused }) => (
            <CustomTabBarIcon name={focused ? 'people' : 'people-outline'} color={ColorsNative.background[200]} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, focused }) => (
            <CustomTabBarIcon name={focused ? 'calendar' : 'calendar-outline'} color={ColorsNative.background[200]} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="index" // Asegúrate que este sea correcto
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <CustomTabBarIcon name={focused ? 'home' : 'home-outline'} color={ColorsNative.background[200]} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notificaciones',
          tabBarIcon: ({ color, focused }) => (
            <CustomTabBarIcon name={focused ? 'notifications' : 'notifications-outline'} color={ColorsNative.background[200]} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <CustomTabBarIcon name={focused ? 'settings' : 'settings-outline'} color={ColorsNative.background[200]} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}


const styles = StyleSheet.create({
  headerLeft: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  background: {
    color: 'blue',
    fontSize: 16,
    marginLeft: 5,
  },
  icon: {
    marginRight: 5,
  },
})