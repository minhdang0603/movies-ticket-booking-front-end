"use client";

import { clientAccessToken } from "@/lib/http";
import { CityResType } from "@/schemaValidations/cinema.schema";
import React, {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useReducer,
} from "react";

interface AppState {
  videoUrl: string;
  isModalOpen: boolean;
  cities: CityResType["data"];
}

type AppAction =
  | { type: "OPEN_TRAILER"; payload: string }
  | { type: "CLOSE_TRAILER" }
  | { type: "SET_CITIES"; payload: CityResType["data"] };

const initialState: AppState = {
  videoUrl: "",
  isModalOpen: false,
  cities: [],
};

const reducer = (state: AppState, action: AppAction) => {
  switch (action.type) {
    case "OPEN_TRAILER":
      return {
        ...state,
        isModalOpen: true,
        videoUrl: action.payload,
      };
    case "CLOSE_TRAILER":
      return {
        ...state,
        isModalOpen: false,
        videoUrl: "",
      };
    case "SET_CITIES":
      return {
        ...state,
        cities: action.payload,
      };
    default:
      throw new Error("Action unknown");
  }
};

interface AppContextProps extends AppState {
    dispatch: Dispatch<AppAction>;
}

const AppContext = createContext<AppContextProps>({
  videoUrl: "",
  isModalOpen: false,
  cities: [],
  dispatch: () =>{}
});

export default function AppProvider({
  children,
  initialAccessToken = "",
}: {
  children: React.ReactNode;
  initialAccessToken?: string;
}) {
  const [{ videoUrl, isModalOpen, cities }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      clientAccessToken.value = initialAccessToken;
    }
  }, [initialAccessToken]);

  return (
    <AppContext.Provider value={{ videoUrl, isModalOpen, cities, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
