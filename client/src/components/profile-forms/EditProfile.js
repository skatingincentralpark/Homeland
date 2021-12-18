import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";

import { setAlert } from "../../store/alert/alert-actions";
import { useSelector, useDispatch } from "react-redux";
import {
  createProfile,
  getCurrentProfile,
} from "../../store/profile/profile-actions";

import Hourglass from "../layout/Hourglass";

const initialState = {
  highschool: "",
  college: "",
  job: "",
  location: "",
  relationshipstatus: "",
  interests: "",
  bio: "",
};

const EditProfile = ({ history }) => {
  const { profile, loading } = useSelector((state) => state.profile);
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (!profile) {
      dispatch(getCurrentProfile());
    }

    if (!loading && profile) {
      const profileData = { ...initialState };
      for (const key in profile) {
        if (key in profileData) {
          profileData[key] = profile[key];
        }
      }
      setFormData(profileData);
    }
  }, [dispatch, loading, profile]);

  const {
    highschool,
    college,
    job,
    location,
    relationshipstatus,
    interests,
    bio,
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (interests === "") {
      dispatch(setAlert("Please fill in interests field", "danger"));
      return;
    }

    dispatch(createProfile(formData, history, true));
  };

  if (!profile && !loading) {
    return <Redirect to="/create-profile" />;
  }

  if (loading)
    return (
      <div className="center">
        <Hourglass />
      </div>
    );

  return (
    <main className="px-3 pt-7-5">
      {profile && !loading && (
        <div className="pre-auth-container">
          <form onSubmit={onSubmit} className="form">
            <div className="form-group">
              <label htmlFor="highschool">Highschool</label>
              <input
                onChange={onChange}
                value={highschool}
                type="text"
                placeholder="Highschool"
                name="highschool"
              />
            </div>
            <div className="form-group">
              <label htmlFor="college">College</label>
              <input
                onChange={onChange}
                value={college}
                type="text"
                placeholder="College"
                name="college"
              />
            </div>
            <div className="form-group">
              <label htmlFor="job">Job</label>
              <input
                onChange={onChange}
                value={job}
                type="text"
                placeholder="Job"
                name="job"
              />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                onChange={onChange}
                value={location}
                type="text"
                placeholder="Location"
                name="location"
              />
            </div>
            <div className="form-group">
              <label htmlFor="relationshipstatus">Relationship Status</label>
              <select
                onChange={onChange}
                value={relationshipstatus}
                name="relationshipstatus"
              >
                <option value="">Select Relationship Status</option>
                <option value="Single">Single</option>
                <option value="In a relationship">In a relationship</option>
                <option value="Married">Married</option>
                <option value="Its complicated">It's complicated</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="interests">Interests</label>
              <input
                onChange={onChange}
                value={interests}
                type="text"
                placeholder="Interests"
                name="interests"
              />
            </div>
            <div className="form-group mb-2">
              <label htmlFor="bio">Short Bio</label>
              <textarea
                onChange={onChange}
                value={bio}
                placeholder="A short bio of yourself"
                name="bio"
                maxLength="300"
                rows="4"
              ></textarea>
            </div>
            <button className="link-button w-100 mb-2 btn-success">
              Update
            </button>
          </form>
          <hr />
          {!auth.loading && (
            <Link
              className="link-button w-100 bg-black white mb-05"
              to={`/profile/${auth.user.payload._id}`}
            >
              Go Back
            </Link>
          )}
        </div>
      )}
      <div className="disclaimer"></div>
    </main>
  );
};

export default EditProfile;
