import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from "react-native-maps"
import {StyleSheet,View,Dimensions,Text,TouchableOpacity} from "react-native"
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
import { GOOGLE_API_KEY } from "../environments"
import { useRef, useState } from "react"
import MapViewDirections from "react-native-maps-directions"
import Styles from '../Style';
import {Box, Center, Flex,  Button, Modal, FormControl, Input, NativeBaseProvider, Spacer } from "native-base";
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get("window")
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.02
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const INITIAL_POSITION = {
  latitude: 40.76711,
  longitude: -73.979704,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA
}

function InputAutocomplete({ label, placeholder, onPlaceSelected }) {
  return (
    <>
      <Text>{label}</Text>
      <GooglePlacesAutocomplete
        styles={{ textInput: Styles.input }}
        placeholder={placeholder || ""}
        fetchDetails
        onPress={(data, details = null) => {
          onPlaceSelected(details)
        }}
        query={{
          key: GOOGLE_API_KEY,
          language: "en-Us"
        }}
      />
    </>
  )
}



export default function MapScreen() {
  const [origin, setOrigin] = useState()
  const [destination, setDestination] = useState()
  const [showDirections, setShowDirections] = useState(false)
  const [distance, setDistance] = useState(0)
  const [duration, setDuration] = useState(0)
  const [visible, setVisible] = useState(false);
  const [speedsets, setspeedsets] = useState([]);
  const [decodedpolyline, setdecodedpolyline] = useState([]);
  const mapRef = useRef(null)
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [originTemp, setOriginTemp] = useState('')
  const [destTemp, setDestTemp] = useState('')
  var origin_temp;
  var destination_temp;

  const moveTo = async position => {
    const camera = await mapRef.current?.getCamera()
    if (camera) {
      camera.center = position
      mapRef.current?.animateCamera(camera, { duration: 1000 })
    }
  }

  const edgePaddingValue = 70

  const edgePadding = {
    top: edgePaddingValue,
    right: edgePaddingValue,
    bottom: edgePaddingValue,
    left: edgePaddingValue
  }

  const traceRouteOnReady = args => {
    if (args) {
      // args.distance
      // args.duration
      setDistance(args.distance)
      setDuration(args.duration)
    }
  }

  const traceRoute = () => {
    if (origin && destination) {
      setShowDirections(true)
      mapRef.current?.fitToCoordinates([origin, destination], { edgePadding })
      var request_data = {
        "origin":{
          "location":{
            "latLng":{
              "latitude": origin.latitude,
              "longitude": origin.longitude
            }
          }
        },
        "destination":{
          "location":{
            "latLng":{
              "latitude": destination.latitude,
              "longitude": destination.longitude
            }
          }
        },
        "travelMode": "DRIVE",
        "routingPreference": "TRAFFIC_AWARE_OPTIMAL",
        "extraComputations": ["TRAFFIC_ON_POLYLINE"],
       
        "computeAlternativeRoutes": false,
        "routeModifiers": {
          "avoidTolls": false,
          "avoidHighways": false,
          "avoidFerries": false
        },
        "languageCode": "en-US",
        "units": "IMPERIAL"
      }; 
 
       fetch(`https://routes.googleapis.com/directions/v2:computeRoutes`,{
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key' : "AIzaSyCJ-U-AruCKD2yyfEam5wMcWAMCIVT6BS8",
          'X-Goog-FieldMask': '*'
        },
        body: JSON.stringify(request_data)
       } ).then(
      response=> response.json()).then(
        data => {
         
          var decodePolyline = require('decode-google-map-polyline');
          var polyline = data.routes[0].polyline.encodedPolyline;
       
          setdecodedpolyline(decodePolyline(polyline));
          setspeedsets(data.routes[0].travelAdvisory.speedReadingIntervals);
        }
      ).catch(error => console.log(error))


      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${origin.latitude}&lon=${origin.longitude}&units=metric&appid=d885aa1d783fd13a55050afeef620fcb`).then(
      response=> response.json()).then(
        data => {
          origin_temp = Math.round(data.main.temp)+"°C";
          setOriginTemp(origin_temp);
        }
      ).catch(error => console.log(error))

      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${destination.latitude}&lon=${destination.longitude}&units=metric&appid=d885aa1d783fd13a55050afeef620fcb`).then(
        response=> response.json()).then(
          data => {
            destination_temp = Math.round(data.main.temp)+"°C";
            setDestTemp(destination_temp);
          }
        ).catch(error => console.log(error))

    }
  }

  const onPlaceSelected = (details, flag) => {
    const set = flag === "origin" ? setOrigin : setDestination
    const position = {
      latitude: details?.geometry.location.lat || 0,
      longitude: details?.geometry.location.lng || 0
    }
    set(position)
    moveTo(position)
  }

  
  return (
    <View style={Styles.container}>
     
      <MapView
        ref={mapRef}
        style={Styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_POSITION}
      >
        {origin && <Marker coordinate={origin} />}
        {destination && <Marker coordinate={destination} />}
        {showDirections && origin && destination && decodedpolyline && (
          <>
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_API_KEY}
            strokeColor="#000000"
            strokeWidth={0}
            onReady={traceRouteOnReady}
          />
          <Polyline coordinates={decodedpolyline}  strokeColor = '#3492eb' strokeWidth = {10} zIndex = {10000}  />
                {
                    speedsets.map( (speedinfo, index) => { if(speedinfo.speed == "SLOW")
                    {
        
                        var start_loc = speedinfo.startPolylinePointIndex;
                        var end_loc = speedinfo.endPolylinePointIndex;
                        var path = [];
                        for(var i = start_loc; i <= end_loc; i++)
                        {
                            path.push(decodedpolyline[i]);
                        }
                      
                       
                        return <Polyline key={index}  coordinates={path}  strokeColor = '#f7c736' strokeWidth = {10}  zIndex = {20000}  />
                    }
            })

                        }

        {
                speedsets.map( (speedinfo, index) => {  if(speedinfo.speed == "TRAFFIC_JAM")
                {
                    var start_loc = speedinfo.startPolylinePointIndex;
                    var end_loc = speedinfo.endPolylinePointIndex;
                    var path = [];
                    for(var i = start_loc; i <= end_loc; i++)
                    {
                        path.push(decodedpolyline[i]);
                    }
                
                    return <Polyline key={index}  coordinates={path} strokeColor = '#a23633' strokeWidth = {10}  zIndex = {20000}/>
                }
            })
            }
        </>
        )}
      </MapView>
      <View style={Styles.searchContainer}>
      <Icon onPress={() => setVisible(true)} name="navigate" size={40} color="#3365FD"  style={Styles.icon} /> 
      </View>
        {visible && 
        <View style={Styles.addContainer}> 
            <InputAutocomplete
                label="Origin"
                onPlaceSelected={details => {
                  onPlaceSelected(details, "origin")
                }}
              />
              <InputAutocomplete
                label="Destination"
                onPlaceSelected={details => {
                  onPlaceSelected(details, "destination")
                }}
              />
              <TouchableOpacity style={Styles.button} onPress={traceRoute}>
                <Text style={Styles.buttonText}>Navigate</Text>
              </TouchableOpacity>
              {distance && duration ? (
                <View>
                  <Text>Distance: {distance.toFixed(2)}</Text>
                  <Text>Duration: {Math.ceil(duration)} min</Text>
                  <TouchableOpacity style={Styles.button} onPress={() => {
                    setVisible(false);
                  }}>
                <Text style={Styles.buttonText}>Close</Text>
              </TouchableOpacity>
                 
                </View>
              ) : null }
          </View>
        }
        { originTemp && <NativeBaseProvider>
        <Flex  direction="row" wrap="wrap" w="100%" h="100">
      <Box w={"65%"} margin={2} h={5} alignItems={"center"} justifyContent={"center"}> <Text style={Styles.textheading}>Distance: </Text> </Box>
      <Spacer/>
      <Box w={"25%"} margin={2} h={5} alignItems={"center"} justifyContent={"center"}> <Text style={Styles.textcontent}>{distance} km</Text> </Box>
      <Spacer/>

      <Box w={"65%"} margin={2} h={5} alignItems={"center"} justifyContent={"center"}> <Text style={Styles.textheading}>Duration: </Text> </Box>
      <Spacer/>
      <Box w={"25%"} margin={2} h={5} alignItems={"center"} justifyContent={"center"}> <Text style={Styles.textcontent}>{duration} mins</Text> </Box>
      <Spacer/>

      <Box w={"65%"} margin={2} h={5} alignItems={"center"} justifyContent={"center"}> <Text style={Styles.textheading}>Origin Temp: </Text> </Box>
      <Spacer/>
      <Box w={"25%"} margin={2} h={5} alignItems={"center"} justifyContent={"center"}> <Text style={Styles.textcontent}>{originTemp}</Text> </Box>
      <Spacer/>

      <Box w={"65%"} margin={2} h={5} alignItems={"center"} justifyContent={"center"}> <Text style={Styles.textheading}>Dest Temp: </Text> </Box>
      <Spacer/>
      <Box w={"25%"} margin={2} h={5} alignItems={"center"} justifyContent={"center"}> <Text style={Styles.textcontent}>{destTemp}</Text> </Box>
      <Spacer/>

      
    </Flex>
    </NativeBaseProvider>
}
    </View>

  )
}