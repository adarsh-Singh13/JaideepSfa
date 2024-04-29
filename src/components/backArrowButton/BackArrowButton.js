import React from 'react';
import { TouchableOpacity } from 'react-native';
import GenericIcon from '../genericIcon/GenericIcon';
import Style from './BackArrowButtonStyles';
import RouterService from '../../navigation/RouterService';

export default function BackArrowButton({ show, onPress }) {
	return (
		<TouchableOpacity transparent>
			<GenericIcon
				name={'arrow-back'}
				onPress={show ? onPress : RouterService.goBack}
				style={Style.button}
			/>
		</TouchableOpacity>
	)
};