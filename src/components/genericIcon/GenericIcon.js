import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function GenericIcon({ name, style, active = false, disabled = false, onPress, show }) {
  return (
    show ? (
      <MaterialIcon
        name={`${name}`}
        style={style}
        onPress={onPress}
        active={!disabled}
      />
    ) : (
      <Icon
        name={`${name}`}
        style={style}
        onPress={onPress}
        active={!disabled}
      />
    )
  );
}
