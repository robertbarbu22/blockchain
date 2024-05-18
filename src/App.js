import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GeneralLayout from "./layout/GeneralLayout";
import HomePage from "./Pages/Home/HomePage";
import AuctionsList from "./Pages/Auctions/AuctionsList";
import AddAuction from "./Pages/Auctions/AddAuction";
import ViewAuction from "./Pages/Auctions/ViewAuction";
import MetamaskLogin from "./Pages/Login";
import PrivateRoute from "./Components/PrivateRoute/Private";
import ListMyAuctions from "./Pages/MyAuctions/ListMyAuctions";

const router = createBrowserRouter([
  {
    path: "/",
    element: <GeneralLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <MetamaskLogin />,
      },
      {
        path: "/auctions",
        children: [
          {
            path: "/auctions",
            element: (
              <PrivateRoute>
                <AuctionsList />
              </PrivateRoute>
            ),
          },
          {
            path: "/auctions/add",
            element: (
              <PrivateRoute>
                <AddAuction />
              </PrivateRoute>
            ),
          },
          {
            path: "/auctions/:id",
            element: (
              <PrivateRoute>
                <ViewAuction />
              </PrivateRoute>
            ),
          },
        ],
      },
      {
        path: "/myAuctions",
        children: [
          {
            path: "/myAuctions",
            element: (
              <PrivateRoute>
                <ListMyAuctions />
              </PrivateRoute>
            ),
          },
        ],
      },
    ],
  },
]);

export const App = () => <RouterProvider router={router}></RouterProvider>;
