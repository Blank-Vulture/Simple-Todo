import { Plus, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    LayoutAnimation,
    Platform,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    UIManager,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { TodoList } from '../components/TodoList';
import { Todo, loadTodos, saveTodos } from '../utils/storage';

export const HomeScreen: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [text, setText] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: '',
        message: '',
        onConfirm: () => { },
        confirmText: 'Delete',
        isDestructive: true
    });

    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    useEffect(() => {
        loadTodos().then(setTodos);
    }, []);

    useEffect(() => {
        saveTodos(todos);
    }, [todos]);

    const addTodo = () => {
        if (text.trim().length === 0) return;

        if (editingId) {
            setTodos(prev => prev.map(todo =>
                todo.id === editingId ? { ...todo, text: text.trim() } : todo
            ));
            setEditingId(null);
        } else {
            const newTodo: Todo = {
                id: Date.now().toString(),
                text: text.trim(),
                completed: false,
                createdAt: Date.now(),
            };
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setTodos(prev => [newTodo, ...prev]);
        }
        setText('');
    };

    const toggleTodo = (id: string) => {
        setTodos(prev => prev.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setTodos(prev => prev.filter(todo => todo.id !== id));
    };

    const startEditing = (todo: Todo) => {
        setText(todo.text);
        setEditingId(todo.id);
    };

    const hasCompletedTodos = todos.some(todo => todo.completed);

    const handleGlobalBulkDelete = () => {
        if (hasCompletedTodos) {
            setModalConfig({
                title: "Delete Completed",
                message: "Are you sure you want to delete all completed tasks?",
                confirmText: "Delete",
                isDestructive: true,
                onConfirm: () => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setTodos(prev => prev.filter(todo => !todo.completed));
                    setModalVisible(false);
                }
            });
        } else {
            setModalConfig({
                title: "Delete All",
                message: "Are you sure you want to delete ALL tasks?",
                confirmText: "Delete All",
                isDestructive: true,
                onConfirm: () => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setTodos([]);
                    setModalVisible(false);
                }
            });
        }
        setModalVisible(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
            >
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Simple Todo</Text>
                        <TouchableOpacity onPress={handleGlobalBulkDelete} style={styles.headerButton}>
                            <Trash2 size={22} color={hasCompletedTodos ? "#007AFF" : "#8E8E93"} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.listContainer}>
                        <TodoList
                            todos={todos}
                            onToggle={toggleTodo}
                            onDelete={deleteTodo}
                            onEdit={startEditing}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder={editingId ? "Edit task..." : "New Task"}
                                placeholderTextColor="#8E8E93"
                                value={text}
                                onChangeText={setText}
                                onSubmitEditing={addTodo}
                                returnKeyType="done"
                            />
                            <TouchableOpacity
                                style={[styles.addButton, !text.trim() && styles.addButtonDisabled]}
                                onPress={addTodo}
                                disabled={!text.trim()}
                                activeOpacity={0.8}
                            >
                                <Plus size={24} color="#fff" strokeWidth={2.5} />
                            </TouchableOpacity>
                        </View>
                        {Platform.OS !== 'web' && (
                            <Text style={styles.hintText}>タスクをスワイプすると個別に削除できるボタンが表示されます</Text>
                        )}
                    </View>
                </View>
            </KeyboardAvoidingView>

            <ConfirmationModal
                visible={modalVisible}
                title={modalConfig.title}
                message={modalConfig.message}
                onConfirm={modalConfig.onConfirm}
                onCancel={() => setModalVisible(false)}
                confirmText={modalConfig.confirmText}
                isDestructive={modalConfig.isDestructive}
            />
        </SafeAreaView >
    );
};

import { Text } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        marginTop: 20,
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 34,
        fontWeight: '700',
        color: '#000',
        letterSpacing: 0.37,
    },
    headerButton: {
        padding: 8,
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    listContainer: {
        flex: 1,
    },
    inputWrapper: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 10,
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 24,
        paddingHorizontal: 6,
        paddingVertical: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 8,
        ...(Platform.OS === 'web' && {
            maxWidth: 600,
            width: '100%',
        }),
    },
    input: {
        flex: 1,
        fontSize: 17,
        marginLeft: 14,
        marginRight: 10,
        paddingVertical: 10,
        color: '#000',
    },
    addButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    addButtonDisabled: {
        backgroundColor: '#E5E5EA',
        shadowOpacity: 0,
    },
    hintText: {
        marginTop: 8,
        fontSize: 12,
        color: '#8E8E93',
        textAlign: 'center',
    },
});
