import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet, TouchableHighlight, View } from 'react-native';
import { SafeAreaView, ScrollView } from 'react-native';
import { DataTable, Text, Searchbar, Avatar, Card, IconButton, Title, Paragraph, Menu, Button, Divider } from 'react-native-paper';
import Color from '../../utils/styles/Color';
import { getAuth } from '../../store/login';
import { getService, postService } from '../../utils/HttpService';
import { IMovimiento, TipoTareaEnum } from '../../utils/interfaces/IMovimiento';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MenuPathEnum } from '../../utils/enums/Login.enum';
import { formatDateTime, getFecha, getFormatFecha, getStrFecha } from '../../utils/GeneralUtils';
import { EstadoTareaEnum, EstadoTareaKeyEnum } from '../../utils/enums/IGeneral';

interface ITareaListProps {
    tipo: string,
    title:string,
}
type Props = NativeStackScreenProps<any, MenuPathEnum.MOVIMIENTO_LIST>;
export default function List({ route, navigation }: Props) {
// export const MovimientoList: React.FC<ITareaListProps> = ({ tipo,title }: ITareaListProps) => {
    const [paginaActual, setPaginaActual] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [dataList, setDatalist] = useState([]);
    const [paginaTotal, setPaginaTotal] = useState(0);
    const [saldo, setSaldo] = useState<number>(0.0);
    
    useEffect(() => {
        setSaldo(100.00)
        getList(paginaActual);
    }, []);

    useEffect(() => {
    }, [dataList]);    

    const onRefresh = useCallback(() => {
        getList(paginaActual)
    }, []);

    const navDetalle = (tarea: IMovimiento) => {
        navigation.navigate(MenuPathEnum.TAREA_DETALLE, { tarea: tarea })
    };

    const getList = async (page: number) => {
        setLoading(true);
        getService(`/movimiento/list/0/5`)
            .then(res => {
                setLoading(false)
                setRefreshing(false);
                setDatalist([]);
                if (res.success) {
                    setPaginaActual(0);
                    setPaginaTotal(res.total || 0);
                    setDatalist(res.data);
                    setSaldo(res.suma || 0);
                }
                let monto=0.0;
                dataList.forEach((mov:IMovimiento)=>{
                    // const monto = Number.parseFloat(mov.monto.toString());
                    // console.log("monto:",(monto));
                    monto =monto+Number.parseFloat(mov.monto.toString());
                })
                // setSaldo(Number.parseFloat(saldo.toString())- monto)
                // console.log("saldo",Number.parseFloat(saldo.toString()))
                // console.log("monto",Number.parseFloat(monto.toString()))
                // console.log("resta",Number.parseFloat(saldo.toString())- Number.parseFloat(monto.toString()))
                // setSaldo(Number.parseFloat(saldo.toString())- monto)
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
                    title={"Ultimos 5 movmientos"}
                    titleStyle={{ textAlign: 'center' }}
                    
                    // right={(props) => <IconButton size={30} icon="refresh" color={Color.white} key={"head-card-title-icon"}
                    //     style={{ backgroundColor: Color.secondary }} onPress={onRefresh} />}
                />
            </Card>
            {loading && <ActivityIndicator animating={loading} key={"tarea-indicator"} />}
            <View key={"tarea-view-saldo"}>
                <Card key={"tarea-card-key-saldo"}>
                        <Card.Title key={"tarea-card-title-key-saldo" }
                            title={`Saldo Bs: ${saldo}`}
                            
                        />
                   
                </Card>
            </View>
            {dataList && dataList.map((movimiento: IMovimiento, index: number) => (
                <View key={"tarea-view" + index}>
                    <Card key={"tarea-card-key-" + index}>
                        <TouchableHighlight onPress={() => { navDetalle(movimiento) }} underlayColor="white" key={"tarea-card-touch-" + index}>
                            <Card.Title key={"tarea-card-title-key-" + index}
                                title={movimiento.producto.nombre}
                                titleStyle={{ fontSize: 16 }}
                                subtitleStyle={{ fontWeight: 'bold' }}
                                right={(props) => <IconButton size={30} icon="clipboard-arrow-right" 
                                    key={"tarea-card-title-icon-key-" + index}  />}
                                // right={(props) => <IconButton {...props} icon="clipboard-arrow-right" color={Color.secondary} />}
                            />
                        </TouchableHighlight>
                        <Card.Content key={"tcard-key-" + index}>
                            <DataTable.Row key={"tcard-row-dir-key-" + index}>
                                <DataTable.Cell key={"tcard-row-cell-dir-key-" + index}>Monto:</DataTable.Cell>
                                <DataTable.Cell key={"tcard-row-cell-dir-val-" + index}>{movimiento?.monto}</DataTable.Cell>
                            </DataTable.Row >
                            <DataTable.Row key={"tcard-row-fecha-key-" + index}>
                                <DataTable.Cell key={"tcard-row-fecha-key-" + index}>Fecha</DataTable.Cell>
                                <DataTable.Cell key={"tcard-row-fecha-val-" + index}>{getStrFecha({date:new Date(movimiento.fecha)}) }</DataTable.Cell>
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
        borderRadius: 5,
        margin: 2
    },
    avatarIcon: {
        backgroundColor: Color.secondaryVariant,
    },
})