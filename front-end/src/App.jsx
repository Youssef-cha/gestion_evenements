import React, { useEffect } from "react";
import router from "./router";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router";
import { getCurrentToken, getUser, setLoader } from "./redux/authSlice";

const App = () => {
  const token = useSelector(getCurrentToken);
  const dispatch = useDispatch();
  useEffect(() => {
    if (token) {
      dispatch(getUser());
    } else {
      dispatch(setLoader(false));
    }
  }, [token, dispatch]);
  return <RouterProvider router={router} />;
};

export default App;
