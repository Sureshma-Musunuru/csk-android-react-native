import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Platform } from 'react-native';
import MapView, { Marker, AnimatedRegion, Polyline } from 'react-native-maps';
import { GOOGLE_MAP_KEY } from '../constants/googleMapKey';
import imagePath from '../constants/imagePath';
import MapViewDirections from 'react-native-maps-directions';
import Loader from '../components/Loader';
import { locationPermission, getCurrentLocation } from '../helper/helperFunction';
import greenIndicator from '../assets/images//greenIndicator.png';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Home = ({ navigation }) => {
    const mapRef = useRef()
    const markerRef = useRef()
    const [speedsets, setspeedsets] = useState([]);
    const [decodedpolyline, setdecodedpolyline] = useState([]);
    const [originTemp, setOriginTemp] = useState('')
    const [destTemp, setDestTemp] = useState('')

    const [state, setState] = useState({
        curLoc: {
            latitude: 30.7046,
            longitude: 77.1025,
        },
        destinationCords: {},
        isLoading: false,
        coordinate: new AnimatedRegion({
            latitude: 30.7046,
            longitude: 77.1025,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        }),
        time: 0,
        distance: 0,
        heading: 0

    })

    const { curLoc, time, distance, destinationCords, isLoading, coordinate,heading } = state
    const updateState = (data) => setState((state) => ({ ...state, ...data }));


    useEffect(() => {
        getLiveLocation()
    }, [])

    const getLiveLocation = async () => {
        const locPermissionDenied = await locationPermission()
        if (locPermissionDenied) {
            const { latitude, longitude, heading } = await getCurrentLocation()
            console.log("get live location after 4 second",heading)
            animate(latitude, longitude);
            updateState({
                heading: heading,
                curLoc: { latitude, longitude },
                coordinate: new AnimatedRegion({
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                })
            })
        }
    }

    function getLivetraffic(origin,destination)
    {console.log("starteee");
    var origin_temp;
    var destination_temp;
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
    useEffect(() => {
        const interval = setInterval(() => {
            getLiveLocation()
        }, 6000);
        return () => clearInterval(interval)
    }, [])

    const onPressLocation = () => {
        navigation.navigate('chooseLocation', { getCordinates: fetchValue })
    }
    const fetchValue = (data) => {
        console.log("this is data", data)
        updateState({
            destinationCords: {
                latitude: data.destinationCords.latitude,
                longitude: data.destinationCords.longitude,
            }
        })
    }

    const animate = (latitude, longitude) => {
        const newCoordinate = { latitude, longitude };
        if (Platform.OS == 'android') {
            if (markerRef.current) {
                markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
            }
        } else {
            coordinate.timing(newCoordinate).start();
        }
    }

    const onCenter = () => {
        mapRef.current.animateToRegion({
            latitude: curLoc.latitude,
            longitude: curLoc.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        })
    }

    const fetchTime = (d, t) => {
        updateState({
            distance: d,
            time: t
        })
    }

    return (
        <View style={styles.container}>

            {distance !== 0 && time !== 0 && (<View style={{ alignItems: 'center', marginVertical: 16 }}>
                <Text>Time left: {time.toFixed(0)} </Text>
                <Text>Distance left: {distance.toFixed(0)}</Text>
                <Text>Current Location Temp: {originTemp}</Text>
                <Text>Destination Location Temp: {destTemp}</Text>
            </View>)}
            <View style={{ flex: 1 }}>
                <MapView
                    ref={mapRef}
                    style={StyleSheet.absoluteFill}
                    initialRegion={{
                        ...curLoc,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }}
                >

                    <Marker.Animated
                        ref={markerRef}
                        coordinate={coordinate}
                    >
                        <Image
                            source={greenIndicator}
                            style={{
                                width: 40,
                                height: 40,
                                transform: [{rotate: `${heading}deg`}]
                            }}
                            resizeMode="contain"
                        />
                    </Marker.Animated>

                    {Object.keys(destinationCords).length > 0 && (<Marker
                        coordinate={destinationCords}
                        image={imagePath.icGreenMarker}
                    />)}

                    {Object.keys(destinationCords).length > 0 && (<MapViewDirections
                        origin={curLoc}
                        destination={destinationCords}
                        apikey={GOOGLE_MAP_KEY}
                        strokeWidth={0}
                        strokeColor="red"
                        optimizeWaypoints={true}
                        onStart={(params) => {
                            console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                        }}
                        onReady={result => {
                            console.log(`Distance: ${result.distance} km`)
                            console.log(`Duration: ${result.duration} min.`)
                            getLivetraffic(curLoc,destinationCords)
                            fetchTime(result.distance, result.duration),
                                mapRef.current.fitToCoordinates(result.coordinates, {
                                    edgePadding: {
                                        // right: 30,
                                        // bottom: 300,
                                        // left: 30,
                                        // top: 100,
                                    },
                                });
                        }}
                        onError={(errorMessage) => {
                            // console.log('GOT AN ERROR');
                        }}
                    />)}
                    {decodedpolyline && <>
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
                    </>}
                </MapView>
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0
                    }}
                    onPress={onCenter}
                >
                    <Image source={greenIndicator} />
                </TouchableOpacity>
            </View>
            <View style={styles.bottomCard}>
                <Text>Where are you going..?</Text>
                <TouchableOpacity
                    onPress={onPressLocation}
                    style={styles.inpuStyle}
                >
                    <Text>Choose your location</Text>
                </TouchableOpacity>
            </View>
            <Loader isLoading={isLoading} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomCard: {
        backgroundColor: 'white',
        width: '100%',
        padding: 30,
        borderTopEndRadius: 24,
        borderTopStartRadius: 24
    },
    inpuStyle: {
        backgroundColor: 'white',
        borderRadius: 4,
        borderWidth: 1,
        alignItems: 'center',
        height: 48,
        justifyContent: 'center',
        marginTop: 16
    }
});

export default Home;
