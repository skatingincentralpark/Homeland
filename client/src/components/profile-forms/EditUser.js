import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { edit } from "../../store/auth/auth-actions";
import { deleteAccount } from "../../store/profile/profile-actions";

import Camera from "../../static/svg/camera.svg";

const initialState = {
  name: "",
  email: "",
  password: "",
  image: "",
};

const EditUser = () => {
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
    <main className="px-3 pt-7-5">
      {user && !loading && (
        <div className="pre-auth-container">
          <div className="profile-pic-preview">
            <img
              src={
                image ? URL.createObjectURL(image) : user.payload.profilepicture
              }
              alt=""
            />
          </div>

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

            <div className="image-upload mb-1">
              <input
                type="file"
                id="file"
                accept="image/*"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                }}
              />
              <label htmlFor="file">
                <img src={Camera} alt="" />
                Add a photo
              </label>
            </div>

            <div className="form-group mb-2">
              <input
                type="password"
                placeholder="Password"
                name="password"
                required
                value={password}
                onChange={onChange}
              />
            </div>
            <button className="link-button w-100 mb-2 btn-success">
              Update
            </button>
          </form>
          <hr />
          <Link
            className="link-button w-100 bg-black white mb-05"
            to={`/profile/${user.payload._id}`}
          >
            Go Back
          </Link>
          <button
            className="link-button mt-1 w-100 alert-danger"
            onClick={() => {
              dispatch(deleteAccount());
            }}
          >
            Delete Account
          </button>
        </div>
      )}
      <div className="disclaimer"></div>
    </main>
  );
};

export default EditUser;
