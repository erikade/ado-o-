import 'react-native-gesture-handler';
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// ----- Dados de exemplo (cachorros) -----
const PETS = [
  { 
    id: '1', 
    name: 'Luna', 
    age: '2 anos', 
    sex: 'Fêmea', 
    story: 'Resgatada das ruas, muito carinhosa.', 
    image: 'https://images.dog.ceo/breeds/labrador/n02099712_4910.jpg' 
  },
  { 
    id: '2', 
    name: 'Bidu', 
    age: '3 anos', 
    sex: 'Macho', 
    story: 'Brincalhão e sociável com outros pets.', 
    image: 'https://images.dog.ceo/breeds/beagle/n02088364_11136.jpg' 
  },
  { 
    id: '3', 
    name: 'Maya', 
    age: '1 ano', 
    sex: 'Fêmea', 
    story: 'Adora colo e mimos.', 
    image: 'https://images.dog.ceo/breeds/husky/n02110185_1469.jpg' 
  },
  { 
    id: '4', 
    name: 'Thor', 
    age: '4 meses', 
    sex: 'Macho', 
    story: 'Cheio de energia e curioso.', 
    image: 'https://images.dog.ceo/breeds/germanshepherd/n02106662_5992.jpg' 
  },
];

// ----- Screens -----
function ListaPetsScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DetalhesPet', { pet: item })}
    >
      <Image source={{ uri: item.image }} style={styles.thumbnail} />
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={PETS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={{ padding: 8 }}
      />
    </SafeAreaView>
  );
}

function DetalhesPetScreen({ route, navigation }) {
  const pet = route.params?.pet;
  if (!pet) return (<View style={styles.center}><Text>Pet não encontrado.</Text></View>);

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: pet.image }} style={styles.largeImage} />
      <View style={{ padding: 16 }}>
        <Text style={styles.title}>{pet.name}</Text>
        <Text style={styles.subtitle}>Idade: {pet.age}</Text>
        <Text style={styles.subtitle}>Sexo: {pet.sex}</Text>
        <Text style={styles.story}>{pet.story}</Text>
        <View style={{ marginTop: 12 }}>
          <Button title="Tenho interesse / Quero adotar" onPress={() => navigation.navigate('Cadastrar')} />
        </View>
      </View>
    </ScrollView>
  );
}

// Componente reutilizável do formulário
function CadastroForm({ onSubmit }) {
  const [name, setName] = React.useState('');
  const [contact, setContact] = React.useState('');

  return (
    <View style={{ padding: 16 }}>
      <Text>Nome do interessado</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Seu nome" />
      <Text>Contato</Text>
      <TextInput style={styles.input} value={contact} onChangeText={setContact} placeholder="Telefone ou e-mail" />
      <Button title="Enviar interesse" onPress={() => onSubmit && onSubmit({ name, contact })} />
    </View>
  );
}

function CadastroScreen({ navigation }) {
  const handleSubmit = (data) => {
    console.log('Interesse enviado:', data);
    alert('Interesse enviado! Obrigado.');
    const parent = navigation.getParent();
    if (parent) parent.navigate('Adoção');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={{ fontSize: 18, fontWeight: 'bold', margin: 16 }}>Formulário de Cadastro / Interesse</Text>
        <CadastroForm onSubmit={handleSubmit} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SobreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Sobre o Abrigo</Text>
        <Text style={{ marginTop: 8 }}>Este abrigo é fictício e serve como exemplo para a atividade de navegação com React Navigation.</Text>
      </View>
    </SafeAreaView>
  );
}

// ----- Navegadores -----
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function PetStackScreen() {
  return (
    <Stack.Navigator initialRouteName="ListaPets">
      <Stack.Screen name="ListaPets" component={ListaPetsScreen} options={{ title: 'Pets para Adoção' }} />
      <Stack.Screen name="DetalhesPet" component={DetalhesPetScreen} options={{ title: 'Detalhes do Pet' }} />
      <Stack.Screen name="Cadastrar" component={CadastroScreen} options={{ title: 'Cadastrar Interesse' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName = 'ios-home';
            if (route.name === 'Adoção') iconName = 'ios-home';
            else if (route.name === 'Cadastrar') iconName = 'ios-add-circle';
            else if (route.name === 'Sobre') iconName = 'ios-information-circle';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Adoção" component={PetStackScreen} options={{ tabBarLabel: 'Adoção' }} />
        <Tab.Screen name="Cadastrar" component={CadastroScreen} options={{ tabBarLabel: 'Cadastrar' }} />
        <Tab.Screen name="Sobre" component={SobreScreen} options={{ tabBarLabel: 'Sobre' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// ----- Estilos -----
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  card: { flex: 1, margin: 8, alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 8, padding: 8 },
  thumbnail: { width: 140, height: 140, borderRadius: 8 },
  name: { marginTop: 8, fontWeight: '600' },
  largeImage: { width: '100%', height: 320 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 16, marginTop: 4 },
  story: { marginTop: 12, fontSize: 14, lineHeight: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginVertical: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
