import {
  View,
  Text,
  FlatList,
  TouchableHighlight,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const Home = () => {
  const [results, setResults] = useState<any>([]);
  const [error, setError] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<FetchedData>();
  const page = useRef<number>(0);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    setInterval(() => {
      fetchPosts();
    }, 10 * 1000);
  }, [page]);

  const updatePage = () => {
    page.current = page.current + 1;
  };

  const fetchPosts = async () => {
    updatePage();
    await axios
      .get(
        `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${page.current}`
      )
      .then((res) => {
        if (!results.length) {
          setResults(res.data.hits);
        } else {
          setResults((prevRes: FetchedData[]) => {
            [...prevRes, res.data.hits];
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showRawData = (item: FetchedData) => {
    setCurrentData(item);
  };

  const renderSearch = ({ item }: { item: FetchedData; index: number }) => {
    return (
      <Pressable onPress={() => showRawData(item)} key={item.objectID}>
        <View style={styles.listItem}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.author}>{item.author}</Text>
          <Text style={styles.text}>{item.created_at}</Text>
          <Text style={styles.text}>{item.url}</Text>
        </View>
      </Pressable>
    );
  };

  return currentData === undefined ? (
    <View style={styles.container}>
      <FlatList
        data={results}
        keyExtractor={(item) => item.objectID}
        renderItem={renderSearch}
        ItemSeparatorComponent={() => <View style={styles.seperator} />}
        ListEmptyComponent={() => {
          return (
            <>
              {error ? (
                <Text style={styles.error}>Something went Wrong !!</Text>
              ) : (
                <ActivityIndicator />
              )}
            </>
          );
        }}
      />
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
  rawData: {
    flex: 1,
    backgroundColor: "#fefae0",
  },
  rawText: {
    fontSize: 20,
  },
});
