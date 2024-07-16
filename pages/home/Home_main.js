import { ActivityIndicator, DataTable, Modal } from "react-native-paper";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

import { BarCodeScanner } from "expo-barcode-scanner";
import { FIRESTORE_DB } from "../../util/Firebase_config";

export default function Home_main(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedID, setScannedID] = useState("");
  const [isAddCollection, setIsAddCollection] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [loading, setLoading] = useState(false);
  const [scannedDetails, setScannedDetails] = useState({
    selectedCustomer: {
      lname: "",
      mname: "",
      fname: "",
    },
  });
  const [collectionData, setCollectionData] = useState({
    collectorID: "",
    amountCollected: 0,
    loanID: "",
    borrowerID: "",
    loanDetails: {},
    dateTimeAdded: new Date().toString(),
    collectionStatus: "pending",
  });
  const [user, setUser] = useState(null);
  const [dataset, setDataSet] = useState(false);
  useEffect(() => {
    let userAction = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setUser(user);
      } else {
        props.navigation.navigate("Login");
      }
    });

    return userAction;
  }, [user]);
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);
  useEffect(() => {
    if (scanned) {
      //  alert(`QR Data ${scannedID} has been scanned!`);
      getDataScanned(scannedID);
      setDataSet(true);
    }
    // checkIfEnabled();
  }, [scanned]);
  function getCurrentTotal() {
    return (
      Number.parseFloat(scannedDetails.amountNumeric).toFixed(2) -
      getTotalCollected(collections)
    );
  }
  function addCollectionPayment() {
    addDoc(collection(FIRESTORE_DB, "CollectionsList"), {
      ...collectionData,
      collectorData: collectorData,
    });
    if (getCurrentTotal() - collectionData.amountCollected <= 0) {
      let updateRef = doc(FIRESTORE_DB, "LoansList", scannedID);
      updateDoc(updateRef, {
        loanStatus: "paid",
      });
    }
    setIsAddCollection(false);
    getCollections(scannedID);
    alert("Sent Collection Successfully!");
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScannedID(data);
  };
  const [collectorData, setCollectorData] = useState({});
  const [collections, setCollections] = useState([]);

  async function getCollections(id) {
    const docRefCollectorDetails = query(
      collection(FIRESTORE_DB, "/CollectionsList/"),
      where("loanID", "==", id)
    );
    const docSnapCollectorDetails = await getDocs(docRefCollectorDetails);
    let arrayTemp = [];
    docSnapCollectorDetails.forEach((res) => {
      arrayTemp.push({ ...res.data(), id: res.id });
    });
    setCollections(arrayTemp);
    //console.log("CollectionsList", arrayTemp);
  }
  function getTotalCollected(list) {
    let total = 0;
    list.forEach((element) => {
      total =
        Number.parseFloat(total) + Number.parseFloat(element.amountCollected);
    });
    // console.log(total);
    return Number.parseFloat(total).toFixed(2);
  }
  async function getDataScanned(id) {
    try {
      getCollections(id);
      const docRef = doc(FIRESTORE_DB, "LoansList", id);
      const docSnap = await getDoc(docRef);

      const docRefCollectorDetails = query(
        collection(FIRESTORE_DB, "/CollectorList/"),
        where("collectorID", "==", getAuth().currentUser.uid)
      );
      let dataFetched = {};
      const docSnapCollectorDetails = await getDocs(docRefCollectorDetails);
      docSnapCollectorDetails.forEach((element) => {
        dataFetched = { ...element.data(), id: element.id };
      });
      setCollectorData(dataFetched);
      if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data().selectedCustomer);
        setScannedDetails({ ...docSnap.data() });

        setDataSet(true);
        setLoading(true);
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    }
  }
  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const tableColSize = 250;
  return (
    <>
      {dataset ? (
        <>
          {!loading ? (
            <View style={{ alignItems: "center", marginTop: 50 }}>
              <Text style={{ alignItems: "center" }}>
                LOADING LOAN DETAILS ...
              </Text>
              <ActivityIndicator size={20} />
            </View>
          ) : (
            <ScrollView>
              <View
                style={{
                  width: "auto",

                  marginTop: 45,
                  marginBottom: 20,
                }}
              >
                <Button
                  title={"Tap to Scan Again"}
                  onPress={() => {
                    setDataSet(false);
                    setScanned(false);
                    setCollectionData({
                      selectedCustomer: {
                        lname: "",
                        mname: "",
                        fname: "",
                      },
                    });
                    setLoading(false);
                  }}
                />
                {scannedDetails.selectedCustomer.lname ? (
                  <View style={{ paddingTop: 20 }}>
                    <Text style={{ paddingLeft: 20 }}>
                      Status:{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {scannedDetails.loanStatus.toUpperCase()}
                      </Text>
                    </Text>
                    <Text style={{ paddingLeft: 20 }}>
                      LID:{" "}
                      <Text style={{ fontWeight: "bold" }}>{scannedID}</Text>
                    </Text>
                    <Text style={{ paddingLeft: 20 }}>
                      Borrower Name:{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {scannedDetails.selectedCustomer.lname +
                          ", " +
                          scannedDetails.selectedCustomer.fname +
                          " " +
                          scannedDetails.selectedCustomer.mname}{" "}
                      </Text>
                    </Text>
                    <Text style={{ paddingLeft: 20 }}>
                      Loan : {scannedDetails.amountNumeric}
                    </Text>
                    <Text style={{ paddingLeft: 20 }}>Loan Balance: </Text>
                    <Text
                      style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        fontSize: 50,
                      }}
                    >
                      {getCurrentTotal()}
                    </Text>
                    {getCurrentTotal() <= 0 ? (
                      <Text
                        style={{
                          textAlign: "center",
                          padding: 10,
                          backgroundColor: "green",
                          color: "white",
                        }}
                      >
                        PAID
                      </Text>
                    ) : (
                      <>
                        <Button
                          style={{ width: 20 }}
                          title={"Add Collection"}
                          onPress={() => {
                            setIsAddCollection(true);
                            setCollectionData((prev) => {
                              return {
                                ...prev,
                                loanDetails: scannedDetails,
                                borrowerID: scannedDetails.selectedCustomerID,
                                collectorID: getAuth().currentUser.uid,
                                loanID: scannedID,
                              };
                            });
                          }}
                        />
                      </>
                    )}

                    <Text
                      style={{
                        paddingLeft: 20,
                        marginTop: 20,
                        fontWeight: "bold",
                      }}
                    >
                      Received Collection List
                    </Text>
                    <ScrollView horizontal>
                      <View>
                        <DataTable>
                          <DataTable.Header>
                            <DataTable.Title style={{ width: tableColSize }}>
                              PID
                            </DataTable.Title>
                            <DataTable.Title style={{ width: tableColSize }}>
                              Collector
                            </DataTable.Title>
                            <DataTable.Title style={{ width: tableColSize }}>
                              Payment Amount
                            </DataTable.Title>
                            <DataTable.Title style={{ width: tableColSize }}>
                              Date Applied
                            </DataTable.Title>
                          </DataTable.Header>

                          {collections.map((res, index) => {
                            return (
                              <DataTable.Row key={index}>
                                <DataTable.Cell style={{ width: tableColSize }}>
                                  {res.id}
                                </DataTable.Cell>
                                <DataTable.Cell style={{ width: tableColSize }}>
                                  {res.collectorData.fname +
                                    " " +
                                    res.collectorData.lname}
                                </DataTable.Cell>
                                <DataTable.Cell style={{ width: tableColSize }}>
                                  {res.amountCollected}
                                </DataTable.Cell>
                                <DataTable.Cell style={{ width: tableColSize }}>
                                  {res.dateTimeAdded}
                                </DataTable.Cell>
                              </DataTable.Row>
                            );
                          })}
                        </DataTable>
                      </View>
                    </ScrollView>
                  </View>
                ) : null}
              </View>
            </ScrollView>
          )}
        </>
      ) : (
        <>
          <View
            style={{
              width: "auto",
              height: 500,
              marginTop: 100,
              marginBottom: 20,
            }}
          >
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
          </View>
          <Text
            style={{
              textAlign: "center",
              padding: 10,
              backgroundColor: "green",
              color: "white",
            }}
          >
            SCAN LOAN QR
          </Text>
          <Button
            color={"red"}
            title={"Logout"}
            onPress={() => {
              Alert.alert("Caution", "Are you sure to logout?", [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                { text: "OK", onPress: () => signOut(getAuth()) },
              ]);
            }}
          />
        </>
      )}
      <Modal
        animationType={"slide"}
        visible={isAddCollection}
        transparent={false}
      >
        <View
          style={{
            backgroundColor: "white",
            width: "100%",
            height: "100%",
          }}
        >
          <Button
            title={"Cancel"}
            onPress={() => {
              setIsAddCollection(false);
            }}
          />
          <Text style={{ marginLeft: 20, marginTop: 20 }}>Current Balance</Text>
          <Text
            style={{
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 50,
              marginLeft: 20,
              marginTop: 20,
            }}
          >
            {getCurrentTotal()}{" "}
          </Text>

          <Text style={{ marginLeft: 20, marginTop: 20 }}>Amount</Text>
          <TextInput
            style={{
              marginLeft: 20,
              marginRight: 20,
              borderWidth: 1,
              padding: 10,
            }}
            onChangeText={(text) => {
              if (Number.parseFloat(text) > getCurrentTotal()) {
                setIsChecked(true);
                alert("Amount is greater than the current balance.");
              } else {
                setCollectionData((prev) => ({
                  ...prev,
                  amountCollected: Number.parseFloat(text),
                }));
                setIsChecked(false);
              }
            }}
            keyboardType="numeric"
            placeholder="Enter Amount"
          ></TextInput>
          <View style={{ marginTop: 20 }}>
            <Button
              disabled={isChecked}
              title={"Add Collection"}
              onPress={() => {
                if (collectionData.amountCollected == 0) {
                  alert("Amount is greater than the current balance.");
                } else {
                  addCollectionPayment();
                }
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}
