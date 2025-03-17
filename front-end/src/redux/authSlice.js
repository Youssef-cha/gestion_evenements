import axiosClient from "@/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const initialState = {
  user: null,
  token: localStorage.getItem("access_token") || null,
  errors: null,
  loading: true,
  formLoading: false,
};
const getUser = createAsyncThunk(
  "auth/user",
  async (payload = null, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/user");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.status);
    }
  }
);
const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/login", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.errors);
    }
  }
);
const register = createAsyncThunk(
  "auth/register",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/register", credentials);
      return response.data;
    } catch (error) {
      rejectWithValue(error.response.data.errors);
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoader: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(login.pending, (state) => {
        state.errors = null;
        state.formLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.formLoading = false;
        state.user = action.payload.user;
        localStorage.setItem("access_token", action.payload.token);
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.errors = action.payload;
        state.formLoading = false;
      })
      .addCase(register.pending, (state) => {
        state.errors = null;
        state.formLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.errors = null;
        state.formLoading = false;
        localStorage.setItem("access_token", action.payload.token);
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.formLoading = false;
        state.errors = action.payload;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        if (action.payload == 422) {
          state.token = null;
        }
        state.loading = false;
      });
  },
});

// selectors
const getAuthUser = (state) => state.auth.user;
const getCurrentToken = (state) => state.auth.token;
const getAuthErrors = (state) => state.auth.errors;
const getAuthLoader = (state) => state.auth.loading;
const getFormLoading = (state) => state.auth.formLoading;

export {
  login,
  register,
  getUser,
  getAuthErrors,
  getAuthUser,
  getCurrentToken,
  getAuthLoader,
  getFormLoading,
};
export const { setLoader } = authSlice.actions;
export default authSlice.reducer;
