import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TriadQuestion from './ListApproach/TriadQuestion';
export const qc = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
    },
    mutations: {
      retry: 2,
    },
  },
});
// src/main.jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <TriadQuestion />, // TriadQuestion ডিফল্ট
      },




    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={qc}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
