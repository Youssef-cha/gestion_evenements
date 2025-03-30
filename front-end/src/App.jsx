import React, { useEffect, useState } from "react";
import router from "./router";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router";
import { getAuthLoader, getCurrentToken, getUser, setLoader } from "./redux/authSlice";
import Loading from "./pages/Loading";

const App = () => {
  const token = useSelector(getCurrentToken);
  const dispatch = useDispatch();
  const loading = useSelector(getAuthLoader);
  
  useEffect(() => {
    if (token) {
      dispatch(getUser());
    } else {
      dispatch(setLoader(false));
    }
  }, [token, dispatch]);
  if (loading) return <Loading />;
  
  return <RouterProvider router={router} />;
};

export default App;
