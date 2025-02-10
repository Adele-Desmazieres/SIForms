import { StyleSheet } from 'react-native';
import colors from '@/constants/colors';

const globalStyles = StyleSheet.create({

    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    linkText: {
        fontSize: 14,
        color: colors.black,
        fontWeight: "bold",
        textDecorationLine: "underline",
        marginTop: 5,
        marginBottom: 20,
        textAlign: "center",
    },

    // ---------------- Create/LoginScreens ----------------

    footerText: {
        fontSize: 14,
        color: colors.black,
        marginTop: 20,
        textAlign: "center",

    },

    inputContainerLoginCreate: {
        width: "100%",
        justifyContent: "center",
    },

    errorText: {
        color: colors.darkRed, // Error message 
        fontSize: 16,
        marginTop: 10,
        marginBottom: 20,
        textAlign: "center",
      },

    // ---------------- SettingsScreen ----------------

    // Avatar 
    avatarIcon: {
        backgroundColor: colors.lightGreen,
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 10,
    },

    titleSettings: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        color: colors.darkGrey,
        marginBottom: 20,
    },

    description: {
        fontSize: 14,
        color: colors.lightGrey,
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 40,
    },

    modifyButton: {
        marginTop: 20,
    },
    // Edit and Profile Screen
    infoContainerProfile: {
        backgroundColor: colors.veryLightGrey,
        padding: 30,
        borderRadius: 20,
    },
    containerSettings: {
        flex: 1,
        backgroundColor: colors.white,
        // paddingTop: 50,
        padding: 30,
    },
    fieldTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.darkGrey,
        marginBottom: 5,
    },

});
export default globalStyles;
