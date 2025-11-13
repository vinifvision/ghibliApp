// App.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  Provider as PaperProvider,
  Appbar,
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
} from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Tipos
interface Movie {
  id: string;
  title: string;
  original_title: string;
  image: string;
  description: string;
  director: string;
  release_date: string;
}

type RootStackParamList = {
  Home: undefined;
  Details: { movie: Movie };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Tela principal
function HomeScreen({ navigation }: any) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://ghibliapi.vercel.app/films")
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size={48} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Studio Ghibli Movies" />
      </Appbar.Header>

      <FlatList
        data={movies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Details", { movie: item })}
          >
            <Card style={styles.card}>
              <View style={styles.row}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={{ flex: 1, padding: 8 }}>
                  <Title>{item.title}</Title>
                  <Paragraph>{item.release_date}</Paragraph>
                  <Paragraph numberOfLines={2}>{item.description}</Paragraph>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// Tela de detalhes
function DetailsScreen({ route, navigation }: any) {
  const { movie } = route.params;
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={movie.title} />
      </Appbar.Header>

      <Card style={styles.detailCard}>
        <Image source={{ uri: movie.image }} style={styles.detailImage} />
        <Card.Content>
          <Title>{movie.title}</Title>
          <Paragraph style={{ marginVertical: 8 }}>
            {movie.description}
          </Paragraph>
          <Paragraph>🎬 Diretor: {movie.director}</Paragraph>
          <Paragraph>📅 Lançamento: {movie.release_date}</Paragraph>
        </Card.Content>
      </Card>
    </View>
  );
}

// App principal
export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

// Estilos
const styles = StyleSheet.create({
  card: {
    margin: 10,
    backgroundColor: "#f8f8f8",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 140,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  detailCard: {
    margin: 16,
  },
  detailImage: {
    width: "100%",
    height: 400,
  },
});
