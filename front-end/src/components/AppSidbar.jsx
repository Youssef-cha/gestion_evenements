import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { logout } from "@/redux/authSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  Bell,
  Calendar,
  ChartLine,
  ChevronUp,
  HomeIcon,
  LogOut,
  User2,
  UserPen,
  Users,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { Link, Navigate } from "react-router";
import { Badge } from "./ui/badge";
import axiosClient from "@/axios";
import { toast } from "sonner";
import { useColorContext } from "@/hooks/useColorContext";
import echo from "@/echo";

const AppSidbar = ({ user }) => {
  const { open } = useSidebar();
  const { notifications } = useColorContext();
  const notificationCount = notifications.filter((notification) => {
    return !notification.read_at;
  }).length;

  

  const sideBarItems = [
    {
      title: "home",
      icon: <HomeIcon className="text-muted-foreground" />,
      link: "/",
    },
    {
      title: "calendar",
      icon: <Calendar className="text-muted-foreground" />,
      link: "/calendar",
    },
    {
      title: "Analytics",
      icon: <ChartLine className="text-muted-foreground" />,
      link: "/analytics",
    },
    {
      title: "Teams and Members",
      icon: <Users className="text-muted-foreground" />,
      link: "/teams-members",
    },
    {
      title: "notifications",
      icon: (
        <div className="relative">
          <Bell className="text-muted-foreground" size={20} />
          {notificationCount > 0 && (
            <Badge className="absolute -bottom-1 -right-1 rounded-full bg-red-500 size-3 p-0 text-[8px]">
              {notificationCount}
            </Badge>
          )}
        </div>
      ),
      link: "/notifications",
    },
  ];
  const dispatch = useDispatch();
  const onClickHandler = async () => {
    const promise = axiosClient.post("/email/verification-notification");
    toast.promise(promise, {
      loading: "loading...",
      success: "email sent successfully",
      error: "error while sending email please try again",
    });
  };
  return (
    <Sidebar collapsible="icon" className="bg-card border-border ">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="capitalize text-muted-foreground">
            application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sideBarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.link}
                      className="text-card-foreground hover:bg-accent/10"
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton asChild>
                  <div className="flex items-center justify-between text-card-foreground hover:bg-accent/10">
                    <div className="flex items-center space-x-2">
                      <User2 size={20} className="text-muted-foreground" />
                      <span>{user.name.split(" ")[0]}</span>
                      {!user.verified && (
                        <Badge variant="warning">Not verified</Badge>
                      )}
                    </div>
                    <ChevronUp className="ml-auto text-muted-foreground" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-58 rounded-lg bg-popover border border-border shadow-lg p-2 space-y-1.5 data-[side=top]:animate-slide-down-fade data-[side=bottom]:animate-slide-up-fade data-[state=open]:animate-in data-[state=closed]:animate-out"
              >
                <DropdownMenuItem asChild>
                  <Link
                    to={"/profile"}
                    className="flex space-x-2 items-center focus-visible:outline-none cursor-pointer rounded-md border border-transparent hover:border-border hover:bg-accent/10 transition-all duration-200 px-3 py-2 text-popover-foreground hover:translate-x-1 active:scale-95"
                  >
                    <UserPen size={20} className="text-muted-foreground" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <div className="flex space-x-2 items-center focus-visible:outline-none cursor-pointer rounded-md border border-transparent hover:border-border hover:bg-accent/10 transition-all duration-200 px-3 py-2 text-popover-foreground w-full hover:translate-x-1 active:scale-95">
                        <LogOut size={20} className="text-muted-foreground" />
                        <span>Log out</span>
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border animate-in fade-in-0 zoom-in-95 duration-200">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-card-foreground">
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                          if you proceed, you will be logged out and will need
                          to provide your credentials to log in again.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors active:scale-95">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <button
                            className="bg-destructive hover:bg-destructive/90 cursor-pointer text-destructive-foreground transition-all duration-200 active:scale-95"
                            onClick={() => dispatch(logout())}
                          >
                            Log out
                          </button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {!user.verified && open && (
              <button
                onClick={onClickHandler}
                className="block w-full bg-amber-200 mt-2 px-2 text-yellow-900 rounded-md py-1 text-sm font-semibold underline cursor-pointer "
              >
                Verify Your accout
              </button>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidbar;
