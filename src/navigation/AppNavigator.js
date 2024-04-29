import { useSelector } from "react-redux";
import AuthScreens from "./AuthScreens";
import UnAuthScreens from "./UnAuthScreens";


export default function screenComponent () {
  // const token = useSelector((state) => state.auth.token);
  const token = false;
  let screenComponent;
  if (token) {
    screenComponent =  <UnAuthScreens />;
  } else {
    screenComponent = <AuthScreens />;
  }
  return screenComponent;
};
