import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { SymbolView } from 'expo-symbols';
import { useColors } from '@/hooks/useColors';
function NativeTabLayout(){return <NativeTabs><NativeTabs.Trigger name="index"><Icon sf={{default:'house',selected:'house.fill'}}/><Label>Home</Label></NativeTabs.Trigger><NativeTabs.Trigger name="meals"><Icon sf={{default:'fork.knife',selected:'fork.knife'}}/><Label>Meals</Label></NativeTabs.Trigger><NativeTabs.Trigger name="progress"><Icon sf={{default:'chart.line.uptrend.xyaxis',selected:'chart.line.uptrend.xyaxis'}}/><Label>Progress</Label></NativeTabs.Trigger><NativeTabs.Trigger name="profile"><Icon sf={{default:'person',selected:'person.fill'}}/><Label>Profile</Label></NativeTabs.Trigger></NativeTabs>}
function ClassicTabLayout(){const c=useColors();return <Tabs screenOptions={{headerShown:false,tabBarActiveTintColor:c.primary,tabBarInactiveTintColor:c.mutedForeground,tabBarStyle:{position:'absolute',height:84,paddingTop:8,backgroundColor:'#0B0A10',borderTopWidth:1,borderTopColor:c.border,elevation:0},tabBarLabelStyle:{fontSize:10,fontWeight:'600'}}}><Tabs.Screen name="index" options={{title:'Home',tabBarIcon:({color})=><Feather name="home" size={21} color={color}/>}}/><Tabs.Screen name="meals" options={{title:'Meals',tabBarIcon:({color})=><Feather name="coffee" size={21} color={color}/>}}/><Tabs.Screen name="progress" options={{title:'Progress',tabBarIcon:({color})=><Feather name="trending-up" size={21} color={color}/>}}/><Tabs.Screen name="profile" options={{title:'Profile',tabBarIcon:({color})=><Feather name="user" size={21} color={color}/>}}/></Tabs>}
export default function TabLayout(){return isLiquidGlassAvailable()?<NativeTabLayout/>:<ClassicTabLayout/>}