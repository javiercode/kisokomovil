import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView, ScrollView } from 'react-native';
import { DataTable, Text, Searchbar, Avatar, Card, IconButton, Title, Paragraph, Divider } from 'react-native-paper';
import Color from '../../utils/styles/Color';
import { getAuth } from '../../store/login';
import { getService } from '../../utils/HttpService';
import { IProducto } from '../../utils/interfaces/IProducto';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MenuPathEnum } from '../../utils/enums/Login.enum';

type Props = NativeStackScreenProps<any, MenuPathEnum.PRODUCTO>;
export default function Cliente({ route, navigation }: Props) {
    const [paginaActual, setPaginaActual] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [dataList, setDatalist] = useState([]);
    const [paginaTotal, setPaginaTotal] = useState(0);
    const [saldo, setSaldo] = useState<number>(100.0);
    
    useEffect(() => {
        setSaldo(100.00)
        getList(paginaActual);
    }, []);

    useEffect(() => {
    }, [dataList]);    

    const onRefresh = useCallback(() => {
        setSaldo(100.0)
        getList(paginaActual)
    }, []);

    const navDetalle = (tarea: IProducto) => {
        navigation.navigate(MenuPathEnum.TAREA_DETALLE, { tarea: tarea })
    };

    const getList = async (page: number) => {
        setLoading(true);
        getService(`/producto/list/0/5`)
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
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
            <Card key={"head-card"}>
                <Card.Title key={"head-card-title"}
                    title={"Productos"}
                    subtitle={"La Paz"}
                    titleStyle={{ textAlign: 'center' }}
                />
            </Card>
            {loading && <ActivityIndicator animating={loading} key={"tarea-indicator"} />}
           
            {dataList && dataList.map((producto: IProducto, index: number) => (
                <View key={"tarea-view" + index}>
                    <Card key={"tarea-card-key-" + index}>
                        
                            <Card.Title key={"tarea-card-title-key-" + index}
                                title={producto.nombre}
                                titleStyle={{ fontSize: 16 }}
                                subtitleStyle={{ fontWeight: 'bold' }}
                                // right={(props) => <IconButton size={30} icon="clipboard-arrow-right" 
                                //     key={"tarea-card-title-icon-key-" + index} style={{ backgroundColor: Color.secondary }} />}
                            />
                        <Card.Content key={"tcard-key-" + index}>
                            <DataTable.Row key={"tcard-row-dir-key-" + index}>
                                <DataTable.Cell key={"tcard-row-cell-dir-key-" + index}>Monto:</DataTable.Cell>
                                <DataTable.Cell key={"tcard-row-cell-dir-val-" + index}>{producto?.monto}</DataTable.Cell>
                            </DataTable.Row >
                            <DataTable.Row key={"tcard-row-fecha-key-" + index}>
                                <DataTable.Cell key={"tcard-row-fecha-key-" + index}>Descuento</DataTable.Cell>
                                <DataTable.Cell key={"tcard-row-fecha-val-" + index}>{producto.descuento }</DataTable.Cell>
                            </DataTable.Row>
                        </Card.Content>
                    </Card>
                    <Divider key={"tarea-divider-key-" + index} />
                </View>
            ))}
        </ScrollView>
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
})

const customStyles = ({
    rows: {
        style: {
            minHeight: '72px', // override the row height
        }
    },
    headCells: {
        style: {
            paddingLeft: '8px', // override the cell padding for head cells
            paddingRight: '8px',
            fontWeight: 'bold',
        },
    },
    cells: {
        style: {
            paddingLeft: '8px', // override the cell padding for data cells
            paddingRight: '8px',
        },
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 2
    },
    sectionStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        textShadowColor: 'blue',
        borderWidth: 0.5,
        borderColor: '#000',
        height: 60,
        borderRadius: 5,
        margin: 10,
    },
    icono: {
        width: 50,
        height: 42,
        resizeMode: "stretch",
        margin: 10
    },
});