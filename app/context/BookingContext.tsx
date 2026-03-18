"use client";

import React, { createContext, useContext, useState } from "react";

export interface BookingState {
  movieId: string;
  movieTitle: string;
  date: string;
  time: string;
  seats: string[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

interface BookingContextType {
  booking: BookingState;
  updateBooking: (data: Partial<BookingState>) => void;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const initialState: BookingState = {
  movieId: "m001",
  movieTitle: "เกมปล้นคนตาย",
  date: "",
  time: "",
  seats: [],
  customerName: "",
  customerEmail: "",
  customerPhone: "",
};

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [booking, setBooking] = useState<BookingState>(initialState);

  const updateBooking = (data: Partial<BookingState>) => {
    setBooking((prev) => ({ ...prev, ...data }));
  };

  const resetBooking = () => {
    setBooking(initialState);
  };

  return (
    <BookingContext.Provider value={{ booking, updateBooking, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
