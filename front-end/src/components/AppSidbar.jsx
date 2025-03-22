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
} from "@/components/ui/sidebar";
import { logout } from "@/redux/authSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  Calendar,
  ChevronUp,
  HomeIcon,
  LogOut,
  User2,
  UserPen,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { Link } from "react-router";
import { Badge } from "./ui/badge";

const AppSidbar = ({ user }) => {
  const sideBarItems = [
    {
      title: "home",
      icon: <HomeIcon />,
      link: "/home",
    },
    {
      title: "calendar",
      icon: <Calendar />,
      link: "/calendar",
    },
  ];
  const dispatch = useDispatch();
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={"capitalize"}>
            application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sideBarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.link}>
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User2 size={20} /> 
                      <span>{user.name}</span>
                      {!user.verified && <Badge className={"bg-amber-100"}>Not verified</Badge>}
                    </div>
                    <ChevronUp className="ml-auto" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-58 rounded bg-neutral-800 border"
              >
                <DropdownMenuItem asChild>
                  <Link
                    to={"/profile"}
                    className="flex space-x-2 items-center focus-visible:outline-none cursor-pointer hover:bg-neutral-700 hover:rounded hover:border-gray-400 border-transparent border-2 transition px-3 py-2"
                  >
                    <UserPen size={20} />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <div className="flex space-x-2 items-center focus-visible:outline-none cursor-pointer hover:bg-neutral-700 hover:rounded hover:border-gray-400 border-transparent border-2 transition px-3 py-2">
                        <LogOut size={20} />
                        <span>Log out</span>
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          if you proceed, you will be logged out and will need
                          to provide your credentials to log in again.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <button
                            className="bg-red-500 hover:bg-red-400 cursor-pointer text-white"
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
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidbar;
