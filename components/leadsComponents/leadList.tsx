import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Lead } from './leadForm';

interface LeadListProps {
  lead: Lead
  renderLeftActions?: () => JSX.Element
  renderRightActions?: () => JSX.Element

}

const LeadList: FC<LeadListProps> = ({ lead }) => {
  return (
    <View>
      
    </View>
  );
}

const styles = StyleSheet.create({})

export default LeadList;
