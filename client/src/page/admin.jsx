import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AdminComponent } from "../components";
import { setLoading } from "../redux/loading";
import "./style.scss";

const Admin = () => {
  const { user } = useSelector((state) => state);

  const [auth, setAuth] = useState(false);

  const dispatch = useDispatch();

  const location = useLocation();

  useEffect(() => {
    if (!user) {
        if (location?.pathname === "/admin" ) {
            setAuth(true);
            setTimeout(() => {
            dispatch(setLoading(false));
            }, 1000);
        } else {
            setAuth(false);
            setTimeout(() => {
            dispatch(setLoading(false));
            }, 1000);
        }
      }
    }, [location]);

  return (
    <div className="Auth">
      <div className="inner">
            <AdminComponent />
      </div>
    </div>
  );
};

export default Admin;
