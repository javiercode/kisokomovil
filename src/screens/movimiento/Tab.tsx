import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ActivityIndicator, Button, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView, ScrollView } from 'react-native';
import { DataTable, Text, Searchbar, Avatar, Card, IconButton, Title, Paragraph, BottomNavigation } from 'react-native-paper';
import Color from '../../utils/styles/Color';
import { getAuth } from '../../store/login';
import { getService } from '../../utils/HttpService';
import { IMovimiento } from '../../utils/interfaces/IMovimiento';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MenuPathEnum } from '../../utils/enums/Login.enum';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Movimiento from './index';
import Movimientos from "../movimiento";
import Marcas from "../marca";
import Configuracion from "../configuracion";

type Props = NativeStackScreenProps<any, MenuPathEnum.MOVIMIENTO_TAB>;
const Tab = createBottomTabNavigator();
export default function Tarea({ route, navigation }: Props) {

  useEffect(() => {
    console.log("route.params",route.params)
    console.log("route.path",route.path)
    console.log("index tarea");
  }, []);

  return (
    <Tab.Navigator  >
      <Tab.Screen name={MenuPathEnum.MOVIMIENTO} component={Movimientos} initialParams={{}} options={{
              tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="cart-plus" color={Color.secondary} size={30} />),
              headerShown: false,
              tabBarLabelStyle: { fontSize: 15, color: Color.secondary, fontWeight: 'bold' },
              tabBarActiveBackgroundColor: Color.grayBackground
            }} />
            <Tab.Screen name={MenuPathEnum.PRODUCTO} component={Marcas} initialParams={{}} options={{
              tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="format-list-checks" color={Color.secondary} size={30} />),
              headerShown: false,
              tabBarLabelStyle: { fontSize: 15, color: Color.secondary, fontWeight: 'bold' },
              tabBarActiveBackgroundColor: Color.grayBackground
            }} />
            <Tab.Screen name={MenuPathEnum.SETTINGS} component={Configuracion} initialParams={{}} options={{
              tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="cog" color={Color.secondary} size={30} />),
              headerShown: false,
              tabBarLabelStyle: { fontSize: 15, color: Color.secondary, fontWeight: 'bold' },
              tabBarActiveBackgroundColor: Color.grayBackground
            }} />
          
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  header: {
    fontSize: 15,
    textAlign: 'center',
    alignItems: 'center',
    margin: 8,
    fontWeight: 'bold',
  },
  body: {
    color: "#F4F4F4",
    backgroundColor: "#F4F4F4",
    // backgroundColor: Color.white,
    borderRadius: 5,
    margin: 2
  },
  avatarIcon: {
    backgroundColor: Color.primary,
  },
  
})

