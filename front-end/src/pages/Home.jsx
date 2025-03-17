import { getAuthUser } from "@/redux/authSlice";
import { useSelector } from "react-redux";


const Home = () => {
  const user = useSelector(getAuthUser)
  return <div>welcom {user.name } </div>;
};
export default Home;
