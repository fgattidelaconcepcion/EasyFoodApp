import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import axios from 'axios';

export default function App() {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateRecipe = async () => {
    setIsLoading(true);
    setRecipe('Generando receta...');

    try {
      const response = await axios.post('http://192.168.1.48:3000/api/receta', { ingredientes: ingredients });
      setRecipe(response.data.receta);
    } catch (error) {
      console.error('Error al generar la receta:', error);
      setRecipe('Hubo un error al generar la receta.');
      if (error.response) {
        Alert.alert('Error', error.response.data.error || 'Error del servidor');
      } else if (error.request) {
        Alert.alert('Error', 'No se pudo conectar con el servidor.');
      } else {
        Alert.alert('Error', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>EasyFoodApp</Text>

        <TextInput
          style={styles.input}
          placeholder="Introduce tus ingredientes (ej: pollo, arroz, brócoli)"
          placeholderTextColor="#999"
          value={ingredients}
          onChangeText={setIngredients}
          multiline
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleGenerateRecipe}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Generando...' : 'Generar Receta'}
          </Text>
        </TouchableOpacity>

        <ScrollView style={styles.recipeContainer}>
          <Text style={styles.recipeText}>
            {recipe || 'Tu receta aparecerá aquí.'}
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    minHeight: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#a0c7ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  recipeContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    minHeight: 200,
    maxHeight: '50%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  recipeText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
});