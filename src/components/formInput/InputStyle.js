import { StyleSheet } from 'react-native';
import { ApplicationStyles, Colors } from '../../themes/Theme';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

export default StyleSheet.create({
  input: {
   borderColor:Colors.border,
    borderRadius: 8,
    borderWidth: 1,
    elevation:5,
    backgroundColor:'white',
    color: Colors.inputText,
    fontFamily: ApplicationStyles.textMediumFont,
    paddingLeft: 20,
    fontWeight: '700',
    fontSize: 15,
    justifyContent: 'center',
    alignItems: 'center',
    letterSpacing: 0.8,
  },
  inputError: {
    borderColor: Colors.error,
  },
  item: {
    borderBottomWidth: 0,
    marginBottom: 7,
    marginTop: 7,
  },
  itemNumber: {
    marginVertical: 10,
  },

  label: {
    color:Colors.primary,
    fontWeight:'bold',
    fontFamily: ApplicationStyles.textMsgFont,
    paddingLeft: 10,
    fontSize: wp('4.2%')
  },
  placeholder: {
    color: Colors.inputText,
    fontFamily: ApplicationStyles.textMsgFont,
  },
  textArea: {
    borderColor: Colors.border,
    borderRadius: 10,
    borderWidth: 1,
    color: Colors.inputText,
    fontFamily: ApplicationStyles.textMediumFont,
    paddingLeft: 20,
  },
  indicatorView:{width:'100%',backgroundColor:'white',borderColor:Colors.firozi,borderWidth:1.5},
})
