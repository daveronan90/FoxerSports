import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import {
  NativeBaseProvider,
  Text,
  VStack,
  HStack,
  Heading,
  SectionList,
  Center,
  View,
} from "native-base";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createMaterialBottomTabNavigator();

function Home() {
  const [matchDetails, setMatchDetails] = useState({});

  const getCurrentWeekMatch = async () => {
    const options = {
      method: "GET",
      url: "https://rugby-live-data.p.rapidapi.com/fixtures/1236/2023",
      headers: {
        "X-RapidAPI-Key": "c3caa709c7mshe607cf6eed87517p1822a0jsnc9975e9c6e33",
        "X-RapidAPI-Host": "rugby-live-data.p.rapidapi.com",
      },
    };

    try {
      const res = await axios.request(options);

      getMatchDetails(
        res.data.results.find((match) => {
          return (
            (match.home_id == 6917 || match.away_id == 6917) &&
            moment(match.date).week() === moment().week() - 1
          );
        }).id
      );
    } catch (error) {
      console.error(error);
    }
  };

  const getMatchDetails = async (matchId) => {
    const options = {
      method: "GET",
      url: `https://rugby-live-data.p.rapidapi.com/match/${matchId}`,
      headers: {
        "X-RapidAPI-Key": "c3caa709c7mshe607cf6eed87517p1822a0jsnc9975e9c6e33",
        "X-RapidAPI-Host": "rugby-live-data.p.rapidapi.com",
      },
    };

    try {
      const res = await axios.request(options);
      setMatchDetails(res.data.results.match);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCurrentWeekMatch();
  }, []);

  return (
    <NativeBaseProvider>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Center>{matchDetails.home_team}</Center>
        <Center>{matchDetails.home_score}</Center>
        <Center>{matchDetails.away_team}</Center>
        <Center>{matchDetails.away_score}</Center>
      </View>
    </NativeBaseProvider>
  );
}

function Fixtures() {
  const [fixtureResults, setFixtureResults] = useState([]);

  const getStandings = async () => {
    const options = {
      method: "GET",
      url: "https://rugby-live-data.p.rapidapi.com/fixtures/1236/2023",
      headers: {
        "X-RapidAPI-Key": "c3caa709c7mshe607cf6eed87517p1822a0jsnc9975e9c6e33",
        "X-RapidAPI-Host": "rugby-live-data.p.rapidapi.com",
      },
    };

    try {
      const res = await axios.request(options);
      const transformedArr = await res.data.results
        .reduce((group, fix) => {
          let { game_week, date } = fix;
          let match = group.findIndex((item) => item.title == game_week);
          if (match == -1) {
            return [...group, { title: game_week, data: [fix], date }];
          }
          group[match].data.push(fix);
          return group;
        }, [])
        .filter(
          ({ date }) => moment(moment(date) - moment()).format("X") < 2500000
        )
        .sort((a, b) => b.title - a.title)
        .sort((a, b) => b.date - a.date);
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
          w="100%"
          mb="4"
          sections={fixtureResults}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => (
            <VStack space="5">
              <Center>{moment(item.date).format("dddd, MMM Do")}</Center>
              <Center>{moment(item.date).format("hA")}</Center>

              <Center py="4" px="8">
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
            </VStack>
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

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            size = 24;

            if (route.name === "Home") {
              iconName = focused ? "ios-home" : "ios-home-outline";
            } else if (route.name === "Fixtures") {
              iconName = focused
                ? "ios-american-football"
                : "ios-american-football-outline";
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        barStyle={{ backgroundColor: "rgb(1, 58, 129)" }}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Fixtures" component={Fixtures} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
