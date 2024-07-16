import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { FIREBASE_APP, FIREBASE_AUTH } from "../../util/Firebase_config";
import React, { useState } from "react";

import Button from "./Components/Button";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import TextField from "./Components/TextField";
import { signInWithEmailAndPassword } from "firebase/auth";
import style from "./Style";

const Login_Home = (props) => {
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
    errorMessage: "",
  });
  const [openSecurity, setOpenSecurity] = useState(true);
  const [loading, setLoading] = useState(false);

  const SignIn = async () => {
    await signInWithEmailAndPassword(
      FIREBASE_AUTH,
      userDetails.email,
      userDetails.password
    )
      .then((user) => {
        //  console.log(user);
        //ADMIN
        if (user) {
          props.navigation.navigate("Home");
        } else {
          // alert("Email and password does not match.");
        }
      })
      .catch((err) => {
        setUserDetails((prev) => ({
          ...prev,
          errorMessage: "Email and password does not match.",
        }));
      });
  };
  return (
    <View style={style.screenGeneralLayout}>
      <>
        <Image
          style={style.logo_label}
          source={require("../../assets/Logo_main.jpg")}
        />
        {/* <Text style={style.logo_label}>Distribtr logo</Text> */}
        {userDetails.errorMessage != "" ? (
          <Text style={style.errorMessage}>{userDetails.errorMessage}</Text>
        ) : null}
        <TextField
          placeholder={"Enter Email"}
          label={"Email"}
          styleLabel={style.txtFieldLabel}
          styleTI={style.txtFieldTI}
          styleV={style.txtFieldV}
          onChangeText={(text) => {
            setUserDetails((prev) => ({ ...prev, email: text }));
          }}
          value={userDetails.email}
          what={"user"}
        />
        <TextField
          placeholder={"Enter Password"}
          label={"Password"}
          styleLabel={style.txtFieldLabel}
          styleTI={style.txtFieldTI1}
          styleV={style.txtFieldV}
          openSecurity={openSecurity}
          setOpenSecurity={setOpenSecurity}
          value={userDetails.password}
          onChangeText={(text) => {
            setUserDetails((prev) => ({ ...prev, password: text }));
          }}
          // iconset={setIcon(openSecurity)}
          what={"pass"}
        />
        <Button
          onPress={() => {
            //setLoading(true);
            SignIn();
          }}
          label={"SIGN IN"}
          styleText={{ color: "white" }}
          styleTO={style.btn}
        />
      </>
    </View>
  );
};

export default Login_Home;
