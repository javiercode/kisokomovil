import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { View } from 'react-native'
import { Avatar, Card, Menu, Text } from 'react-native-paper';
import { Permission } from '../../components/Permission'
import { MenuPathEnum } from '../../utils/enums/Login.enum';
import Color from '../../utils/styles/Color';

type Props = NativeStackScreenProps<any, MenuPathEnum.SETTINGS>;
export default function Configuraciones({ route, navigation }: Props) {
  const [permission, sertPermission] = useState<boolean>(false);

  const hasPermission = (permiso: boolean) => {
    sertPermission(permiso)
  }

  return (
    <View>
      <Card>
        <Card.Content style={{ alignItems: 'center' }}>
          <Avatar.Icon size={40} icon="shield-check" color={Color.white} style={{ backgroundColor: permission ? Color.primary : Color.error }} />
          <Text> Permisos habilitados </Text>
        </Card.Content>
      </Card>
      <Permission camera={true} location={true} read={true} write={true} bakground={true} setPermission={hasPermission} />
      <View>
      {/* <Menu.Item leadingIcon="redo" onPress={() => {}} title="Redo" />
    <Menu.Item leadingIcon="undo" onPress={() => {}} title="Undo" />
    <Menu.Item leadingIcon="content-cut" onPress={() => {}} title="Cut" disabled />
    <Menu.Item leadingIcon="content-copy" onPress={() => {}} title="Copy" disabled /> */}
    <Menu.Item leadingIcon="account-edit" onPress={() => {}} title="Perfil" />
    <Menu.Item leadingIcon="account" onPress={() => {}} title="Consentimiento" />
    <Menu.Item leadingIcon="arrow-left-circle" onPress={() => {navigation.navigate(MenuPathEnum.LOGOUT)}} title="Salir" />
      </View>
    </View>
  )
}
