import MyStack from "./Stack";
import Login from "./Login";
import Fac from "./Faculty";
import { useUserContext } from "./Context";

const Auth = () => {
  const { user } = useUserContext();
  return (<>{user.isGuestUser ? <Login/> : 
  <>
  {
    user.role=='Student'?<MyStack/>:<Fac/>
  }
  </>}</>);
};

export default Auth;