import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [items, setItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);

  useEffect(() => {
    loadItems();
  }, []);

  const handleAdd = async () => {
    if (word.trim() && translation.trim()) {
      let updatedItems;
      if (isEditing) {
        updatedItems = items.map(item => 
          item.id === editingItemId ? { ...item, word, translation } : item
        );
        setIsEditing(false);
        setEditingItemId(null);
      } else {
        const newItem = { id: Date.now().toString(), word, translation };
        updatedItems = [...items, newItem];
      }
      setItems(updatedItems);
      setWord('');
      setTranslation('');
      await AsyncStorage.setItem('items', JSON.stringify(updatedItems));
    }
  };

  const loadItems = async () => {
    const storedItems = await AsyncStorage.getItem('items');
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  };

  const handleDelete = async (id) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    await AsyncStorage.setItem('items', JSON.stringify(updatedItems));
  };

  const handleEdit = (id) => {
    const itemToEdit = items.find(item => item.id === id);
    setWord(itemToEdit.word);
    setTranslation(itemToEdit.translation);
    setIsEditing(true);
    setEditingItemId(id);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Söz daxil edin"
        value={word}
        onChangeText={text => setWord(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Tərcümə daxil edin"
        value={translation}
        onChangeText={text => setTranslation(text)}
      />
      <Button title={isEditing ? "Edit" : "Adds"} onPress={handleAdd} />
      <Button title="Siyahını Gör" onPress={loadItems} />
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.item}>{item.word} - {item.translation}</Text>
            <TouchableOpacity onPress={() => handleEdit(item.id)}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#3a4858',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3a4858',
  },
  item: {
    flex: 1,
  },
  editButton: {
    color: 'blue',
    marginRight: 8,
  },
  deleteButton: {
    color: 'red',
  },
});
