import React, { useState } from 'react';
import { View } from 'react-native'
import { Avatar, Card, Provider, Text } from 'react-native-paper';
import { Permission } from './Permission'
import Color from '../utils/styles/Color';

export default function ControlPermisos() {
  const [permission, sertPermission] = useState<boolean>(false);
  const hasPermission = (permiso: boolean) => {
    sertPermission(permiso)
  }

  return (
    <View>
      <Card>
        <Card.Content style={{ alignItems: 'center', display: !permission ? 'flex' : 'none' }}>
          <Avatar.Icon size={40} icon="shield-check" color={Color.white}
            style={{ backgroundColor: permission ? Color.primary : Color.error }} />
          <Text> Permisos {permission ? "habilitados" : "inhabilitados"} </Text>
        </Card.Content>
      </Card>
      <Permission camera={true} location={true} read={false} write={false} bakground={false} setPermission={hasPermission} />
    </View>
  )
}
