import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import ColorProvider from "./contexts/ColorProvider";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";



createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <ColorProvider>
        <App />
        <Toaster />
      </ColorProvider>
    </Provider>
  </GoogleOAuthProvider>
);
