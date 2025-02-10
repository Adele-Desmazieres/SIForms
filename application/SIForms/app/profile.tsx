import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Avatar } from "react-native-paper";
import colors from "../constants/colors";
import CustomButton from "../components/customButton";
import { useRouter, Stack } from "expo-router";
import globalStyles from '@/assets/style/globalStylesheet';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        const fetchUserInfo = async () => {
            const userInfoString = await AsyncStorage.getItem('userInfo');
            if (userInfoString) {
                const userInfo = JSON.parse(userInfoString);
                setFirstName(userInfo.first_name || "");
                setLastName(userInfo.last_name || "");
                setEmail(userInfo.email || "");
                setPhone(userInfo.phone || "");
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <View style={globalStyles.containerSettings}>
            <Stack.Screen options={{ title: "Edit Profile" }} />
            
            <Avatar.Icon
                size={87}
                icon="account-details"
                color={colors.white}
                style={globalStyles.avatarIcon}
            />
            <Text style={globalStyles.titleSettings}>Account information</Text>
            <View style={globalStyles.infoContainerProfile}>
                <Text style={globalStyles.fieldTitle}>First Name</Text>
                <Text style={styles.fieldValue}>{firstName}</Text>
                <Text style={globalStyles.fieldTitle}>Last Name</Text>
                <Text style={styles.fieldValue}>{lastName}</Text>
                <Text style={globalStyles.fieldTitle}>Email</Text>
                <Text style={styles.fieldValue}>{email}</Text>
                <Text style={globalStyles.fieldTitle}>Phone Number</Text>
                <Text style={styles.fieldValue}>{phone}</Text>
                <CustomButton
                    title="Modify"
                    onPress={() => router.replace("/editProfile")}
                    color={colors.lightGreen}
                    textColor={colors.white}
                    labelStyle={{ fontSize: 18 }}
                    style={globalStyles.modifyButton}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    fieldValue: {
        fontSize: 16,
        color: colors.darkGrey,
        marginBottom: 30,
    },
});

export default ProfileScreen;