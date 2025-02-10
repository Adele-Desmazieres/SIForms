import React, { createContext, useState, useContext } from 'react';
import { Snackbar } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import colors from '@/constants/colors';

const SnackbarContext = createContext<{ showSnackbar: (message: string, color: string) => void } | undefined>(undefined);

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error("useSnackbar must be used within a SnackbarProvider");
    }
    return context;
};

export const SnackbarProvider = ({ children }: { children: React.ReactNode }) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [snackbarColor, setSnackbarColor] = useState('#333');

    const showSnackbar = (msg: string, color: string) => {
        setMessage(msg);
        setSnackbarColor(color);
        setVisible(true);
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            <View style={{ flex: 1 }}>
                {children}
                <Snackbar
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    duration={3000}
                    style={[styles.snackbar, { backgroundColor: snackbarColor }]}
                    action={{
                        label: 'OK',
                        onPress: () => setVisible(false),
                        textColor: colors.white,
                    }}
                >
                    {message}
                </Snackbar>
            </View>
        </SnackbarContext.Provider>
    );
};
const styles = StyleSheet.create({
    snackbar: {
        borderRadius: 5, 
        marginBottom: 20, 
        paddingHorizontal: 10, 
    },
});
