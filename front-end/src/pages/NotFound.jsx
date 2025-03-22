import React from "react";
import Il from "../assets/404 Error Page not Found.svg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <img width={600} src={Il} alt="404 Error Page not Found" />
      <Button asChild>
        <Link to={"/"}>Return to Home Page</Link>
      </Button>
    </div>
  );
};

export default NotFound;
