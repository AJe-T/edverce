"use client";

import axios from "axios";
import { useEffect } from "react";

import { useRequestLoader } from "@/hooks/use-request-loader";

export const RequestLoadingProvider = () => {
  const start = useRequestLoader((state) => state.start);
  const stop = useRequestLoader((state) => state.stop);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        start();
        return config;
      },
      (error) => {
        stop();
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        stop();
        return response;
      },
      (error) => {
        stop();
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [start, stop]);

  return null;
};
