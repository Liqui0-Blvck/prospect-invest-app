import React, { FC } from 'react'
import { StyleSheet, View } from 'react-native'

interface LayoutProps {
  children: React.ReactNode,
  containerStyle?: Boolean,
}

const Layout: FC<LayoutProps> = ({ children, containerStyle = true,  }) => {
  return (
    <View style={!containerStyle ? null : layoutStyle.container}>
      {children}
    </View>
  )
}

const layoutStyle = StyleSheet.create({
  container: {
    paddingVertical: 50,
    backgroundColor: '#f2f2f7',
    height: '100%',
  },
})

export default Layout
