import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { Avatar, IconButton, Menu, Provider } from "react-native-paper";
import colors from "../constants/colors";
import CustomButton from "../components/customButton";
import { useRouter, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Component to Render Each Form Item
const FormItem = ({ site, type, status, date }) => (
    <View style={styles.formItem}>
        <View style={styles.textContainer}>
            <Text style={styles.siteName}>Site: {site}</Text>
            <Text style={styles.type}>{type}</Text>
            <Text style={styles.date}>{date}</Text>
        </View>
        <Text style={[styles.status, styles[status]]}>{status}</Text>

        {status !== "submitted" && (
            <IconButton icon="pencil-outline" size={25} onPress={() => console.log(`Edit ${site}`)} />
        )}
        
        <IconButton icon="file-pdf-box" size={25} onPress={() => console.log(`Generate PDF for ${site}`)} />
    </View>
);

const ListForms = () => {
    const router = useRouter();
    const [index, setIndex] = useState(0);
    const [forms, setForms] = useState([]);
    const [visible, setVisible] = useState(false);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const [routes] = useState([
        { key: "allForms", title: "All Forms" },
        { key: "notSubmitted", title: "Not Submitted" },
    ]);

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const storedForms = await AsyncStorage.getItem("forms");
                console.log("Fetched stored forms:", storedForms);

                if (storedForms) {
                    setForms(JSON.parse(storedForms));
                } else {
                    setForms([]);
                }
            } catch (error) {
                console.error("Error fetching forms:", error);
                setForms([]); 
            }
        };

        fetchForms();
    }, []);

    const renderScene = ({ route }) => {
        const filteredForms = route.key === "notSubmitted" ? forms.filter(f => f.status === "draft") : forms;

        return (
            <FlatList
                data={filteredForms}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <FormItem site={item.site} type={item.type} status={item.status} date={item.date} />
                )}
                ListEmptyComponent={<Text style={styles.emptyMessage}>No forms available</Text>}
            />
        );
    };

    return (
        <Provider>
            <View style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.headerContainer}>
                    <Menu visible={visible} onDismiss={closeMenu} anchor={<IconButton icon="tune" iconColor={colors.lightGrey} size={37} onPress={openMenu} />}>
                        <Menu.Item onPress={() => console.log("Sort by descending date")} title="Most recent date" />
                        <Menu.Item onPress={() => console.log("Sort by ascending date")} title="Oldest" />
                    </Menu>
                    <View style={styles.logoContainer}>
                        <Avatar.Image size={60} source={require("../assets/images/logo-SI.png")} />
                    </View>
                    <IconButton icon="cog" iconColor={colors.lightGrey} size={37} onPress={() => router.push("/settings")} />
                </View>

                <TabView navigationState={{ index, routes }} renderScene={renderScene} onIndexChange={setIndex} renderTabBar={(props) => (
                    <TabBar {...props} indicatorStyle={{ backgroundColor: colors.darkGreen }} style={styles.tabBar} activeColor={colors.darkGreen} inactiveColor={colors.lightGrey} />
                )} />

                <View style={styles.ButtonContainer}>
                    <CustomButton
                        title="+ New Site"
                        onPress={() => router.push("/scanQrLink")}
                        color={colors.darkGreen}
                        textColor={colors.white}
                        labelStyle={{ fontSize: 18 }}
                    />
                </View>
            </View>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    ButtonContainer: {
        position: "absolute",
        bottom: 50,
        right: 20,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        margin: 10,
        position: "relative",
        backgroundColor: colors.white,
    },
    emptyTab: {
        flex: 1,
        backgroundColor: colors.white,
    },
    tabBar: {
        backgroundColor: colors.iconLightGreen,
        elevation: 0,
        shadowOpacity: 0,
        marginBottom: 15,
    },
    logoContainer: {
        flex: 1,
        alignItems: "center",
    },
    formItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 12,
        marginHorizontal: 14,
        marginVertical: 7,
        borderRadius: 8,
        backgroundColor: colors.veryLightGrey,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    textContainer: {
        flex: 1,
    },
    siteName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    date: {
        marginTop: 5,
        fontSize: 14,
        color: colors.lightGrey,
        fontStyle: "italic",
    },
    status: {
        fontSize: 14,
        textTransform: "capitalize",
    },
    type: {
        fontSize: 14,
        color: colors.lightGrey,
    },
    emptyMessage: {
        textAlign: "center",
        marginTop: 20,
        color: colors.lightGrey,
    },
    sending: { color: colors.darkRed },
    draft: { color: colors.blueDraft },
    submitted: { color: colors.darkGreen },
});

export default ListForms;
