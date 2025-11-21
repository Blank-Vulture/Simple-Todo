import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ConfirmationModalProps {
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    visible,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDestructive = false
}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onCancel}
        >
            <View style={styles.centeredView}>
                <View style={styles.backdrop} />
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <Text style={styles.modalMessage}>{message}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onCancel}
                        >
                            <Text style={styles.cancelButtonText}>{cancelText}</Text>
                        </TouchableOpacity>
                        <View style={styles.separator} />
                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton]}
                            onPress={onConfirm}
                        >
                            <Text style={[
                                styles.confirmButtonText,
                                isDestructive && styles.destructiveText
                            ]}>
                                {confirmText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalView: {
        width: 270,
        backgroundColor: 'rgba(245, 245, 245, 0.95)',
        borderRadius: 14,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        backdropFilter: 'blur(20px)', // For web support if needed
    },
    modalTitle: {
        marginTop: 20,
        marginBottom: 8,
        fontSize: 17,
        fontWeight: '600',
        textAlign: 'center',
        color: '#000',
    },
    modalMessage: {
        marginBottom: 20,
        fontSize: 13,
        textAlign: 'center',
        color: '#000',
        paddingHorizontal: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        borderTopWidth: 0.5,
        borderTopColor: '#3F3F3F',
        width: '100%',
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        borderBottomLeftRadius: 14,
    },
    confirmButton: {
        borderBottomRightRadius: 14,
    },
    separator: {
        width: 0.5,
        backgroundColor: '#3F3F3F',
        height: '100%',
    },
    cancelButtonText: {
        fontSize: 17,
        color: '#007AFF',
        fontWeight: '400',
    },
    confirmButtonText: {
        fontSize: 17,
        color: '#007AFF',
        fontWeight: '600',
    },
    destructiveText: {
        color: '#FF3B30',
    },
});
