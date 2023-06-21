import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { View,ScrollView } from 'react-native'
import { Avatar, Card, Dialog, Menu, Portal, Provider, Text } from 'react-native-paper';
import { Permission } from '../../components/Permission'
import { MenuPathEnum } from '../../utils/enums/Login.enum';
import Color from '../../utils/styles/Color';
import ControlPermisos from '../../components/ControlPermission';
import { getAuth } from '../../store/login';

type Props = NativeStackScreenProps<any, MenuPathEnum.SETTINGS>;
export default function Configuraciones({ route, navigation }: Props) {
  const [permission, sertPermission] = useState<boolean>(false);
  const [showTerm, setShowTerm] = useState(false);

  const hasPermission = (permiso: boolean) => {
    sertPermission(permiso)
  }

  return (
    <Provider>
    <View>
      <Card>
      <Card.Content style={{ alignItems: 'center' }}>
          <Avatar.Icon size={60} icon="account-circle" color={Color.white} style={{ backgroundColor: Color.primary }} />
          <Text> Usuario {getAuth().username} </Text>
        </Card.Content>
        <Card.Content style={{ alignItems: 'center',display:!permission?'flex':'none' }}>
          <Avatar.Icon size={40} icon="shield-check" color={Color.white} 
            style={{ backgroundColor: permission ? Color.primary : Color.error }} />
          <Text> Permisos {permission?"habilitados":"inhabilitados"} </Text>
        </Card.Content>
        
      </Card>
      <ControlPermisos/>
      <Permission camera={true} location={true} read={false} write={false} bakground={false} setPermission={hasPermission} />
      <View>
        {/* <Menu.Item leadingIcon="redo" onPress={() => {}} title="Redo" />
    <Menu.Item leadingIcon="undo" onPress={() => {}} title="Undo" />
    <Menu.Item leadingIcon="content-cut" onPress={() => {}} title="Cut" disabled />
    <Menu.Item leadingIcon="content-copy" onPress={() => {}} title="Copy" disabled /> */}
        <Menu.Item leadingIcon="account-edit" onPress={() => { }} title="Perfil" />
        <Menu.Item leadingIcon="file-document-multiple" onPress={() => {setShowTerm(true)}} title="Terminos y condiciones" />
        {/* <Menu.Item leadingIcon="account" onPress={() => { }} title="Consentimiento" /> */}
        <Menu.Item leadingIcon="arrow-left-circle" onPress={() => { navigation.navigate(MenuPathEnum.LOGOUT) }} title="Salir" />
      </View>
    </View>

    <Portal>
        <Dialog visible={showTerm} onDismiss={()=>setShowTerm(false)}>
          <Dialog.Content>
            <ScrollView style={{}}>
              <Text variant="titleMedium" style={{textAlign:'center', fontWeight:'bold'}}>Términos de Referencia</Text>
              <Text variant="titleMedium">
              1.	Descripción del proyecto:
o	El objetivo de este proyecto es desarrollar una aplicación móvil para dispositivos Android que permita a los usuarios en Bolivia controlar y gestionar los saldos de promoción de sus servicios de telecomunicaciones. La aplicación proporcionará información actualizada sobre los saldos, permitirá realizar consultas y recargas, y ofrecerá funciones adicionales para facilitar la administración de los saldos de promoción.
2.	Características principales de la aplicación:
o	Consulta de saldos de promoción: Los usuarios podrán verificar el saldo disponible en sus promociones de servicios de telecomunicaciones, incluyendo datos móviles, minutos de llamadas y mensajes de texto.
o	Historial de transacciones: La aplicación registrará y mostrará un historial detallado de las transacciones realizadas, como recargas, consumo de saldo y vencimiento de promociones.
o	Notificaciones y recordatorios: Los usuarios recibirán notificaciones periódicas sobre el estado de sus promociones, fechas de vencimiento y ofertas especiales.
o	Recargas y pagos: La aplicación permitirá recargar el saldo de promoción directamente desde la aplicación utilizando métodos de pago seguros y reconocidos en Bolivia.
o	Soporte multilingüe: La aplicación estará disponible en español y otros idiomas relevantes en Bolivia.
3.	Requisitos técnicos:
o	La aplicación se desarrollará específicamente para dispositivos Android y estará optimizada para su funcionamiento en diferentes tamaños de pantalla y resoluciones.
o	Se utilizará el lenguaje de programación Kotlin para el desarrollo de la aplicación.
o	La aplicación se integrará con las API y servicios proporcionados por los operadores de telecomunicaciones en Bolivia para obtener información en tiempo real sobre los saldos de promoción de los usuarios.
o	Se aplicarán las directrices y regulaciones establecidas por la Play Store de Google para el desarrollo y publicación de la aplicación, incluyendo políticas de privacidad, seguridad y contenido aceptable.
4.	Diseño de interfaz de usuario:
o	La interfaz de usuario de la aplicación se diseñará de manera intuitiva y fácil de usar, siguiendo las mejores prácticas de diseño de aplicaciones móviles.
o	Se utilizarán colores, iconos y elementos visuales que sean coherentes con la identidad de marca de la aplicación y que proporcionen una experiencia visual atractiva.
o	La navegación dentro de la aplicación será clara y se utilizarán controles de interfaz de usuario estándar de Android para garantizar la familiaridad y facilidad de uso para los usuarios.
5.	Consideraciones legales y de privacidad:
o	La aplicación cumplirá con todas las leyes y regulaciones de protección de datos y privacidad en Bolivia, incluyendo el cumplimiento de la Ley de Protección de Datos Personales.
o	Se implementarán medidas de seguridad adecuadas para proteger los datos personales de los usuarios y se proporcionará una política de privacidad clara y accesible en la aplicación.
o	Se garantizará la seguridad de las transacciones realizadas dentro de la aplicación mediante el uso de protocolos de cifrado y métodos de autenticación seguros.
6.	Entregables esperados:
o	Código fuente completo y documentación técnica del desarrollo de la aplicación.
o	Aplicación móvil instalable y lista para su publicación en la Play Store.
o	Documentación de pruebas y garantía de calidad.

              </Text>
              
            </ScrollView>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </Provider>
  )
}
