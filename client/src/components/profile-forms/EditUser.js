import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { edit } from "../../store/auth/auth-actions";

const initialState = {
  name: "",
  email: "",
  password: "",
  image: "",
};

const EditUser = ({ history }) => {
  const [image, setImage] = useState("");
  const [formData, setFormData] = useState(initialState);

  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const userData = { ...initialState };
    if (user) {
      for (const key in user.payload) {
        if (key in userData) {
          userData[key] = user.payload[key];
        }
        setFormData(userData);
      }
    }
  }, [user]);

  const { name, email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(
      edit({
        name,
        email,
        password,
        image,
      })
    );
  };

  return (
    <main>
      {user && !loading && (
        <div className="registerlogin edit-user desktop-mt-5 maxw-70">
          <div className="registerlogin-left">
            <div className="edit-user">
              <img
                src={
                  image
                    ? URL.createObjectURL(image)
                    : user.payload.profilepicture
                }
                alt=""
              />
            </div>
          </div>
          <div className="registerlogin-right">
            <h1 className="large text-primary">Edit Account</h1>
            <p className="lead mb-5">
              <i className="fas fa-user"></i>Change your profile picture, email,
              and name
            </p>
            <form className="form" onSubmit={onSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  onChange={onChange}
                  value={name}
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  onChange={onChange}
                  value={email}
                />
              </div>
              <div className="form-group">
                <input
                  name="image"
                  type="file"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                  }}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  required
                  value={password}
                  onChange={onChange}
                />
              </div>
              <input
                type="submit"
                className="link-button w-100 mb-1"
                value="Update"
              />
            </form>
            <Link className="link-button" to={`/profile/${user.payload._id}`}>
              Go Back
            </Link>
          </div>
        </div>
      )}
    </main>
  );
};

export default EditUser;
