import {StyleSheet,View,Dimensions,Text,TouchableOpacity} from "react-native"
import React from 'react'
const { width, height } = Dimensions.get("window")


export default Styles = StyleSheet.create({
    container_login:{
        display:"flex",
        paddingTop:100,
        height:"100%",
        padding:20,
        backgroundColor:"#ffffff"
    },

    imageContainer:{
        display:"flex",
        alignItems:"center",
        width:"100%",
        marginBottom:10,
    },

    inputContainer:
    {
        display:"flex",
        width:"100%",
        alignItems:"flex-start",
    },

    inputField:{
        height:40,
        borderWidth:2,
        width:"100%",
        marginTop:8,
        marginBottom:20,
        borderColor:"grey",
        backgroundColor:"aliceblue",
        paddingTop:10,
        paddingLeft:20,
        paddingRight:20,
        height:50,
    },

    labelText:{
        fontWeight:500,
        color:"#000"
    },

    pressable:{
        width:"100%",
        backgroundColor:"#0494bf",
        padding:10,
        marginTop:10,
    },

    primaryButton:{
        textAlign:"center",
        fontSize:18,
        fontWeight:600,
        color:"#fff",
    },
    icon:{
        width: 50,
        height:50,
      },
      container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center"
      },
      map: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height - 150
      },
      searchContainer: {
        position: "absolute",
        width: 60,
        height: 60,
        backgroundColor: "white",
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 4,
        padding: 10,
        borderRadius: 8,
        right:10,
        top: 30,
      },
      addContainer:{
        position: "absolute",
        width: "90%",
        backgroundColor: "white",
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 4,
        padding: 8,
        borderRadius: 8,
        right:"5%",
        top: 100
      },
      input: {
        borderColor: "#888",
        borderWidth: 1
      },
      button: {
        backgroundColor: "#bbb",
        paddingVertical: 12,
        marginTop: 16,
        borderRadius: 4
      },
      buttonText: {
        textAlign: "center"
      },
       container: {
        minHeight: 192,
      },
      backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      searchCard:{
        width:"90%"
      },
      textheading:{
        fontSize: 16,
        fontWeight:700,
        width:250
      },
      textcontent:{
        fontSize: 16,
        fontWeight:700,
        width:100
      },
      textContainer:{
        padding:5,
        margin:5,
        display:"flex",
        width:"100%",
        flexWrap:"nowrap"
      }

})