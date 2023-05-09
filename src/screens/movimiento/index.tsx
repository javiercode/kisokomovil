import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ActivityIndicator, Alert, RefreshControl, StyleSheet, TouchableHighlight, View, SafeAreaView, ScrollView, Linking } from 'react-native';
import { DataTable, Text, Searchbar, Avatar, Card, IconButton, Title, Paragraph, Menu, Button, Divider, Chip } from 'react-native-paper';
import Color from '../../utils/styles/Color';
import { getAuth } from '../../store/login';
import { getService, postService } from '../../utils/HttpService';
import { IMovimiento, TipoTareaEnum } from '../../utils/interfaces/IMovimiento';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MenuPathEnum } from '../../utils/enums/Login.enum';
import { formatDateTime } from '../../utils/GeneralUtils';
import { EstadoTareaEnum } from '../../utils/enums/IGeneral';
// import { BarCodeScanner } from 'expo-barcode-scanner';
// import QRCodeScanner from 'react-native-qrcode-scanner';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { IProducto } from '../../utils/interfaces/IProducto';
// import { RNCamera } from 'react-native-camera';
// import { QrReader } from 'react-qr-reader';

interface IMovimientoForm {
    codigoProducto: string,
}

type Props = NativeStackScreenProps<any, MenuPathEnum.MOVIMIENTO>;
export default function ListProceso({ route, navigation }: Props) {
    // const [readyCam, setReadyCam] = useState(BarCodeReadEvent);
    const [shoCam, setShowCam] = useState<boolean>(false);
    const [scanned, setScanned] = useState(false);
    const [data, setData] = useState('Sin resultado');
    const [producto, setProducto] = useState<IProducto | null>(null);
    const [mensaje, setMensaje] = useState<string>("");
    const [saldo, setSaldo] = useState<number>(0.0);

    useEffect(() => {
        getSaldo();
    }, []);

    useEffect(() => {
    }, [saldo]);

    const onSuccess = ({ data }: { data: string }) => {
        console.log(data);
        setData(data);
        getService(`/producto/${data}`)
            .then(res => {
                setProducto(res.data);
                console.log(res.data)
            });
    };

    const onRefresh = useCallback(() => {
        getSaldo()
    }, []);

    const saveMovimiento = (codigo: string) => {
        try {
            const createDto: IMovimientoForm = {
                codigoProducto: codigo
            };

            if (codigo !== "") {
                postService("/movimiento/create", createDto).then((result) => {
                    console.log("result.message", result.message)
                    setMensaje(result.message);
                    if (result.success) {
                        setProducto(null)
                    }
                });
            } else {
                setMensaje("Escanee un producto valido, porfavor");
            }
        } catch (error) {
            console.error(error)
        }
    };

    const getSaldo = async () => {
        // setLoading(true);
        getService(`/movimiento/list/0/1`)
            .then(res => {
                if (res.success) {
                    setSaldo(res.suma || 0);
                }
            }).catch(error => {
                throw new Error(error);
            })
            .finally(() => {
                // setRefreshing(false);
                // setLoading(false)
            })
    }

    const navMovimientos = () => {
        navigation.navigate(MenuPathEnum.MOVIMIENTO_LIST, {})
    };

    return (
        <ScrollView >

            <Card>
                <Card.Content style={{ alignItems: 'center' }}>
                    <Avatar.Icon size={40} icon="cash" color={Color.white} style={{ backgroundColor: Color.primary }} />
                    <Text> Saldo Bs: {saldo} </Text>
                </Card.Content>
            </Card>

            <Card key={"head-card"}>
                <Card.Title key={"head-card-title"}
                    title={"Escanea el producto"}
                    titleStyle={{ textAlign: 'center' }}
                />
            </Card>


            <View><Divider /></View>
            <View>
                <Button icon={"finance"} onPress={() => navMovimientos()}>Mis movimientos</Button>
                {/* <IconButton icon="finance" size={20} onPress={() => navMovimientos()}>Ir</IconButton> */}
            </View>
            <View><Divider /></View>
            {shoCam && <ScrollView >
                <View>
                    <QRCodeScanner
                        // onRead={({data})=> {console.log(data); setData(data)}} 
                        onRead={onSuccess}
                        flashMode={RNCamera.Constants.FlashMode.off}
                        containerStyle={{ width: '100%', height: 300 }}
                        reactivate={true}
                    // cameraStyle={{width:'100%',height:100}}
                    />
                    <IconButton icon="camera-enhance" size={50} onPress={() => setShowCam(!shoCam)} style={{alignContent:'center'}}/>
                </View>
            </ScrollView>}
            {!shoCam && <View>
                <Button icon={"camera-enhance"} onPress={() => setShowCam(!shoCam)}>Comprar</Button>
                {/* <IconButton icon="camera-enhance" size={50} onPress={() => setShowCam(!shoCam)}/> */}
            </View>}
            <View><Divider /></View>

            <View>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title textStyle={{ fontWeight: 'bold', fontSize: 12 }}>PRODUCTO</DataTable.Title>
                        <DataTable.Title textStyle={{ fontWeight: 'bold', fontSize: 12 }} numeric>PRECIO</DataTable.Title>
                        <DataTable.Title textStyle={{ fontWeight: 'bold', fontSize: 12 }} numeric>DESCUENTO</DataTable.Title>
                        <DataTable.Title> </DataTable.Title>
                    </DataTable.Header>
                    {producto != null &&
                        <DataTable.Row>
                            <DataTable.Cell>{producto.nombre}</DataTable.Cell>
                            <DataTable.Cell numeric>{`Bs. ${producto.monto}`}</DataTable.Cell>
                            <DataTable.Cell numeric>{`Bs. ${producto.descuento}`}</DataTable.Cell>
                            <DataTable.Cell numeric>
                                <IconButton
                                    icon="cart-arrow-up"
                                    size={20}
                                    onPress={() => saveMovimiento(producto.codigo)}
                                />
                            </DataTable.Cell>
                        </DataTable.Row>
                    }

                    {/* <DataTable.Pagination
                        page={page}
                        numberOfPages={3}
                        onPageChange={(page) => setPage(page)}
                        label="1-2 of 6"
                        optionsPerPage={optionsPerPage}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={setItemsPerPage}
                        showFastPagination
                        optionsLabel={'Rows per page'}
                    /> */}
                </DataTable>
            </View>
            <View>
                <Chip icon="alert-circle" onPress={() => setMensaje("")} style={{ display: mensaje !== "" ? "flex" : "none", backgroundColor: Color.secondaryVariant }} textStyle={{ color: Color.white }} >{mensaje}</Chip>
            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    title: {
        padding: 10,
        margin: 5,
        // alignItems: 'stretch',
    },
    textLeft: {
        margin: 10,
        color: Color.black,
        fontWeight: 'bold'
    },
    textRight: {
        margin: 10,
        color: Color.black
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
        backgroundColor: Color.white,
        color: Color.black,
        paddingBottom: 10
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    marker: {
        marginLeft: 46,
        marginTop: 33,
        fontWeight: 'bold',
    },

    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777'
    },
    textBold: {
        fontWeight: '500',
        color: '#000'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
        padding: 16
    }
})