import axiosClient from "@/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const initialState = {
  user: null,
  token: localStorage.getItem("access_token") || null,
  errors: [],
};
const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/login", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (build) => {
    build
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        localStorage.setItem("access_token", action.payload.token);
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.errors = action.payload;
      });
  },
});
export { login };

export default authSlice.reducer;
