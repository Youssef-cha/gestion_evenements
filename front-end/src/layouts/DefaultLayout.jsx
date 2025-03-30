import Loading from "@/pages/Loading";
import { getAuthUser } from "@/redux/authSlice";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidbar from "@/components/AppSidbar";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import axiosClient from "@/axios";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { useColorContext } from "@/hooks/useColorContext";

const DefaultLayout = () => {
  const { isLight, setIsLight } = useColorContext();
  const user = useSelector(getAuthUser);
  const onClickHandler = async () => {
    const promise = axiosClient.post("/email/verification-notification");
    toast.promise(promise, {
      loading: "loading...",
      success: "email sent successfully",
      error: "error while sending email please try again",
    });
  };
  useEffect(() => {
    !user?.verified &&
      toast.warning("Please verify your email", {
        duration: 5000,
        description: (
          <div>
            <p>
              we have sent you a verification email, please check your email and
              verify your account
            </p>
          </div>
        ),
        action: (
          <Button
            className={
              " dark:bg-neutral-900 dark:hover:bg-neutral-800 cursor-pointer text-white  "
            }
            onClick={onClickHandler}
          >
            Resend
          </Button>
        ),
      });
  }, [user]);

  if (!user) return <Navigate to={"/login"} replace />;

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidbar user={user} />
      <main className="dark:bg-neutral-900  bg-white w-full">
        <div className="w-full flex justify-between items-center py-2 px-6">
          <SidebarTrigger />
          <div className="flex items-center space-x-2">
            <Moon />
            <Switch
              className={"dark:bg-red-500"}
              checked={isLight}
              onClick={() => {
                setIsLight(!isLight);
              }}
            />
            <Sun />
          </div>
        </div>
        <Outlet />
        <Toaster />
      </main>
    </SidebarProvider>
  );
};
export default DefaultLayout;
