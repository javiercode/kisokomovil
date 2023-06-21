import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet, View, Image, Dimensions } from 'react-native';
import { SafeAreaView, ScrollView } from 'react-native';
import { DataTable, Text, Searchbar, Avatar, Card, IconButton, Title, Paragraph, Divider } from 'react-native-paper';
import Color from '../../utils/styles/Color';
import { getAuth } from '../../store/login';
import { getService } from '../../utils/HttpService';
import { IProducto } from '../../utils/interfaces/IProducto';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MenuPathEnum } from '../../utils/enums/Login.enum';
import { IMarca } from '../../utils/interfaces/IMarca';
import CardContent from 'react-native-paper/lib/typescript/src/components/Card/CardContent';


const { width, height } = Dimensions.get('screen')
const backgroundImg = '../../assets/images/banner-productos.png';

type Props = NativeStackScreenProps<any, MenuPathEnum.PRODUCTO>;
export default function Marca({ route, navigation }: Props) {
    const [paginaActual, setPaginaActual] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [dataList, setDatalist] = useState([]);
    const [paginaTotal, setPaginaTotal] = useState(0);
    const [saldo, setSaldo] = useState<number>(0);
    
    useEffect(() => {
        setSaldo(0.00)
        getList(paginaActual);
    }, []);

    useEffect(() => {
    }, [dataList]);    

    const onRefresh = useCallback(() => {
        setSaldo(0.0)
        getList(paginaActual)
    }, []);

    const navDetalle = (tarea: IProducto) => {
        navigation.navigate(MenuPathEnum.TAREA_DETALLE, { tarea: tarea })
    };

    const getList = async (page: number) => {
        setLoading(true);
        getService(`/marca/list/0/5`)
            .then(res => {
                setLoading(false)
                setRefreshing(false);
                setDatalist([]);
                if (res.success) {
                    setPaginaActual(0);
                    setPaginaTotal(res.total || 0);
                    setDatalist(res.data);
                }
            }).catch(error => {
                throw new Error(error);
            })
            .finally(() => {
                setRefreshing(false);
                setLoading(false)
            })
    }

    return (
        <View style={{flex: 1}}>
            <View style={styles.bannerContainer}>
            <Image source={require(backgroundImg)} style={styles.logo} />
                    <Text style={styles.footerText}>{`Bienvenido ${getAuth().username}`}</Text>
            </View>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
            <View style={styles.container}>
                
            <Card key={"head-card"} style={{width:'100%'}}>
                <Card.Content style={{ alignItems: 'center' }}>

                <Text style={styles.footerText}>{`Nuestros proveedores`}</Text>  
                </Card.Content>
            </Card>
            {loading && <ActivityIndicator animating={loading} key={"tarea-indicator"} />}
           
            {dataList && dataList.map((producto: IMarca, index: number) => (
                <View key={"tarea-view" + index} style={styles.topBarContainer}>
                    <Card key={"tarea-card-key-" + index} style={{width:'100%',backgroundColor:`${index%2==0?Color.grayBackground:Color.grisLight}`}} >
                            <Card.Title key={"tarea-card-title-key-" + index}
                                title={producto.nombre}
                                titleStyle={{ fontSize: 16 }}
                                subtitleStyle={{ fontWeight: 'bold' }}
                            />
                        <Card.Content key={"tcard-key-" + index}>
                            <DataTable.Row key={"tcard-row-dir-key-" + index}>
                                <DataTable.Cell key={"tcard-row-cell-dir-key-" + index}>Tipo:</DataTable.Cell>
                                <DataTable.Cell key={"tcard-row-cell-dir-val-" + index}>{producto?.tipo}</DataTable.Cell>
                            </DataTable.Row >
                        </Card.Content>
                    </Card>
                    <Divider key={"tarea-divider-key-" + index} />
                </View>
            ))}
            
            </View>
        </ScrollView>
            </View>
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
        backgroundColor: Color.secondary,
    },
    containerFlex: {
        flexDirection: "row",
        justifyContent: 'center',
        margin: 2,
        width: '95%',
        paddingLeft: '4%'
    },
    container: {
        width: "100%",
        flexDirecion: "row",
        backgroundColor: Color.light,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingBottom: 0,
        flex: 1
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
    footerText: {
        fontSize: 30,
        color: Color.muted,
        fontWeight: "800",
        paddingTop: '10%',        
        // justifyContent: "space-between",
        flexDirection:"row",
        alignItems: "center",
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
    logo: {
        width: width, height: 100,
        // marginTop: 33,
        alignSelf: 'center',
    },
})