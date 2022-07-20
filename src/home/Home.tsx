import {
  View,
  Text,
  FlatList,
  Linking,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  const [results, setResults] = useState<{}[]>([]);
  const [currentData, setCurrentData] = useState<FetchedData>();
  let page = useRef<number>(1);

  useEffect(() => {
    handleRequest();
    setInterval(() => {
      page.current = page.current + 1;
      handleRequest();
    }, 10000);
  }, []);

  const handleRequest = async () => {
    try {
      const request = await axios.get(
        `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${page.current}`
      );
      setResults((pre) => {
        return [...pre, request.data.hits];
      });
    } catch (err) {
      console.log(err);
    }
  };

  const showMainList = ({ item }: any) => {
    return (
      <View style={styles.listItem}>
        <FlatList
          onEndReached={() => {}}
          data={item}
          renderItem={showSingleList}
        />
      </View>
    );
  };

  const showSingleList = ({ item }: any) => {
    return (
      <TouchableOpacity
        style={styles.listContent}
        onPress={() => setCurrentData(item)}
      >
        <Text style={styles.title}>Title : {item.title}</Text>
        <Text style={styles.author}>Author : {item.author}</Text>
        <Text style={styles.text}>CreatedAt : {item.created_at}</Text>
        <Text
          style={{ color: "blue" }}
          onPress={() => Linking.openURL("item.url")}
        >
          {item.url}
        </Text>
      </TouchableOpacity>
    );
  };

  return currentData === undefined ? (
    <View>
      <FlatList data={results} renderItem={showMainList} />
      <View style={styles.page}>
        <Text style={styles.pagination}>{page.current}</Text>
      </View>
    </View>
  ) : (
    <View style={styles.rawData}>
      <Text style={styles.closeBtn} onPress={() => setCurrentData(undefined)}>
        x
      </Text>
      <Text style={styles.rawText}>{JSON.stringify(currentData)}</Text>
    </View>
  );
};
export default Home;

type FetchedData = {
  title: string;
  url: string;
  created_at: string;
  author: string;
  objectID: string;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
  },
  seperator: {
    marginVertical: 10,
  },
  error: {
    color: "red",
    fontSize: 20,
  },
  listItem: {
    backgroundColor: "#fefae0",
    padding: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 25,
    color: "#283618",
    fontWeight: "600",
  },
  author: {
    fontSize: 22,
    fontWeight: "500",
    color: "#606c38",
  },
  text: {
    fontSize: 18,
    color: "black",
  },
  page: {
    backgroundColor: "white",
    textAlign: "center",
    padding: 5,
    borderRadius: 10,
  },
  pagination: {
    color: "black",
    fontSize: 18,
    fontWeight: "500",
  },
  closeBtn: {
    fontSize: 40,
    textAlign: "right",
    margin: 10,
  },
  listContent: {
    borderWidth: 1,
    margin: "2%",
    padding: 8,
    borderRadius: 10,
  },
  rawData: {
    flex: 1,
    backgroundColor: "#fefae0",
  },
  rawText: {
    fontSize: 20,
  },
});
