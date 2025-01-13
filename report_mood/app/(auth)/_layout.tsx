import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { FC } from 'react'

interface Props {
 
}

 const Layout : FC<Props> = ({}) => {
  return (
   <>
   <Stack initialRouteName='signin'>
            <Stack.Screen name="signin" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false,  }} />
          
          </Stack>
          <StatusBar style="auto" />
   </>
          
    
  )
}

export default Layout