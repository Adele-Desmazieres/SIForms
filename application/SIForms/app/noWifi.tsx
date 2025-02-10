import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import colors from '@/constants/colors';
import { Avatar, IconButton } from 'react-native-paper';
import globalStyles from '@/assets/style/globalStylesheet';
import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useRouter, Stack } from 'expo-router';


const NoWifi = () => {
    const [isConnected, setIsConnected] = useState(false);
    const router = useRouter();

    const handleRefresh = () => {
        NetInfo.fetch().then(state => {
            const online = state.isConnected && state.isInternetReachable;
            if (online) {
                router.push('/formsList');
            } 
        });
    };

    const handleGoToForms = () => {
        router.push('/formsList');
    };
    return (
        <View style={styles.container}>
            <Avatar.Icon
                size={180}
                icon="wifi-off"
                color={colors.white}
                style={globalStyles.avatarIcon}
            />

            <Text style={styles.title}>No internet!</Text>
            <Text style={styles.description}>
                You're offline{'\n'} Please check your internet connection and try again.
            </Text>
            <TouchableOpacity onPress={handleGoToForms}>
                <Text style={styles.linkToForm}>
                    Go to My Forms
                </Text>
            </TouchableOpacity>
            <IconButton
                icon="refresh"
                iconColor={colors.white}
                size={40}
                style={{ backgroundColor: colors.darkGreen, marginTop: 20 }}
                onPress={handleRefresh}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colors.white,
        alignItems: 'center',
        padding: 50
    },

    title: {
        fontSize: 38,
        fontWeight: 'bold',
        textAlign: 'center',
        color: colors.darkGreen,
        marginBottom: 20,
    },
    description: {
        fontSize: 20,
        color: colors.darkGreen,
        textAlign: 'center',
        marginBottom: 40,
    },
    linkToForm: {
        fontSize: 20,
        color: colors.darkGreen,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        marginBottom: 20,
    },
});

export default NoWifi;