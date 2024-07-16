import { StyleSheet } from "react-native";

export default StyleSheet.create({
  screenGeneralLayout: {
    paddingTop: Platform.OS == "android" ? 20 : 0,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
  login_label: {
    fontWeight: "bold",
    fontSize: 30,
  },
  logo_label: {
    borderWidth: 1,
    width: 150,
    height: 150,
  },
  logo_label1: {
    width: 150,
    height: 150,
  },
  txtFieldLabel: {
    fontSize: 15,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  txtFieldTI: {
    width: 300,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    backgroundColor: "white", //"rgba(249, 255, 168, 0.719)"
  },
  txtFieldTI1: {
    width: 300,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    backgroundColor: "white", //"rgba(249, 255, 168, 0.719)"
    flexDirection: "row",
    borderLeftWidth: 1,
  },
  txtFieldV: {
    margin: 5,
  },
  txtbtn: {
    color: "white",
  },
  btn: {
    width: 300,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4353a1",
    //borderWidth:1,
    borderRadius: 10,
    margin: 20,
  },
  btnAlert: {
    width: 280,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEDD00",
    //borderWidth:1,
    borderRadius: 10,
    margin: 20,
  },
  errorMessage: {
    padding: 20,
    backgroundColor: "#ffcccb",
    margin: 10,
    borderRadius: 10,
  },
});
