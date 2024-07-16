import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import Button from "./Button";
import { TextInput } from "react-native-gesture-handler";

const TextField = ({
  styleV,
  styleTI,
  styleLabel,
  label,
  seePass,
  what,
  openSecurity,
  setOpenSecurity,
  iconset,
  ...props
}) => {
  if (what == "pass") {
    return (
      <View style={styleV}>
        <Text style={styleLabel}>{label}</Text>
        <View style={styleTI}>
          <TextInput
            style={{ width: 220 }}
            secureTextEntry={openSecurity}
            {...props}
          />
          <Button
            styleTO={{
              width: 60,
              borderLeftWidth: 2,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              let status = !openSecurity;
              setOpenSecurity(status);
            }}
            styleText={{}}
            label={iconset}
          />
        </View>
      </View>
    );
  } else {
    return (
      <View style={styleV}>
        <Text style={styleLabel}>{label}</Text>
        <TextInput style={styleTI} {...props} />
      </View>
    );
  }
};

export default TextField;

const styles = StyleSheet.create({});
