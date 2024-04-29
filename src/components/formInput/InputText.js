import React from 'react'
import { TextInput, View } from 'react-native'
import Style from './InputStyle'

export default function InputText({ placeholder = '', onChange , style = {}, value = '', error = false, label = '', multiline = false, numberOfLines = 4, editable = true }) {
	return (
		<>
			<View style={{ ...Style.item }}>
				<TextInput
					value={String(value || '')}
					placeholder={placeholder}
					style={error ? { ...Style.input, ...Style.inputError, ...style } : { ...Style.input, ...style }}
					onChangeText={onChange}
					placeholderTextColor={Style.placeholder.color}
					editable={editable}
				/>
			</View>
		</>
	)
}

