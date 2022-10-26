import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  NativeBaseProvider,
  Text,
  Box,
  VStack,
  HStack,
  FlatList,
  Heading,
  SectionList,
  Center,
} from "native-base";

export default function App() {
  const [fixtureResults, setFixtureResults] = useState([]);

  const getStandings = async () => {
    const options = {
      method: "GET",
      url: "https://rugby-live-data.p.rapidapi.com/fixtures/1236/2022",
      headers: {
        "X-RapidAPI-Key": "c3caa709c7mshe607cf6eed87517p1822a0jsnc9975e9c6e33",
        "X-RapidAPI-Host": "rugby-live-data.p.rapidapi.com",
      },
    };

    try {
      const res = await axios.request(options);
      const transformedArr = await res.data.results.reduce((group, fix) => {
        let { game_week } = fix;
        let match = group.findIndex((item) => item.title == game_week);
        if (match == -1) {
          return [...group, { title: game_week, data: [fix] }];
        }
        group[match].data.push(fix);
        return group;
      }, []);
      setFixtureResults(transformedArr);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getStandings();
  }, []);

  return (
    <NativeBaseProvider>
      <Center safeAreaTop w="100%">
        <SectionList
          maxW="300"
          w="100%"
          mb="4"
          sections={fixtureResults}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => (
            <Center py="4">
              <HStack justifyContent="space-between" width="100%">
                <Text
                  color={item.home_score > item.away_score ? "green.500" : ""}
                  bold={item.home_score > item.away_score ? true : false}
                  fontSize={item.home_score > item.away_score ? "lg" : null}
                >
                  {item.home}
                </Text>
                <Text
                  color={item.home_score > item.away_score ? "green.500" : ""}
                  bold={item.home_score > item.away_score ? true : false}
                  fontSize={item.home_score > item.away_score ? "lg" : null}
                >
                  {item.home_score}
                </Text>
              </HStack>
              <HStack justifyContent="space-between" width="100%">
                <Text
                  color={item.home_score < item.away_score ? "green.500" : ""}
                  bold={item.home_score < item.away_score ? true : false}
                  fontSize={item.home_score < item.away_score ? "lg" : null}
                >
                  {item.away}
                </Text>
                <Text
                  color={item.home_score < item.away_score ? "green.500" : ""}
                  bold={item.home_score < item.away_score ? true : false}
                  fontSize={item.home_score < item.away_score ? "lg" : null}
                >
                  {item.away_score}
                </Text>
              </HStack>
            </Center>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Center>
              <Heading fontSize="xl" mt="8" pb="4">
                Week {title}
              </Heading>
            </Center>
          )}
        />
      </Center>
    </NativeBaseProvider>
  );
}
