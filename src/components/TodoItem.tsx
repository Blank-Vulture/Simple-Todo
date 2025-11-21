import { Check, Trash2 } from 'lucide-react-native';
import React from 'react';
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Todo } from '../utils/storage';

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (todo: Todo) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
    todo,
    onToggle,
    onDelete,
    onEdit
}) => {
    const handlePress = () => {
        onToggle(todo.id);
    };

    const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });

        return (
            <TouchableOpacity onPress={() => onDelete(todo.id)} activeOpacity={0.6}>
                <View style={styles.deleteAction}>
                    <Animated.View style={{ transform: [{ scale }] }}>
                        <Trash2 size={24} color="#fff" />
                    </Animated.View>
                </View>
            </TouchableOpacity>
        );
    };

    const isWeb = Platform.OS === 'web';

    const content = (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.contentContainer}
                onPress={handlePress}
                activeOpacity={0.7}
            >
                <View style={[
                    styles.checkbox,
                    todo.completed && styles.checkboxChecked
                ]}>
                    {todo.completed && <Check size={16} color="#fff" />}
                </View>
                <Text style={[styles.text, todo.completed && styles.textCompleted]}>
                    {todo.text}
                </Text>
            </TouchableOpacity>
            <View style={styles.actions}>
                <TouchableOpacity
                    onPress={() => onEdit(todo)}
                    style={styles.actionButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Text style={styles.editIcon}>✎</Text>
                </TouchableOpacity>
                {isWeb && (
                    <TouchableOpacity
                        onPress={() => onDelete(todo.id)}
                        style={styles.actionButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Trash2 size={20} color="#ff4444" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    if (isWeb) {
        return content;
    }

    return (
        <Swipeable renderRightActions={renderRightActions}>
            {content}
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 1.5,
        borderColor: '#C7C7CC',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    checkboxChecked: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    text: {
        fontSize: 17,
        color: '#1C1C1E',
        flex: 1,
        fontWeight: '400',
        letterSpacing: -0.3,
    },
    textCompleted: {
        textDecorationLine: 'line-through',
        color: '#AEAEB2',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    actionButton: {
        padding: 8,
        marginLeft: 4,
    },
    editIcon: {
        fontSize: 18,
        color: '#8E8E93',
    },
    deleteAction: {
        backgroundColor: '#ff4444',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
        marginBottom: 12,
        marginLeft: -16, // Overlap container margin
    },
});
