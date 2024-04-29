/**
 * This file defines the base application styles.
 *
 * Use it to define generic component styles (e.g. the default text styles, default button styles...).
 */
import Colors from './Colors'
import Metrics from './Metrics'
import Helpers from './Helpers'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default {
	textFont:  Platform.OS === 'ios' ? 'Montserrat-Bold' : 'Roboto',
	textMsgFont:  Platform.OS === 'ios' ? 'Montserrat-Bold' : 'Roboto_bold',
	textMediumFont: Platform.OS === 'ios' ? 'Montserrat-Bold' : 'Roboto_medium',
	button: {
		backgroundColor: Colors.primary
  },
  
  buttonShadow: {
		elevation: 5,
	    shadowColor: "#000",
	    shadowOffset: {
		  width: 0
		},
		  shadowOpacity: 0.3,
		  shadowRadius: 4,
  },
  divider: {
    borderBottomWidth: .5,
      borderColor:Colors.grey,
      marginVertical:10,
      width: '100%',
      alignSelf: 'center'
  },
  formButton: {
		alignSelf: 'center',
		marginTop: hp('1%'),
		borderRadius: 10,
		height: hp('2%'),
		zIndex: 3,
		width: wp('38%')
	},
	formHeading: {
    alignSelf: 'center',
    color: Colors.headingBlack,
    fontFamily: Platform.OS === 'ios' ? 'Montserrat-Bold' : 'Roboto_bold',
    fontSize: wp('5.9%'),
    marginBottom: hp('2%'),
    marginTop: hp('1%'),
    textTransform: 'uppercase'
  	},
  	picker: {
    borderRadius: 100, 
    width: wp('88%'),
    height: hp('5.7%'),
    marginBottom: hp('3%')
  },
  pickerLabel: {
    color: Colors.placeHolder,
    fontFamily: 'Montserrat-Regular',
    textAlign: "left",
    width: "99%",
    padding: 10,
    flexDirection: "row"
  },
	    mb10: {
	    marginBottom: hp('2%'),
	    height: hp('5.5%'),
	    fontSize: wp('3.7%'),
	    justifyContent: 'center',
	    padding: 0
	},
	   bottomMargin: {
	    marginBottom: hp('7%'),
	    width: '100%'
  	},
  	label: {
	    color: Colors.button,
	    fontFamily:  'Montserrat-Regular',
	    fontSize: wp('4.5%')
  	},
  	formAction: {
    	...Helpers.row,
    	...Helpers.mainSpaceBetween,
    	marginTop: hp('4%'),
  	},
  	formButton: {
    	...Metrics.smallBottomMargin,
    	width: 120,
  	},
  	actionContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: hp('2.5%'),
    marginBottom: hp('2.5%')
  },
  callActionButton: {
    borderWidth: 1.5, 
    alignSelf: 'center', 
    backgroundColor: Colors.clrF1F9FF,
    width: wp('86%')*.28
  },
  directionActionButton: {
    borderWidth: 1.5, 
    alignSelf: 'center', 
    backgroundColor: Colors.clrF1F9FF,
    width: wp('86%')*.38
  },
  addActionButton: {
    borderWidth: 1.5, 
    alignSelf: 'center',
    width: wp('86%')*.28
  },
  callActionButtonText: {
   fontSize: wp('3.5%'),
   fontFamily:  'Montserrat-Medium',
  },
  directionActionButtonText: {
    fontSize: wp('3.5%'),
    fontFamily:  'Montserrat-Medium',
  },
  addActionButtonText: {
    fontSize: wp('4%'),
    fontFamily:  'Montserrat-Medium',
    textTransform: 'uppercase'
  },
  callButtonIcon: {
    color: Colors.button, 
    fontSize: wp('5%'),
    marginRight: 0
  },
  directionActionButtonIcon:{
    color: Colors.button, 
    fontSize: wp('5%'),
    marginRight: 0
  },
  addActionButtonIcon: {
    color: Colors.white, 
    fontSize: wp('9%')
  },
  strip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },

  refreshIcon: {
    color: Colors.grey, 
    fontSize: wp('7.5%'),
    alignSelf: 'center', 
justifyContent:'center',
    padding: 10,
   // position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 2
},
  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
   // flex: 1
  },
  detail: {
    fontFamily: 'Montserrat-Bold',
    color: Colors.clr66,
    fontSize: wp('4%'),
    textTransform: 'capitalize'
  },
  strip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  ttl: {
    color: Colors.clr66,
    fontFamily: 'Montserrat-Regular',
    fontSize: 12
  },
}
