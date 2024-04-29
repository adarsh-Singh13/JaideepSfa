import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Colors } from '../../themes/Theme';

export default StyleSheet.create({
  button: {
   color: Colors.primary,
   paddingRight: 10,
   paddingLeft: 5,
   fontSize: wp('7%')
  }
})
