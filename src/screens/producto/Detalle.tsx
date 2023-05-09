import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ActivityIndicator, Dimensions, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { DataTable, Text, Searchbar, Avatar, Card, IconButton, Title, Paragraph, TextInput, Button } from 'react-native-paper';
import Color from '../../utils/styles/Color';
import { getAuth } from '../../store/login';
import { getService } from '../../utils/HttpService';
import { IProducto } from '../../utils/interfaces/IProducto';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MenuPathEnum } from '../../utils/enums/Login.enum';
import MapView, { Marker } from 'react-native-maps';
import { IMapConfig } from '../../utils/interfaces/IGeneral';
import { getInitMap } from '../../utils/MapUtils';

const { width, height } = Dimensions.get('window');
type Props = NativeStackScreenProps<any, MenuPathEnum.CLIENTE_DETAIL>;
export default function ClienteDetalle({ route, navigation }: Props) {
    const [cliente, setCliente] = useState<IProducto>(route.params?.cliente)
    const [mapReady, setMapReady] = useState(false);
    const [initMapConfig, setInitMapConfig] = useState<IMapConfig>();


    useEffect(() => {
        // (async () => {
            const LATITUDE_DELTA = 0.0922;
            const ASPECT_RATIO = width / height;
            const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
            // getPosition()
            const mapInit = {
                latitude: 0,
                longitude: 0,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            } as IMapConfig;
            setInitMapConfig(mapInit)
            console.log(initMapConfig)
            setMapReady(true)
        // })();
    }, []);

    return (
        <ScrollView>
            <Title style={styles.title}>Información</Title>
            <DataTable.Row>
                <DataTable.Cell>Nombre</DataTable.Cell>
                <DataTable.Cell>{cliente.nombre}</DataTable.Cell>
            </DataTable.Row>
            
            {mapReady &&
                <Card.Content>
                    <MapView
                        initialRegion={initMapConfig}
                        style={{
                            width: (width * 0.9),
                            height: (width * 0.9),
                        }}
                    >
                        <Marker
                            draggable={true}
                            coordinate={{
                                latitude: initMapConfig?.latitude ||0,
                                longitude: initMapConfig?.longitude ||0
                            }}
                            title={cliente.nombre}
                            description={cliente.codigo}
                            onDragEnd={(e) => { console.log('dragEnd', e.nativeEvent.coordinate) }}
                        />
                    </MapView>
                </Card.Content>}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    title: {
        padding: 10,
        margin: 5,
        // alignclientes: 'stretch',
    },
    text: {
        justifyContent: 'center',
        margin: 10,
    },
    button: {
        backgroundColor: '#fff',
        textShadowColor: 'blue',
        borderWidth: 0.5,
        borderColor: '#000',
        height: 40,
        borderRadius: 5,
        margin: 10,
    },
    labelStyle: {
        color: "black",
        fontSize: 18
    },
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignclientes: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    marker: {
        marginLeft: 46,
        marginTop: 33,
        fontWeight: 'bold',
    },
})