export class ApiEndPoints {
   static BASE_URL = "https://moriasariyasfa.herokuapp.com/";


//    USER SERVICE API"S

  static LOGIN_SEND = ApiEndPoints.BASE_URL + "login/send";
  static LOGIN_URL = ApiEndPoints.BASE_URL + "login/login";
  static LOG_OUT = ApiEndPoints.BASE_URL + "login/logout";
  static START_DAY_URL = ApiEndPoints.BASE_URL + "attendence/startDay";
  static END_DAY_URL  = ApiEndPoints.BASE_URL + "attendence/endDay";
  static MARK_ABSENT_URL = ApiEndPoints.BASE_URL + "agents/markAbsent";
  static FETCH_AGENT_DETAILS = ApiEndPoints.BASE_URL + "agents/detail";
  static CHECK_ATTENDANCE = ApiEndPoints.BASE_URL + "attendence/getAttendence";
  static FETCH_ALL_PSM = ApiEndPoints.BASE_URL + "party/getAllTeam";
  static GET_APP_VERSION = ApiEndPoints.BASE_URL + "version/getVersion";
  static GET_ROLE = ApiEndPoints.BASE_URL + "teamRole/getRole";
  
  
  // static   = ApiEndPoints.BASE_URL + "";
}
// static   = ApiEndPoints.BASE_URL + "";