import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { instance } from '../../utils/axios'
import axios, { AxiosError } from 'axios';

interface AuthUserResponse {
	login: string,
	id: string,
	deviceId: string;
}

interface AuthUserPayload {
	login: string;
	password: string;
}

interface ValidationErrors {
	error: string
}

interface authState {
	login: string | null,
	userId: string | null,
	isLoading: boolean,
	error: string | null
	isAuth: boolean
}

export const loginUser = createAsyncThunk<AuthUserResponse, AuthUserPayload, { rejectValue: ValidationErrors }>('auth/loginUser',
	async (dateClient: AuthUserPayload, { rejectWithValue }) => {
		try {
			const { login, password } = dateClient
			const deviceIdFromStorage = localStorage.getItem('deviceId');

			const { data } = await instance.post<AuthUserResponse>(`/auth/login`, {
				login,
				password
			}, {
				withCredentials: true,
				params: {
					deviceId: deviceIdFromStorage
				}
			})

			localStorage.setItem('deviceId', data.deviceId);
			return data
		}
		catch (err) {
			if (!axios.isAxiosError(err)) {
				throw err;
			}
			let error: AxiosError<ValidationErrors> = err
			console.log(error.response)
			if (error.response && error.response.status === 409) return rejectWithValue(error.response.data)
			else throw error
		}
	}
)
export const logoutUser = createAsyncThunk('auth/logoutUser',
	async () => {
		try {
			const deviceIdFromStorage = localStorage.getItem('deviceId');

			await instance.post<AuthUserResponse>(`/auth/logout`, null, {
				withCredentials: true,
				params: {
					deviceId: deviceIdFromStorage
				}
			})
			localStorage.removeItem('deviceId');
		}
		catch (err) {
			console.log(err)
		}
	}
)

export const getMe = createAsyncThunk<AuthUserResponse, void, { rejectValue: ValidationErrors }>('auth/getMe',
	async (_, { rejectWithValue }) => {
		try {

			const deviceIdFromStorage = localStorage.getItem('deviceId');
			const { data } = await instance.get<AuthUserResponse>(`/auth/me`,
				{
					withCredentials: true,
					params: {
						deviceId: deviceIdFromStorage
					}
				})
			localStorage.setItem('deviceId', data.deviceId);
			return data
		}
		catch (err) {
			if (!axios.isAxiosError(err)) {
				throw err;
			}
			let error: AxiosError<ValidationErrors> = err
			if (error.response && error.response.status === 401) return rejectWithValue(error.response.data)
			else throw error
		}
	}
)

const initialState: authState = {
	userId: null,
	login: null,
	isLoading: false,
	error: null,
	isAuth: false
}


export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {	},
	extraReducers: (builder) => {
		builder
			// Логин
			.addCase(loginUser.pending, (state) => {
				state.isLoading = true
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.login = action.payload.login
				state.userId = action.payload.id
				state.isAuth = true
				state.isLoading = false

			})
			.addCase(loginUser.rejected, (state, action) => {
				if (action.payload) {
					console.log(action.payload)
					state.error = action.payload.error
				}
				state.isLoading = false
			})

		builder
			//Логаут
			.addCase(logoutUser.fulfilled, (state) => {
				state.login = null
				state.userId = null
				state.isAuth = false
			})

		builder
			// Проверка авторизации
			.addCase(getMe.pending, (state) => {
				state.isLoading = true
			})
			.addCase(getMe.fulfilled, (state, action) => {
				state.login = action.payload.login
				state.userId = action.payload.id
				state.isLoading = false
				state.isAuth = true
			})
			.addCase(getMe.rejected, (state, action) => {
				if (action.payload) {
					state.error = action.payload.error
				}
				state.isLoading = false
			})
	}
})