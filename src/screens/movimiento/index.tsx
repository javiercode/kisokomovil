import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ActivityIndicator, Alert, RefreshControl, StyleSheet, TouchableHighlight, View, SafeAreaView, ScrollView, Linking, ImageBackground, Image } from 'react-native';
import { DataTable, Text, Searchbar, Avatar, Card, IconButton, Title, Paragraph, Menu, Button, Divider, Chip, Banner } from 'react-native-paper';
import Color from '../../utils/styles/Color';
import { getAuth } from '../../store/login';
import { getService, postService } from '../../utils/HttpService';
import { IMovimiento, TipoTareaEnum } from '../../utils/interfaces/IMovimiento';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MenuPathEnum } from '../../utils/enums/Login.enum';
import { formatDateTime } from '../../utils/GeneralUtils';
import { EstadoTareaEnum } from '../../utils/enums/IGeneral';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { IProducto } from '../../utils/interfaces/IProducto';

interface IMovimientoForm {
    codigoProducto: string,
}
const backgroundImg = '../../assets/images/logoSimple.png';
const backgroundBanner = '../../assets/images/banner.jpg';

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
        <View style={{flex: 1,backgroundColor: '#FFF',}}>
            <Banner
                style={{}}
                visible={true}
                actions={[
                    {
                        label: 'Cerrar',
                        onPress: () => console.log('Banner cerrado'),
                    },
                ]}
            >
                Este es un banner de ejemplo.
            </Banner>
        <ScrollView style={{ backgroundColor: Color.white }}>
            
            <View style={styles.bannerContainer}>
                <Image source={require(backgroundBanner)} style={styles.banner} />
            </View>
            <View style={styles.container}>

                <View style={styles.topBarContainer}>
                    <Image source={require(backgroundImg)} style={styles.logo} />
                    <Text style={styles.footerText}>{`Bienvenido ${getAuth().username}`}</Text>
                </View>
                <View style={styles.topBarContainer}>
                    <Card style={{ width: '40%', height: '100%' }}>
                        <Card.Content style={{ alignItems: 'center' }}>
                            <Avatar.Icon size={40} icon="cash" color={Color.white} style={{ backgroundColor: Color.primary }} />

                        </Card.Content>
                    </Card>
                    <Card style={{ width: '60%', height: '100%' }}>
                        <Card.Content style={{ alignItems: 'center' }}>
                            <Text style={styles.centerText}> Saldo Bs: {saldo} </Text>
                        </Card.Content>
                    </Card>
                </View>
                <View style={{ flex: 1, width: "100%" }}>
                    <View>
                        <Button icon={"finance"} onPress={() => navMovimientos()}>Mis movimientos</Button>
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
                            <IconButton icon="camera-enhance" size={50} iconColor={Color.white} onPress={() => setShowCam(!shoCam)} style={{ alignContent: 'center' }} />
                        </View>
                    </ScrollView>}
                    {!shoCam &&
                        <View>

                            <Card style={{ width: '100%', height: '100%' }}>
                                <Card.Content style={{ alignItems: 'center' }}>
                                    {/* <Button icon={"camera-enhance"} onPress={() => setShowCam(!shoCam)}>Comprar</Button> */}
                                    <IconButton icon="camera-enhance" size={50} onPress={() => setShowCam(!shoCam)} iconColor={Color.primary} style={{ alignContent: 'center' }} />
                                </Card.Content>
                            </Card>
                        </View>
                    }
                    <View><Divider /></View>

                    <View>
                        {producto != null &&
                            <DataTable>
                                <DataTable.Header>
                                    <DataTable.Title textStyle={{ fontWeight: 'bold', fontSize: 12 }}>PRODUCTO</DataTable.Title>
                                    <DataTable.Title textStyle={{ fontWeight: 'bold', fontSize: 12 }} numeric>PRECIO</DataTable.Title>
                                    <DataTable.Title textStyle={{ fontWeight: 'bold', fontSize: 12 }} numeric>DESCUENTO</DataTable.Title>
                                    <DataTable.Title> </DataTable.Title>
                                </DataTable.Header>
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

                            </DataTable>}
                    </View>
                    <View>
                        <Chip icon="alert-circle" onPress={() => setMensaje("")} style={{ display: mensaje !== "" ? "flex" : "none", backgroundColor: Color.secondaryVariant }} textStyle={{ color: Color.white }} >{mensaje}</Chip>
                    </View>
                </View>
            </View>
            <View>
                <Button onPress={() => { navigation.navigate(MenuPathEnum.TAREA_EDIT) }}>Test</Button>
                <IconButton icon="camera-enhance" size={50} onPress={() => { navigation.navigate(MenuPathEnum.TAREA_EDIT) }} iconColor={Color.primary} style={{ alignContent: 'center' }} />
            </View>
        </ScrollView>
        </View>
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
        width: "100%",
        flexDirecion: "row",
        backgroundColor: Color.light,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 0,
        paddingBottom: 0,
        flex: 1
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
        fontSize: 25,
        // padding: 32,
        color: '#777',
        fontWeight: 'bold'
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
    },
    bannerContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // paddingLeft: 20,
        // paddingRight: 20,
        paddingTop: 0,
        // paddingBottom: 5,
    },
    topBarContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 5,
    },
    headingContainer: {
        display: "flex",
        justifyContent: "flex-start",
        paddingLeft: 10,
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
    },
    headingText: {
        fontSize: 20,
        color: Color.muted,
        fontWeight: "800",
    },
    footerText: {
        fontSize: 20,
        color: Color.muted,
        fontWeight: "800",
        paddingTop: '10%'
    },
    toBarText: {
        fontSize: 15,
        fontWeight: "600",
    },
    logo: {
        width: 150, height: 100,
        marginTop: 33,
        alignSelf: 'center',
    },
    banner: {
        width: '100%', height: 100,
        marginTop: 33,
        alignSelf: 'center',
    },
})