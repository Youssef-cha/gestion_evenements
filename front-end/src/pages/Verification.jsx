import axiosClient from "@/axios";
import { setUserVerified } from "@/redux/authSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useSearchParams } from "react-router";
import Loading from "./Loading";
import { toast } from "sonner";

const Verification = () => {
  const [searchParams] = useSearchParams();
  const queries = Object.fromEntries([...searchParams]);
  const dispatch = useDispatch();
  const promise = axiosClient.get(
    `${queries.end}&signature=${queries.signature}`
  );
  toast.promise(promise, {
    loading: "loading...",
    success: () => {
      dispatch(setUserVerified());
      return "email verified successfully";
    },
    error: "verification failed please try again",
  });

  return <Navigate to={"/home"} replace />;
};

export default Verification;
