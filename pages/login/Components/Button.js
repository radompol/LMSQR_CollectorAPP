import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import React from "react";

const Button = ({ styleTO, styleText, label, ...props }) => {
  return (
    <TouchableOpacity style={styleTO} {...props}>
      <Text style={styleText}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({});
