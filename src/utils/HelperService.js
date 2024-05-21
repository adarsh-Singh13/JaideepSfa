import { Colors } from '../themes/Theme';
import moment from 'moment';
import { Toast } from 'native-base';
import {
  Alert,
  BackHandler,
  Linking,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import DeviceInfo from 'react-native-device-info';
// import Geolocation from 'react-native-geolocation-service';
import messaging from '@react-native-firebase/messaging';
import fileExt from 'file-extension';
import base64 from 'react-native-base64';
import RNFS from 'react-native-fs';
import Geolocation from 'react-native-geolocation-service';
import { PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import uuid from 'react-native-uuid';
import { AsyncStorageService } from './AsyncStorage';
var monthMapping = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

var monthMapping1 = [
  'January',
  'Febuary',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function findDayMessage() {
  var data = [
      [0, 4, 'Night'],
      [5, 12, 'Morning'],
      [13, 17, 'Afternoon'],
      [18, 24, 'Night'],
    ],
    hr = new Date().getHours();

  for (var i = 0; i < data.length; i++) {
    if (hr >= data[i][0] && hr <= data[i][1]) {
      return data[i][2];
    }
  }
}

function showToast({
  message = '',
  buttonText = 'Okay',
  duration = 1000,
  position = 'bottom',
  style = '',
}) {
  if (Platform.OS == 'android') {
    ToastAndroid.show(message, ToastAndroid.LONG, ToastAndroid.BOTTOM);
  } else {
    Toast.show({
      text: message,
      buttonText: buttonText,
      duration: duration,
      position: position,
      style: style,
    });
  }
}

function isToday(timestamp) {
  var today = new Date();
  var dateParameter = new Date(timestamp);
  return (
    dateParameter.getDate() === today.getDate() &&
    dateParameter.getMonth() === today.getMonth() &&
    dateParameter.getFullYear() === today.getFullYear()
  );
}

function removeArrFromList(arr, toRemove) {
  let myArray = arr;
  for (let i = myArray.length - 1; i >= 0; i--) {
    for (let j = 0; j < toRemove.length; j++) {
      if (myArray[i] && myArray[i].id === toRemove[j].id) {
        myArray.splice(i, 1);
      }
    }
  }
  return JSON.stringify(myArray);
}
async function requestMessagingPermission() {
    const authstatus=await messaging().requestPermission();
    const enabled=authstatus===messaging.AuthorizationStatus.AUTHORIZED || authstatus===messaging.AuthorizationStatus.PROVISIONAL;
    let token; 
if(enabled){
  console.log('AuthorizationStatus', authstatus);
  token=await getFcmToken();
}
return token;
}
async function getFcmToken() {
  try {
    const fcmtoken = await messaging().getToken();
    if (fcmtoken) {
      console.log(fcmtoken, 'fcmtoken123');
    }
    return fcmtoken;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    // Handle the error appropriately
    return null;
  }
}

function NotificationListner() {
  console.log(
    'Notification caused app to open from background state:',);
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });


  messaging().getInitialNotification().then(remoteMessage => {
    if (remoteMessage) {
      console.log(
        'Notification caused app to open from quit state:',
        remoteMessage.notification,
      );
    }
  
  });

  messaging().onMessage(async remoteMessage=>{
    console.log("remoteMessage",remoteMessage);
  })

}


async function openLocationDialogBox() {
  let isLocationOn = false;
  try {
    isLocationOn =
      await LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message: `<h4 color=${Colors.primary}>Turn On Location? </h4`,
        style: {
          // (optional)
          backgroundColor: Colors.white, // (optional)
        },
        ok: 'YES',
        cancel: 'NO',
        enableHighAccuracy: false, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
        showDialog: true, // false => Opens the Location access page directly
        openLocationServices: true, // false => Directly catch method is called if location services are turned off
        preventOutSideTouch: false, // true => To prevent the location services window from closing when it is clicked outside
        preventBackClick: false, // true => To prevent the location services popup from closing when it is clicked back button
        providerListener: false, // true ==> Trigger locationProviderStatusChange listener when the location state changes
      });
  } catch (error) {
    console.log(error);
  }

  return isLocationOn;
}

async function getGeolocation() {
  try {
    const position = await new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          resolve(position);
        },
        error => {
          reject(error);
        },
        {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
      );
    });
    const {latitude, longitude} = position.coords;
    const location = {latitude, longitude};
    return location;
  } catch (error) {
    console.log('Error getting location: ', error);
    throw error; // Rethrow the error or handle it accordingly.
  }
}

async function requestLocation() {
  let geolocation = null;
  let result2;

  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location.',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log('====================================');
        // console.log(granted);
        // console.log('====================================');
        geolocation = await getGeolocation();
        // console.log('====================================');
        // console.log(geolocation);
        // console.log('====================================');
      } else {
        geolocation = 'DENIED';
      }
    } catch (error) {
      if (error.code === 2) {
        // Location Provider not present
        const isLocationOn = await openLocationDialogBox();
        if (!isLocationOn) {
          Alert.alert('Please turn On GPS and try again.');
        } else {
          geolocation = await getGeolocation();
        }
      }
    }
  } else if (Platform.OS === 'ios') {
 
  result2 = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
  console.log(result2,"resultresult")

  geolocation = await getGeolocation();
  }
  return geolocation;
}

// async function requestLocationPermission() {
// 	//')
// 	let Permission = false;
// 	if (Platform.OS === 'android') {
// 		try {
// 			const granted = await PermissionsAndroid.request(
// 				PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
// 				{
// 					title: 'Storage Permission',
// 					message: 'App needs access to your Location.',
// 					buttonNegative: 'Cancel',
// 					buttonPositive: 'OK',
// 				},
// 			);
// 			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
// 				Permission = true
// 			} else {
// 				Permission = false
// 			}
// 		} catch (err) {
// 			console.log(err)
// 			Permission = false
// 		}
// 	} else if (Platform.OS === 'ios') {
// 		Permission = true;
// 	}

// 	return Permission;
// }

async function requestLocationPermission() {
  let Permission = false;

  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your Location.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Permission = true;
      } else {
        Permission = false;
      }
    } catch (err) {
      console.log(err);
      Permission = false;
    }
  } else if (Platform.OS === 'ios') {
    Permission = true;
  }

  if (Permission) {
    // Retrieve geolocation
     Geolocation.getCurrentPosition(
      position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log('Latitude:', latitude);
        console.log('Longitude:', longitude);
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: false, timeout: 15000, maximumAge: 10000},
    );
  }

  return Permission;
}

async function requestStoragePermission() {
  let storagePermission = false;
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message:
            'App needs access to your Storage to access and store photos.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        storagePermission = true;
      } else {
        // Permission denied, show an alert or user feedback
        Alert.alert(
          'Permission Denied',
          'The app needs storage permission to access and store photos.',
          [
            {
              text: 'OK',
              style: 'cancel',
            },
          ],
        );
      }
    } catch (err) {
      // Handle any errors that may occur during permission request
      console.error('Error requesting storage permission:', err);
    }
  } else if (Platform.OS === 'ios') {
    storagePermission = true;
  }

  return storagePermission;
}

function showTimeRange(timestamp) {
  let value = false;
  timestamp = Number(timestamp);

  try {
    if (timestamp) {
      const since = timestamp,
        elapsed = (new Date().getTime() - since) / 60000;
      console.log(elapsed);

      if (elapsed >= 2) {
        value = true;
      }

      return value;
    }
  } catch (error) {
    return value;
  }
}

// const callNumber = phone => {
//   let phoneNumber = phone;
//   if (Platform.OS !== 'android') {
//     phoneNumber = `telprompt:${phone}`;
//   } else {
//     phoneNumber = `tel:${phone}`;
//   }

//   Linking.canOpenURL(phoneNumber)
//     .then(supported => {
//       if (!supported) {
//         Alert.alert('Phone number is not available');
//       } else {
//         return Linking.openURL(phoneNumber);
//       }
//     })
//     .catch(err => console.log(err));
// };

const callNumber = async (phone) => {
	let phoneNumber = phone;
  
	if (Platform.OS !== 'android') {
	  phoneNumber = `telprompt:${phone}`;
	} else {
	  phoneNumber = `tel:${phone}`;
	}
	
	// console.log('Platform:', Platform.OS);
	// console.log('PhoneNumber:', phoneNumber);
  
	try {
	  await Linking.openURL(phoneNumber);
	} catch (err) {
	  console.error('Error opening phone number:', err);
	  Alert.alert('Could not open phone number');
	}
  };


const showDirectionInGoogleMaps = (lat, lng, searchLabel) => {
  const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
  const latLng = `${lat},${lng}`;
  const label = searchLabel || 'Direction';
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`,
  });

  Linking.openURL(url);
};

function showElapsedTime(timestamp) {
  //console.log(timestamp)

  timestamp = Number(timestamp);
  try {
    if (timestamp) {
      const since = timestamp,
        elapsed = (new Date().getTime() - since) / 1000;
      //console.log(elapsed)

      if (elapsed >= 0) {
        let hours = Math.floor((elapsed / 3600) % 24);
        let minutes = Math.floor((elapsed / 60) % 60);
        let seconds = Math.floor(elapsed % 60);

        hours = hours < 10 ? `0${hours}` : hours;
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        return `${hours} : ${minutes} : ${seconds}`;
      } else {
        return '00 : 00 : 00';
      }
    }
  } catch (error) {
    return '00 : 00 : 00';
  }
}

function convertToSearchableListFormat(params) {
  let list = params?.list;
  let id_key = params?.id_key;
  let label_key = params?.label_key;

  list = list?.map(obj => {
    return {
      id: obj[id_key],
      name: obj[label_key],
    };
  });
  list = sortListFilter(list, 'name', 'ASC');

  return list;
}
function convertToSearchableListFormat2(params) {
  let list = params?.list;
  let id_key = params?.id_key;
  let label_key = params?.label_key;

  list = list?.map(obj => {
    return {
      sfid: obj[id_key],
      name: obj[label_key],
    };
  });

  return list;
}

function convertToSearchableListFormat1(params) {
  let list = params.list;
  // let id_key = params.id_key;
  // let label_key = params.label_key;

  list = list.map(obj => {
    return {
      id: obj,
      name: obj,
    };
  });

  return list;
}

function convertToSearchableListPjpFormat(params) {
  let list = params.list;
  let id_key = params.id_key;
  let label_key = params.label_key;

  list1 = [];
  list.map(obj => {
    if (obj[id_key] && obj[label_key])
      list1.push({
        id: obj[id_key],
        name: obj[label_key],
      });
  });

  return list1;
}

function getAreaName(params) {
  let allAreas = params.areas;
  let selectedId = params.id;
  let selectedAreaName = '';
  allAreas.map(area => {
    if (area.id == selectedId) {
      selectedAreaName = area.name;
    }
  });

  return selectedAreaName;
}

function getNameFromSFID(list, sfid, field = '') {
  let name = '';
  if (sfid) {
    if (field !== '')
      list.map(item => {
        if (item.sfid === sfid) {
          name = item[field];
        }
      });
    else {
      list.map(item => {
        if (item.id === sfid) {
          name = item.name;
        }
      });
    }
  }
  if (name === '') {
    return 'None';
  }
  return name;
}

function getSFIDFromName(list, name, field = '') {
  console.log(list, "ARR1");
  console.log(name, "ARR2");
  console.log(field, "ARR3");
  let sfid = '';
  if (name) {
    if (field !== '')
      list.map(item => {
        if (item.name === name) {
          sfid = item[field];
        }
      });
    else {
      list.map(item => {
        if (item.name === name) {
          sfid = item.id;
        }
      });
    }
  }
  if (sfid === '') {
    return 'None';
  }
  return sfid;
}

function getRemovedObjArrList(list, toRemove, field) {
  let index = [];
  function findIndexInData(data, property, value) {
    for (let i = 0, l = data.length; i < l; i++) {
      if (data[i][property] === value) {
        return i;
      }
    }
    return -1;
  }

  for (let i in toRemove) {
    let value = findIndexInData(list, field, toRemove[i][field]);
    if (value !== -1) {
      index.push(value);
    }
  }

  for (let i = 0; i < index.length; i++) {
    if (i === 0) {
      list.splice(index[i], 1);
    } else {
      index[i] = index[i] - 1;
      list.splice(index[i], 1);
    }
  }

  return list;
}

function convertArrToRNPickerObj(list, field) {
  let transformList = [];
  list.map((item, id) => {
    return transformList.push({id: item.sfid || id, name: item[`${field}`]});
  });
  return transformList;
}

function getCompetitorName(params) {
  let data = params.data;
  let selectedId = params.id;
  let selectedName = '';
  data.map(obj => {
    if (obj.id == selectedId) {
      selectedName = obj.name;
    }
  });

  return selectedName;
}

function currencyValue(value) {
  if (!value) return '';
  return '₹' + value;
}

function FixedcurrencyValue(value) {
  if (!value) return '';
  return '₹' + value.toFixed(2);
}

function FixedDecimalValue(value) {
  if (!value) return '';
  return value.toFixed(2);
}

function calculateDiscount(value) {
  if (!value) return '';
  return '₹' + value;
}

function dateReadableFormat(timestamp) {
  if (!timestamp) return '';
  let dateObj = new Date(timestamp);
  let date = dateObj.getDate();
  let month = dateObj.getMonth() + 1;
  let year = dateObj.getFullYear();
  date = date < 10 ? '0' + date : date;
  month = month < 10 ? '0' + month : month;
  return `${date}/${month}/${year}`;
}

function searchTextListFilter(list, field, searchText, field2) {
  let text = searchText.toLowerCase();
  if (!text || text === '') {
    return list;
  }

  let filteredList = [];

  if (field2) {
    filteredList = list.filter(item => {
      if (item[field] && item[field][field2]) {
        return item[field][field2].toLowerCase().match(text);
      } else {
        return false;
      }
    });
  } else {
    filteredList = list.filter(item => {
      if (item[field]) {
        return item[field].toLowerCase().match(text);
      } else {
        return false;
      }
    });
  }

  if (!Array.isArray(filteredList) && !filteredList.length) {
    return [];
  }

  return filteredList;
}

function filterTextListFilter(list, field, searchText, field2) {
  let text = searchText;
  if (!text || text === '') {
    return list;
  }

  let filteredList = [];

  if (field2) {
    filteredList = list.filter(item => {
      if (item[field] && item[field][field2]) {
        return item[field][field2].match(text);
      } else {
        return false;
      }
    });
  } else {
    filteredList = list.filter(item => {
      if (item[field]) {
        return item[field] == text;
      } else {
        return false;
      }
    });
  }

  if (!Array.isArray(filteredList) && !filteredList.length) {
    return [];
  }

  return filteredList;
}

function multiFieldSearchText(list, searchText) {
  searchText = String(searchText).toLowerCase();
  return list.filter(o =>
    Object.entries(o).some(entry =>
      String(entry[1]).toLowerCase().includes(searchText),
    ),
  );
}

function searchArrayListFilter(list, searchArray, field) {
  if (!searchArray) return list;

  if (!searchArray.length) return list;

  let filteredList = list.filter(item => {
    return item[field] && searchArray.indexOf(item[field]) > -1;
  });

  if (!Array.isArray(filteredList) && !filteredList.length) {
    return [];
  }

  return filteredList;
}

function searchInList(list, value, field) {
  if (!list) return '';

  if (!list.length) return '';

  if (!value) return '';

  let filteredList = list.filter(item => {
    return item[field] == value;
  });

  if (!Array.isArray(filteredList) && !filteredList.length) {
    return [];
  }

  return filteredList[0];
}

function sortAscNew(list, field) {
  let filteredList = list;
  filteredList.sort((a, b) =>
    a[field] > b[field] ? 1 : b[field] > a[field] ? -1 : 0,
  );
  return filteredList;
}

function sortDescNew(list, field) {
  let filteredList = list;
  filteredList.sort((a, b) =>
    a[field] < b[field] ? 1 : b[field] < a[field] ? -1 : 0,
  );
  return filteredList;
}

function sortListFilterNew(list, field, sortType) {
  let filteredList = list;

  if (filteredList?.length == 0) {
    return [];
  }

  if (!field || !sortType) {
    return filteredList;
  }

  filteredList = sortType == 'ASC' ? sortAscNew(filteredList, field) : sortDescNew(filteredList, field);
  return filteredList;
}

// MYcode 

function sortAsc(list, field) {
  let filteredList = list;
	filteredList?.sort((a, b) => (a[field] > b[field]) ? 1 : ((b[field] > a[field]) ? -1 : 0));
	return filteredList;
  }

function sortDesc(list, field) {
  let filteredList = list;
	filteredList?.sort((a, b) => (a[field] < b[field]) ? 1 : ((b[field] < a[field]) ? -1 : 0));
	return filteredList;
  }


function sortListFilter(list, field, sortType) {
  let filteredList = list;

  if (filteredList?.length == 0) {
    return [];
  }

  if (!field || !sortType) {
    return filteredList;
  }

  filteredList = sortType == 'ASC' ? sortAsc(filteredList, field) : sortDesc(filteredList, field);
  return filteredList;
}



function sortAscFilter(list) {
  let filteredList = list;
  filteredList.sort((a, b) => (a > b ? 1 : b > a ? -1 : 0));
  return filteredList;
}

const decorateWithLocalId = payload => ({
  local_id: uuid.v1(),
  ...payload,
});

function getCurrentTimestamp() {
  return new Date().getTime();
}

function convertStringToDate(timestring) {
  return new Date(timestring).getTime();
}

function convertDateToString(timestamp) {
  return new Date(timestamp).toDateString();
}

function getPreviousNDayTimestamp(days, timestamp) {
  if (!timestamp) {
    timestamp = getCurrentTimestamp();
  }
  return timestamp - days * 24 * 60 * 60 * 1000;
}

function getNextNDayTimestamp(days, timestamp) {
  if (!timestamp) {
    timestamp = getCurrentTimestamp();
  }
  return timestamp + days * 24 * 60 * 60 * 1000;
}

function getPrevious7DayTimestamp() {
  return getCurrentTimestamp() - 7 * 24 * 60 * 60 * 1000;
}

function getNext7DayTimestamp() {
  return getCurrentTimestamp() + 7 * 24 * 60 * 60 * 1000;
}

function removeField(obj, fieldName) {
  delete obj[fieldName];
  return obj;
}

function getMonthMappingName(index) {
  return monthMapping[index];
}

function getMonthMappingNameFull(index) {
  return monthMapping1[index];
}

function getMonthName(date) {
  let dateObj = new Date();

  if (date) {
    dateObj = new Date(date);
  }

  return monthMapping[dateObj.getMonth()];
}

function getPreviousMonth(month) {
  //month index, retuuns Previous Month name
  let currentMonth = month;
  if (currentMonth == 0) {
    currentMonth = monthMapping.length - 1;
  } else {
    currentMonth = currentMonth - 1;
  }

  return currentMonth;
}

function getNextMonth(month) {
  //month index, retuuns Next Month name
  let currentMonth = month;
  if (currentMonth == 11) {
    currentMonth = 0;
  } else {
    currentMonth = currentMonth + 1;
  }

  return currentMonth;
}

function getDeviceId() {
  let uniqueId = DeviceInfo.getUniqueId();
  return uniqueId;
}

function findMatchingKeyValueInList(
  list,
  matchingKey,
  matchingValue,
  matchingValueKey,
) {
  let result = [];
  result = list.filter(obj => obj[matchingKey] == matchingValue);

  if (result && result[0]) {
    return result[0][matchingValueKey];
  }
  return '';
}

function getMonthStartAndEndDateTimestamp(
  month = new Date().getMonth(),
  year = new Date().getFullYear(),
) {
  var firstDay = null;
  var lastDay = null;
  firstDay = new Date(year, month, 1);
  lastDay = new Date(year, month + 1, 0);
  return [firstDay.getTime(), lastDay.getTime()];
}

function getFirstName(name) {
  return name.split(' ').slice(0, 1).join(' ');
}

function getLastName(name) {
  return name.split(' ').slice(1).join(' ');
}

function showAlert({heading, message, onSuccess}) {
  return new Promise((resolve, reject) => {
    Alert.alert(
      heading,
      message,
      [
        {
          text: 'Cancel',
          onPress: () => reject('canceled'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: onSuccess ? onSuccess : () => resolve('confirmed'),
        },
      ],
      {cancelable: false},
    );
  });
}

const datesAreOnSameDay = (first, second) => {
  first = new Date(Number(first));
  second = new Date(Number(second));
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
};

const getVisitsDisplayDate = timestamp => {
  if (!timestamp) return '';
  let dateObj = new Date(timestamp);
  let date = dateObj.getDate();
  let month = dateObj.getMonth();
  date = date < 10 ? '0' + date : date;
  return isToday(timestamp)
    ? `Today (${date} ${monthMapping[month]})`
    : `(${date} ${monthMapping[month]})`;
};

const getDashboardDisplayDate = (start, end) => {
  return getDisplayDate(start) + '-' + getDisplayDate(end);
};

const getDisplayDate = timestamp => {
  if (!timestamp) return '';
  let dateObj = new Date(timestamp);
  let date = dateObj.getDate();
  let month = dateObj.getMonth();
  date = date < 10 ? '0' + date : date;
  return `${date} ${monthMapping[month]}`;
};

const getDisplayDateTime = timestamp => {
  if (!timestamp) return '';
  let dateObj = new Date(timestamp);
  let date = dateObj.getDate();
  let month = dateObj.getMonth();
  let hour = dateObj.getHours();
  let min = dateObj.getMinutes();
  date = date < 10 ? '0' + date : date;
  return `${date} ${monthMapping[month]}-${hour}:${min}`;
};

const getDisplayMonth = timestamp => {
  if (!timestamp) return '';
  let dateObj = new Date(timestamp);
  let date = dateObj.getDate();
  let month = dateObj.getMonth();
  let hour = dateObj.getHours();
  let min = dateObj.getMinutes();
  date = date < 10 ? '0' + date : date;
  return `${monthMapping[month]}`;
};

const getPreviousDayTimestamp = timestamp => {
  return timestamp - 1 * 24 * 60 * 60 * 1000;
};

const getNextDayTimestamp = timestamp => {
  return timestamp + 1 * 24 * 60 * 60 * 1000;
};

const convertMomentObjectToUnix = momentObj => {
  return momentObj.unix() * 1000 + 5.5 * 60 * 60 * 1000;
};

const convertMomentDateToTimestamp = date => {
  return moment(date).valueOf();
};

const getBase64DecodeValue = data => {
  if (data) {
    return base64.decode(data);
  }
  return '';
};

function dateReadableFormatWithHyphen(timestamp) {
  let dateObj = timestamp ? new Date(timestamp) : new Date();
  let date = dateObj.getDate();
  let month = dateObj.getMonth() + 1;
  let year = dateObj.getFullYear();
  date = date < 10 ? '0' + date : date;
  month = month < 10 ? '0' + month : month;
  return `${year}-${month}-${date}`;
}

function removeTimestringFromDate(date) {
  if (!date) {
    return '';
  }

  date = date.split('T');
  return date[0];
}

const moveFileToAbsolutePath = (fileUrl, name) => {
  let abspath = RNFS.DocumentDirectoryPath;
  let ext = fileExt(fileUrl);
  return `${abspath}/${name}.${ext}`;
};

const removeDuplicateVisits = data => {
  let mapping = {};
  data.map(obj => {
    if (!mapping[obj.sfid]) {
      mapping[obj.sfid] = obj;
    }
  });

  let visits = [];

  Object.keys(mapping).map(key => {
    visits.push(mapping[key]);
  });

  return visits;
};

const removeDuplicateitem = data => {
  let mapping = {};
  data.map(obj => {
    if (!mapping[obj.sfid]) {
      mapping[obj.sfid] = obj;
    }
  });

  let items = [];

  Object.keys(mapping).map(key => {
    items.push(mapping[key]);
  });

  return items;
};
function numberWithCommas(x) {
  x = Number(x);
  if (x % 1) {
    //number is a decimal
    return x;
  }

  x = x.toString();
  var lastThree = x.substring(x.length - 3);
  var otherNumbers = x.substring(0, x.length - 3);
  if (otherNumbers != '') lastThree = ',' + lastThree;
  var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return res;
}

const removeDuplicateBeat = data => {
  let mapping = {};
  data.map(obj => {
    if (!mapping[obj.id] && obj.id != null) {
      mapping[obj.id] = obj;
    }
  });

  let beats = [];

  Object.keys(mapping).map(key => {
    beats.push(mapping[key]);
  });

  return beats;
};

const removeDuplicateProduct = data => {
  let mapping = {};
  data.map(obj => {
    if (!mapping[obj.name] && obj.id != null) {
      mapping[obj.name] = obj;
    }
  });

  let beats = [];

  Object.keys(mapping).map(key => {
    beats.push(mapping[key]);
  });

  return beats;
};

const visitTypeToAvatarTextAndBgColorMapping = {
  Retailer: {
    text: 'R',
    bgColor: Colors.lightBg1,
  },
  Dealer: {
    text: 'D',
    bgColor: Colors.lightBg2,
  },
  Sites: {
    text: 'L',
    bgColor: Colors.lightBg3,
  },
  Influencer: {
    text: 'I',
    bgColor: Colors.lightBg4,
  },
};

const getAvatarTextAndBgColorForVisitType = visitType => {
  return visitTypeToAvatarTextAndBgColorMapping[visitType];
};

async function requestMultipleStoragePermission() {
  let storagePermission = false;

  try {
    if (Platform.OS === 'android') {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ];

      const results = await PermissionsAndroid.requestMultiple(permissions);

      if (
        results[
          (PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
        ] === RESULTS.GRANTED
      ) {
        storagePermission = true;
      } else {
        storagePermission = false;
      }
    } else if (Platform.OS === 'ios') {
      storagePermission = true;
    }
  } catch (err) {
    storagePermission = false;
  }

  return storagePermission;
}

function getDateTimestamp(date) {
  return new Date(date).getTime();
}

async function requestCameraPermission() {
  let Permission = false;
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'camera Permission',
          message:
            'App needs access to your Camera' + 'so app can take pictures',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Permission = true;
      } else {
        Permission = false;
      }
    } catch (err) {
      Permission = false;
    }
  } else if (Platform.OS === 'ios') {
    Permission = true;
  }

  return Permission;
}

function convertArrayToSearchableListFormat(array) {
  let list = array;
  list = list.map(value => {
    return {
      id: value,
      name: value,
    };
  });

  return list;
}

function checkAppVersion(data) {
	if (data) {
		let version = Platform.OS == 'android' ? data : data.ios__c;
		console.log(`App Version in API = ${version}, App Version from Build = ${DeviceInfo.getVersion()}, and Platform = ${Platform.OS}`);
		if (!version) {
			return;
		}
		version = version.split('.');
		
		let major = Number(version[1]);
		let minor = Number(version[2]);
		// console.log(minor, "app_version_CRM", major)
		if (Platform.OS === 'android') {
			let app_version = DeviceInfo.getVersion() + '';
			
			let app_version_split = app_version.split('.');
			
			if (app_version_split.length >= 3) {
				let app_version_major = Number(app_version_split[1]);
				// console.log("app_version_major", app_version_major)
				let app_version_minor = Number(app_version_split[2]);
				// console.log("app_version_minor", app_version_minor)
				// console.log("app_version_1", app_version_major === major)
				// console.log("app_version_2", app_version_minor === minor)
				if (app_version_major !== major) {
					showAppUpdatePromptAndroid();
					BackHandler.exitApp();
          showToast({
            message: 'Please Update Your Jaideep App',
            duration: '2000'
          });
				} else if (app_version_minor !== minor) {
					showAppUpdatePromptAndroid();
				};
			};
		};
	};
};

function showAppUpdatePromptAndroid() {
  Alert.alert(
    'New Version Available',
    'Please, update app to new version to continue',
    [
      {
        text: 'Update',
        onPress: () =>
          Linking.openURL(
            'https://play.google.com/store/apps/details?id=com.jaideepsfa',
          ),
      },
    ],
    {cancelable: false},
  );
}

let _watchId = null;

export function watchLocation({ callback }) {
  try {
    _watchId = Geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;
        callback({ latitude, longitude });
      },
      error => {
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: false,
        distanceFilter: 100, // Minimum distance (in meters) before updates are sent.
        interval: 100000, // Time (in milliseconds) between updates.
      }
    );
  } catch (error) {
    console.log('Error watching location: ', error);
  }
}

export function clearWatch() {
  if (_watchId !== null) {
    Geolocation.clearWatch(_watchId);
    _watchId = null;
  }
}

function hasNotch() {
  return DeviceInfo.hasNotch();
}

function getCurrentDate(field) {
  if (field) {
    return new Date(field).getDate();
  } else {
    return new Date().getDate();
  }
}

const getAccountType = data => {
  let mapping = {};
  data.map(obj => {
    if (!mapping[obj.account_type__c]) {
      mapping[obj.account_type__c] = obj.account_type__c;
    }
  });

  let types = [];

  Object.keys(mapping).map(key => {
    types.push(mapping[key]);
  });

  return types;
};

function getCombineData(data) {
  let arrList = [];
  Object.entries(data).map(obj => {
    arrList = arrList.concat(obj[1]);
  });
  return arrList;
}

function convertToSearchableListFormatSfid(params) {
  let list = params.list;
  let id_key = params.id_key;
  let label_key = params.label_key;

  list = list.map(obj => {
    return {
      sfid: obj[id_key],
      name: obj[label_key],
    };
  });

  return list;
}

function convertToSearchableListBrand(params) {
  let list = params.list;

  let label_key = params.label_key;
  let arr = [];
  if (list && list.length) {
    list.map(obj => {
      if (obj.brand__c == label_key) arr.push(obj);
    });
  }
  return arr;
}

async function getAsyncColor() {
  let id = '#DC25AA';

  await AsyncStorageService.getItem('color').then(value => {
    console.log(value);
    if (value == 'a049D000002WsFvQAK') {
      console.log(value);
      id = '#666666';
    }
  });
  console.log(id);
  return id;
}


async function requestSmsPermission() {
    try {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
                {
                    title: 'SMS Permission',
                    message: 'This app needs access to your SMS messages to auto-read OTP.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('SMS permission granted');
            } else {
                console.log('SMS permission denied');
            }
        }
    } catch (err) {
        console.warn(err);
    }
}


export const HelperService = {
  findDayMessage,
  requestLocation,
  getGeolocation,
  openLocationDialogBox,
  isToday,
  showToast,
  showElapsedTime,
  convertToSearchableListFormat,
  convertToSearchableListFormat1,
  convertToSearchableListFormat2,
  decorateWithLocalId,
  getCurrentTimestamp,
  callNumber,
  getAreaName,
  currencyValue,
  FixedcurrencyValue,
  dateReadableFormat,
  getCompetitorName,
  searchTextListFilter,
  searchArrayListFilter,
  sortListFilter,
  sortListFilterNew,
  sortAsc,
  sortDesc,
  sortAscNew,
  sortDescNew,
  removeField,
  showDirectionInGoogleMaps,
  datesAreOnSameDay,
  getPrevious7DayTimestamp,
  getNext7DayTimestamp,
  getVisitsDisplayDate,
  getPreviousDayTimestamp,
  getNextDayTimestamp,
  convertMomentObjectToUnix,
  getDisplayDate,
  getPreviousNDayTimestamp,
  getNextNDayTimestamp,
  requestStoragePermission,
  findMatchingKeyValueInList,
  getMonthMappingName,
  getDeviceId,
  getNextMonth,
  getPreviousMonth,
  getDashboardDisplayDate,
  getMonthName,
  multiFieldSearchText,
  getFirstName,
  getLastName,
  getNameFromSFID,
  convertMomentDateToTimestamp,
  getMonthStartAndEndDateTimestamp,
  removeArrFromList,
  showAlert,
  convertArrToRNPickerObj,
  getRemovedObjArrList,
  getBase64DecodeValue,
  moveFileToAbsolutePath,
  convertStringToDate,
  convertDateToString,
  searchInList,
  removeDuplicateVisits,
  dateReadableFormatWithHyphen,
  removeTimestringFromDate,
  getAvatarTextAndBgColorForVisitType,
  FixedDecimalValue,
  requestMultipleStoragePermission,
  getDateTimestamp,
  requestCameraPermission,
  getSFIDFromName,
  convertArrayToSearchableListFormat,
  removeDuplicateBeat,
  checkAppVersion,
  removeDuplicateProduct,
  removeDuplicateitem,
  numberWithCommas,
  requestLocationPermission,
  watchLocation,
  convertToSearchableListPjpFormat,
  sortAscFilter,
  getMonthMappingNameFull,
  hasNotch,
  getDisplayDateTime,
  getCurrentDate,
  filterTextListFilter,
  getAccountType,
  getCombineData,
  getDisplayMonth,
  convertToSearchableListFormatSfid,
  showTimeRange,
  getAsyncColor,
  convertToSearchableListBrand,
  requestMessagingPermission,
  NotificationListner,
  requestSmsPermission,
};
