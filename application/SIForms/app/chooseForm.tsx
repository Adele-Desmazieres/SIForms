import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import colors from '@/constants/colors';
import { Avatar } from 'react-native-paper';
import globalStyles from '@/assets/style/globalStylesheet';
import { useEffect, useState } from 'react';
import { useRouter, Stack } from 'expo-router';

const ChooseForm = () => {
    const [titles, setTitles] = useState<{ id: number; title: string }[]>([]);
    const router = useRouter();

    useEffect(() => {
        const handleGetModelTitle = async () => {
            try {
                const apiBaseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';
                const response = await fetch(`${apiBaseUrl}/model/titles/`);
                
                if (!response.ok) {
                    console.log(`HTTP error! status: ${response.status}`);
                    return;
                }
                const data = await response.json();
                setTitles(data['model_titles'] || []); 
            } catch (error) {
                console.error('Error during get model title:', error);
            }
        };
    
        handleGetModelTitle();
    }, []);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: "New Site" }} />
            <Avatar.Icon
                size={87}
                icon="form-select"
                color={colors.white}
                style={globalStyles.avatarIcon}
            />
            <Text style={styles.title}>Choose your form</Text>

            <ScrollView contentContainerStyle={styles.buttonContainer}>
                {titles.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.button}
                        onPress={() => router.push('/form')}
                    >
            <Text style={styles.buttonText}>{item.title}</Text>
        </TouchableOpacity>
    ))}
</ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        padding: 30,
        alignItems: 'center',
    },

    title: {
        color: colors.lightGreen,
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 20,
    },

    buttonContainer: {
        width: '100%',
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    button: {
        backgroundColor: colors.darkGreen,
        borderRadius: 50,
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingVertical: 15,
        marginVertical: 5,
        width: 350,

    },

    buttonText: {
        color: colors.white,
        fontSize: 18,
        textAlign: 'center',
        fontWeight: '500'
    },
});

export default ChooseForm;
