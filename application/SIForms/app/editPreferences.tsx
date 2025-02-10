import { useState, useEffect } from "react";
import { View, StyleSheet, Text, ScrollView, Keyboard, TouchableWithoutFeedback, TouchableOpacity, Platform } from "react-native";
import { Avatar, RadioButton } from "react-native-paper";
import CustomButton from "../components/customButton";
import colors from "../constants/colors";
import globalStyles from '@/assets/style/globalStylesheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSnackbar } from '../context/SnackbarProvider';
import { Stack } from 'expo-router';


const EditPreferences = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const { showSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState(true); 

    const languages = [
        { id: '1', name: 'Français', code: 'fr' },
        { id: '2', name: 'English', code: 'en' },
        { id: '3', name: 'Español', code: 'es' },
        { id: '4', name: 'Italiano', code: 'it' },
        { id: '5', name: 'Deutsch', code: 'de' },

    ];
 
    useEffect(() => {
        const fetchUserInfo = async () => {
            setIsLoading(true); 
    
            try {
                const userInfoString = await AsyncStorage.getItem('userInfo');
                console.log('Stored userInfo:', userInfoString);
    
                if (userInfoString) {
                    const userInfo = JSON.parse(userInfoString);
                    console.log('Retrieved language:', userInfo.lang);
    
                    if (userInfo.lang) {
                        setSelectedLanguage(userInfo.lang);
                    }
                }
            } catch (error) {
                console.error("Error retrieving user info:", error);
            } finally {
                setIsLoading(false); 
            }
        };
    
        fetchUserInfo();
    }, []);
    
    
    const apiBaseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

    const handleSaveChanges = async () => {
        if (!selectedLanguage) {
            showSnackbar('Please select a language', colors.darkRed);
            return;
        }
    
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await fetch(`${apiBaseUrl}/accounts/change-language/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({ lang: selectedLanguage }),
            });
    
            if (!response.ok) {
                console.log(`HTTP error! status: ${response.status}`);
                showSnackbar('Failed to update language', colors.darkRed);
                return;
            }
    
            const userInfoString = await AsyncStorage.getItem('userInfo');
            let userInfo = userInfoString ? JSON.parse(userInfoString) : {};
            userInfo.lang = selectedLanguage; 
    
            await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
    
            console.log("Language updated in AsyncStorage:", userInfo);
    
            showSnackbar('Language updated successfully', colors.darkGreen);
        } catch (error) {
            showSnackbar('An error occurred. Please try again.', colors.darkRed);
        }
    };
    

    return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={globalStyles.containerSettings}>
                    <Stack.Screen options={{ title: "Your preferences" }} />
                    <Avatar.Icon
                        size={87}
                        icon="translate"
                        color={colors.white}
                        style={globalStyles.avatarIcon}
                    />
                    <Text style={globalStyles.titleSettings}>Change form language</Text>
                    <Text style={globalStyles.description}>
                        Choose the language you would like to have the form in.
                    </Text>

                    {/* Language Options */}
                    <View style={globalStyles.infoContainerProfile}>
                        <RadioButton.Group
                            onValueChange={newValue => setSelectedLanguage(newValue)}
                            value={selectedLanguage}
                        >
                            {languages.map((language) => (
                                <View key={language.id} style={styles.languageOption}>
                                    <Text style={[
                                        styles.languageText,
                                        selectedLanguage === language.code && styles.selectedLanguage,
                                    ]}
                                    >{language.name}</Text>
                                    <RadioButton value={language.code} color={colors.lightGreen} />
                                </View>
                            ))}
                        </RadioButton.Group>
                    </View>
                    {/* Save Changes Button */}
                    <CustomButton
                        title="Save changes"
                        onPress={handleSaveChanges}
                        color={colors.lightGreen}
                        textColor={colors.white}
                        labelStyle={{ fontSize: 18 }}
                        style={globalStyles.modifyButton}
                    />

                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        padding: 20,
        justifyContent: 'center',
    },

    languageOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 2,
        borderBottomColor: colors.white,
    },
    languageText: {
        fontSize: 18,
        color: colors.darkGrey,
    },
    selectedLanguage: {
        color: colors.darkGreen,
        fontWeight: 'bold',
    },

});

export default EditPreferences;