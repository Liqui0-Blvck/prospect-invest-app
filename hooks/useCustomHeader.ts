import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

interface HeaderOptions {
  title: string;
  headerShown?: boolean;
  backgroundColor?: string;
  tintColor?: string;
}

const useCustomHeader = ({
  title,
  headerShown = true,
  backgroundColor = '#000',
  tintColor = '#fff',
}: HeaderOptions) => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown,
      title,
      headerStyle: {
        backgroundColor,
      },
      headerTintColor: tintColor,
    });
  }, [navigation, title, headerShown, backgroundColor, tintColor]);
};

export default useCustomHeader;
