import { useEffect, useState } from "react";
import { ScrollView, Text, View, Image, StyleSheet} from "react-native";

interface Pokemon {
  name:string;
  image:string;
  types: PokemonType[];
}

interface PokemonType {
  type:{
    name: string;
    url: string;
  };
}

const colorsByType: Record<string, string> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

export default function Index() {

 const [pokemons, setPokemons] =  useState<Pokemon[]>([]);

  console.log(JSON.stringify(pokemons[0], null, 2));
  useEffect(() => {
    // fetch pokemons 
    fetchPokemons()
  }, [] )

  async function fetchPokemons() {
    try{
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon/?limit=20"
      );

      const data = await response.json();
      // fetch detailed info for each pokemon 
      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();
          return {
            name: pokemon.name,
            image: details.sprites.front_default,
            types: details.types,
          };
        })
      );

      console.log(detailedPokemons);

      setPokemons(detailedPokemons);

    } catch (e) {
      console.log(e);
    }
  }

  return (
   <ScrollView
      contentContainerStyle={{
        gap: 16,
        padding: 16,
      }}
    >
    {pokemons.map((pokemon) => (
    <View key={pokemon.name} 
      style= {{
        // @ts-ignore
        backgroundColor: colorsByType[pokemon.types[0].type.name],
    }}>
      <Text style={styles.name}>{pokemon.name}</Text>
      <Text style={styles.type}>{pokemon.types[0].type.name}</Text>

      <View style= {{
        flexDirection: "row",
      }}
      >
        <Image
          source={{uri: pokemon.image}}
          style={{width: 150, height: 150}}
        />
      </View>
    </View>
    ))}
   </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize:20,
    fontWeight: 'bold',
  },
   type: {
    fontSize:20,
    fontWeight: 'bold',
  }
})
